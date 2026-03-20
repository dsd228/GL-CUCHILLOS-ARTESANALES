const express = require("express");
const cors    = require("cors");
const crypto  = require("crypto");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Mercado Pago ──────────────────────────────────────────────
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "",
});

// ── Middlewares ───────────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
}));

// ── Health check ──────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status:  "ok",
    message: "Backend GL Cuchillos Artesanales 🔪",
    mp:      !!process.env.MP_ACCESS_TOKEN,
  });
});

// ── POST /gl/sena — Seña / Depósito ──────────────────────────
// Body: { producto, precioTotal, porcentajeSena, nombre, email, telefono?, nota?, productoId? }
app.post("/gl/sena", async (req, res) => {
  const {
    producto, precioTotal, porcentajeSena,
    nombre, email, telefono, nota, productoId,
  } = req.body;

  // Validaciones
  if (!producto || !precioTotal || !nombre || !email) {
    return res.status(400).json({
      error: "Faltan datos obligatorios: producto, precioTotal, nombre, email.",
    });
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return res.status(400).json({ error: "Email inválido." });
  }

  const pct   = Math.min(Math.max(Number(porcentajeSena) || 50, 10), 100);
  const monto = Math.round(Number(precioTotal) * pct / 100);

  if (isNaN(monto) || monto <= 0) {
    return res.status(400).json({ error: "Monto de seña inválido." });
  }

  if (!process.env.MP_ACCESS_TOKEN) {
    return res.status(503).json({
      error: "Mercado Pago no configurado. Contactá al administrador.",
    });
  }

  const frontend = process.env.FRONTEND_URL || "https://gl-cuchillos.artesanales.workers.dev";

  try {
    const preference = new Preference(client);

    const body = {
      items: [{
        title:       `Seña ${pct}% — ${producto}`,
        description: `Seña para iniciar encargo artesanal. Total del producto: $${Number(precioTotal).toLocaleString("es-AR")}`,
        quantity:    1,
        unit_price:  monto,
        currency_id: "ARS",
      }],
      payer: {
        name:  nombre,
        email: email,
        ...(telefono ? { phone: { number: String(telefono) } } : {}),
      },
      additional_info: nota
        ? `Nota del cliente: ${nota}`
        : `Encargo: ${producto}`,
      back_urls: {
        success: `${frontend}/confirmacion.html?via=sena&status=approved&prod=${encodeURIComponent(producto)}&pct=${pct}&monto=${monto}`,
        failure: `${frontend}/confirmacion.html?via=sena&status=rejected&prod=${encodeURIComponent(producto)}`,
        pending: `${frontend}/confirmacion.html?via=sena&status=pending&prod=${encodeURIComponent(producto)}`,
      },
      auto_return:          "approved",
      statement_descriptor: "GL CUCHILLOS",
      external_reference:   `gl_sena_${productoId || "custom"}_${Date.now()}`,
      metadata: {
        tipo:            "sena",
        proyecto:        "gl_cuchillos",
        producto_id:     productoId     || "",
        precio_total:    Number(precioTotal),
        porcentaje:      pct,
        monto_sena:      monto,
        cliente_nombre:  nombre,
        cliente_email:   email,
        cliente_tel:     telefono || "",
        nota:            nota     || "",
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

  } catch (err) {
    console.error("Error MP GL seña:", err?.message || err);
    res.status(500).json({
      error: "No se pudo crear la preferencia de pago. Intentá de nuevo.",
    });
  }
});

// ── POST /webhook — MP notifica pagos → WA a Gonzalo ─────────
app.post("/webhook", async (req, res) => {
  const { type, data } = req.body;
  console.log("Webhook MP:", type, data?.id);

  if (type === "payment" && data?.id) {
    try {
      const { MercadoPagoConfig: MPC, Payment } = require("mercadopago");
      const mpClient = new MPC({ accessToken: process.env.MP_ACCESS_TOKEN });
      const payClient = new Payment(mpClient);
      const payment = await payClient.get({ id: data.id });

      if (payment.status === "approved") {
        const meta = payment.metadata || {};
        const nombre  = meta.cliente_nombre || "—";
        const email   = meta.cliente_email  || "";
        const tel     = meta.cliente_tel    || "";
        const prod    = meta.producto_id ? `Producto ID: ${meta.producto_id}` : "pieza artesanal";
        const monto   = payment.transaction_amount
          ? `$${Number(payment.transaction_amount).toLocaleString("es-AR")}`
          : "—";
        const pct     = meta.porcentaje ? `(${meta.porcentaje}% de seña)` : "";

        // Log para Render dashboard
        console.log(`
💰 PAGO APROBADO`);
        console.log(`   Cliente: ${nombre} ${email} ${tel}`);
        console.log(`   Producto: ${prod}`);
        console.log(`   Monto: ${monto} ${pct}`);
        console.log(`   Payment ID: ${payment.id}
`);

        // Construir URL de WA para notificar a Gonzalo
        const waMsg = encodeURIComponent(
          `🔪 *Nuevo pedido GL Cuchillos*

` +
          `👤 Cliente: ${nombre}${email ? " · " + email : ""}${tel ? " · WA: " + tel : ""}
` +
          `📦 ${prod.replace("Producto ID: ", "")}
` +
          `💰 Seña: ${monto} ${pct}
` +
          `🆔 ID pago: ${payment.id}`
        );
        const waUrl = `https://wa.me/5493843458340?text=${waMsg}`;
        console.log(`   WA Gonzalo: ${waUrl}`);
      }
    } catch(e) {
      console.error("Error procesando webhook:", e?.message || e);
    }
  }

  res.sendStatus(200);
});

// ── Arrancar ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ GL Cuchillos backend en puerto ${PORT}`);
  console.log(`   MP configurado: ${!!process.env.MP_ACCESS_TOKEN}`);
});
