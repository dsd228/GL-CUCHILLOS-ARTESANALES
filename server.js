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

// ── POST /webhook — MP notifica pagos ────────────────────────
app.post("/webhook", (req, res) => {
  const { type, data } = req.body;
  console.log("Webhook MP:", type, data?.id);
  // GL Cuchillos no descuenta stock — solo log
  res.sendStatus(200);
});

// ── Arrancar ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ GL Cuchillos backend en puerto ${PORT}`);
  console.log(`   MP configurado: ${!!process.env.MP_ACCESS_TOKEN}`);
});
