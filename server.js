const express = require(“express”);
const cors    = require(“cors”);
const https   = require(“https”);
const { MercadoPagoConfig, Preference } = require(“mercadopago”);

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Mercado Pago ──────────────────────────────────────────────
const client = new MercadoPagoConfig({
accessToken: process.env.MP_ACCESS_TOKEN || “”,
});

// ── Middlewares ───────────────────────────────────────────────
app.use(express.json());
app.use(cors({
origin: process.env.FRONTEND_URL || “*”,
}));

// ── Helpers ───────────────────────────────────────────────────

/**

- Manda un mensaje de WhatsApp a Gonzalo via CallMeBot.
- Requiere variable de entorno: CALLMEBOT_KEY
- Para obtenerla: mandar “I allow callmebot to send me messages”
- al +34 644 60 16 21 desde el WA de Gonzalo.
  */
  function notificarWA(mensaje) {
  const apiKey = process.env.CALLMEBOT_KEY;
  const phone  = process.env.GL_WA_PHONE || “5493843458340”;

if (!apiKey) {
console.warn(“⚠️  CALLMEBOT_KEY no configurada — no se envió WA a Gonzalo.”);
return;
}

const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(mensaje)}&apikey=${apiKey}`;

https.get(url, (res) => {
let body = “”;
res.on(“data”, chunk => body += chunk);
res.on(“end”, () => {
if (res.statusCode === 200) {
console.log(“✅ WA enviado a Gonzalo:”, body.trim());
} else {
console.error(`❌ Error CallMeBot (${res.statusCode}):`, body.trim());
}
});
}).on(“error”, err => {
console.error(“❌ Error enviando WA:”, err.message);
});
}

// ── Health check ──────────────────────────────────────────────
app.get(”/”, (req, res) => {
res.json({
status:  “ok”,
message: “Backend GL Cuchillos Artesanales 🔪”,
mp:      !!process.env.MP_ACCESS_TOKEN,
wa:      !!process.env.CALLMEBOT_KEY,
});
});

// ── POST /gl/sena — Crear preferencia de pago ─────────────────
app.post(”/gl/sena”, async (req, res) => {
const {
producto, precioTotal, porcentajeSena,
nombre, email, telefono, nota, productoId,
} = req.body;

if (!producto || !precioTotal || !nombre || !email) {
return res.status(400).json({
error: “Faltan datos obligatorios: producto, precioTotal, nombre, email.”,
});
}
if (!/^[^@]+@[^@]+.[^@]+$/.test(email)) {
return res.status(400).json({ error: “Email inválido.” });
}

const pct   = Math.min(Math.max(Number(porcentajeSena) || 50, 10), 100);
const monto = Math.round(Number(precioTotal) * pct / 100);

if (isNaN(monto) || monto <= 0) {
return res.status(400).json({ error: “Monto de seña inválido.” });
}

if (!process.env.MP_ACCESS_TOKEN) {
return res.status(503).json({
error: “Mercado Pago no configurado. Contactá al administrador.”,
});
}

const frontend = process.env.FRONTEND_URL || “https://gl-cuchillos.artesanales.workers.dev”;

try {
const preference = new Preference(client);

```
const body = {
  items: [{
    title:       `Seña ${pct}% — ${producto}`,
    description: `Seña para iniciar encargo artesanal. Total: $${Number(precioTotal).toLocaleString("es-AR")}`,
    quantity:    1,
    unit_price:  monto,
    currency_id: "ARS",
  }],
  payer: {
    name:  nombre,
    email: email,
    ...(telefono ? { phone: { number: String(telefono) } } : {}),
  },
  additional_info: nota ? `Nota: ${nota}` : `Encargo: ${producto}`,
  back_urls: {
    success: `${frontend}/confirmacion.html?via=sena&status=approved&prod=${encodeURIComponent(producto)}&pct=${pct}&monto=${monto}&nombre=${encodeURIComponent(nombre)}`,
    failure: `${frontend}/confirmacion.html?via=sena&status=rejected&prod=${encodeURIComponent(producto)}`,
    pending: `${frontend}/confirmacion.html?via=sena&status=pending&prod=${encodeURIComponent(producto)}`,
  },
  auto_return:          "approved",
  statement_descriptor: "GL CUCHILLOS",
  external_reference:   `gl_sena_${productoId || "custom"}_${Date.now()}`,
  notification_url:     `${process.env.BACKEND_URL || "https://gl-cuchillos-artesanales.onrender.com"}/webhook`,
  metadata: {
    tipo:           "sena",
    proyecto:       "gl_cuchillos",
    producto_id:    productoId    || "",
    precio_total:   Number(precioTotal),
    porcentaje:     pct,
    monto_sena:     monto,
    cliente_nombre: nombre,
    cliente_email:  email,
    cliente_tel:    telefono || "",
    nota:           nota     || "",
  },
};

const result = await preference.create({ body });

console.log(`✅ Seña creada: ${nombre} — ${producto} — $${monto} (${pct}%)`);

res.json({
  ok:                 true,
  init_point:         result.init_point,
  sandbox_init_point: result.sandbox_init_point,
  preference_id:      result.id,
  monto_sena:         monto,
  porcentaje:         pct,
  precio_total:       Number(precioTotal),
});
```

} catch (err) {
console.error(“Error MP GL seña:”, err?.message || err);
res.status(500).json({
error: “No se pudo crear la preferencia de pago. Intentá de nuevo.”,
});
}
});

// ── POST /webhook — MP notifica pagos ─────────────────────────
app.post(”/webhook”, async (req, res) => {
// Responder 200 inmediatamente para que MP no reintente
res.sendStatus(200);

const { type, data } = req.body;
console.log(“Webhook MP:”, type, data?.id);

if (type !== “payment” || !data?.id) return;

try {
const { MercadoPagoConfig: MPC, Payment } = require(“mercadopago”);
const mpClient  = new MPC({ accessToken: process.env.MP_ACCESS_TOKEN });
const payClient = new Payment(mpClient);
const payment   = await payClient.get({ id: data.id });

```
const estado = payment.status;
const meta   = payment.metadata || {};
const nombre = meta.cliente_nombre || "—";
const email  = meta.cliente_email  || "";
const tel    = meta.cliente_tel    || "";
const prod   = payment.description || meta.producto_id || "pieza artesanal";
const monto  = payment.transaction_amount
  ? `$${Number(payment.transaction_amount).toLocaleString("es-AR")}`
  : "—";
const pct    = meta.porcentaje ? `(${meta.porcentaje}% de seña)` : "";
const payId  = payment.id;

console.log(`💳 Pago ${estado}: ${nombre} — ${prod} — ${monto} ${pct}`);

if (estado === "approved") {
  // 1. Log completo
  console.log(`
```

💰 PAGO APROBADO
Cliente: ${nombre} | ${email} | WA: ${tel}
Producto: ${prod}
Monto: ${monto} ${pct}
Payment ID: ${payId}
`);

```
  // 2. Notificación WA a Gonzalo via CallMeBot
  const msgWA =
    `🔪 *NUEVO PEDIDO — GL Cuchillos*\n` +
    `\n` +
    `👤 ${nombre}` +
    `${email ? `\n📧 ${email}` : ""}` +
    `${tel    ? `\n📱 ${tel}`   : ""}\n` +
    `\n` +
    `📦 *${prod}*\n` +
    `💰 Seña abonada: *${monto}* ${pct}\n` +
    `🆔 ID pago: ${payId}` +
    (meta.nota ? `\n📝 Nota: ${meta.nota}` : "");

  notificarWA(msgWA);

  // 3. Si el cliente dejó su WA, también se le manda confirmación
  if (tel) {
    const telLimpio = tel.replace(/\D/g, "");
    if (telLimpio.length >= 10) {
      const msgCliente =
        `✅ *Hola ${nombre}!* Tu seña para *${prod}* fue recibida.\n` +
        `Monto: *${monto}*\n` +
        `Gonzalo te va a contactar pronto para coordinar los detalles. 🙌`;
      notificarWA(msgCliente);
      // Nota: CallMeBot solo puede enviar al número registrado (Gonzalo).
      // Para enviar al cliente necesitaría Twilio.
      // Por ahora loguea para que Gonzalo lo contacte manualmente.
      console.log(`📲 Cliente con WA registrado: ${tel} — Gonzalo puede contactarlo.`);
    }
  }

} else if (estado === "rejected") {
  console.log(`❌ Pago rechazado: ${nombre} — ${prod} — ${monto}`);
  notificarWA(`⚠️ Pago rechazado\n👤 ${nombre}\n📦 ${prod}\n💰 ${monto}`);

} else if (estado === "pending") {
  console.log(`⏳ Pago pendiente: ${nombre} — ${prod} — ${monto}`);
}
```

} catch(e) {
console.error(“Error procesando webhook:”, e?.message || e);
}
});

// ── Arrancar ──────────────────────────────────────────────────
app.listen(PORT, () => {
console.log(`✅ GL Cuchillos backend en puerto ${PORT}`);
console.log(`   MP configurado: ${!!process.env.MP_ACCESS_TOKEN}`);
console.log(`   WA (CallMeBot): ${!!process.env.CALLMEBOT_KEY}`);
});
