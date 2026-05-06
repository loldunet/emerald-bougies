const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const app = express();
app.use(cors());
app.use(express.json());

// Payment intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { items } = req.body;
    const amount = items.reduce((sum, item) => {
      return sum + Math.round(item.price * 100) * item.quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Contact form
app.post('/send-contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Champs manquants' });
    }

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.CONTACT_TO,
      subject: `[Contact] ${subject}`,
      html: `<p><strong>De:</strong> ${name} (${email})</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order confirmation
app.post('/send-order-confirmation', async (req, res) => {
  try {
    const { orderId, customer, items, total, shipping, address } = req.body;
    
    const itemsHtml = items.map(i => 
      `<tr><td>${i.name}</td><td>${i.qty}</td><td>${(i.price * i.qty).toFixed(2)} €</td></tr>`
    ).join('');

    await transporter.sendMail({
      from: `"Emerald' Bougies" <${process.env.SMTP_FROM}>`,
      to: customer.email,
      subject: `🕯️ Confirmation de commande ${orderId}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5e6c8;padding:32px;border-radius:12px;border:1px solid #c9a84c">
          <h2 style="color:#c9a84c;font-family:Georgia,serif">Merci pour votre commande !</h2>
          <p>Bonjour ${customer.firstName},</p>
          <p>Votre commande <strong>${orderId}</strong> a été confirmée.</p>
          <table style="width:100%;margin:20px 0;border-collapse:collapse">
            <tr style="border-bottom:1px solid #333"><th style="text-align:left;padding:8px">Produit</th><th>Qté</th><th style="text-align:right">Prix</th></tr>
            ${itemsHtml}
            <tr style="border-top:2px solid #c9a84c"><td colspan="2"><strong>Total</strong></td><td style="text-align:right"><strong>${total.toFixed(2)} €</strong></td></tr>
          </table>
          <p style="color:#666;font-size:12px">Livraison: ${address}</p>
        </div>
      `,
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reply to message
app.post('/send-reply', async (req, res) => {
  try {
    const { to, name, subject, originalMessage, reply } = req.body;
    if (!to || !reply) return res.status(400).json({ error: 'Champs manquants' });

    await transporter.sendMail({
      from: `"Emerald' Bougies" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5e6c8;padding:32px;border-radius:12px;border:1px solid #c9a84c">
          <h2 style="color:#c9a84c;font-family:Georgia,serif">🕯️ Emerald' Bougies</h2>
          <p>Bonjour <strong>${name}</strong>,</p>
          <div style="line-height:1.8;white-space:pre-wrap;margin:20px 0">${reply.replace(/\n/g, '<br/>')}</div>
          <hr style="border:none;border-top:1px solid #333;margin:24px 0"/>
          <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #c9a84c;background:#111;border-radius:0 6px 6px 0">
            <p style="color:#666;font-size:12px;margin:0 0 8px">Message original :</p>
            <p style="color:#999;font-size:12px;line-height:1.6;margin:0;white-space:pre-wrap">${originalMessage}</p>
          </blockquote>
        </div>
      `,
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Status update email
app.post('/send-status-update', async (req, res) => {
  try {
    const { to, name, orderId, status, tracking } = req.body;
    if (!to || !orderId || !status) {
      return res.status(400).json({ error: 'Champs manquants' });
    }

    let subject, html;

    if (status === 'processing') {
      subject = `🕯️ Votre commande ${orderId} est en préparation`;
      html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5e6c8;padding:32px;border-radius:12px;border:1px solid #c9a84c">
        <h1 style="color:#c9a84c;text-align:center">🕯️ Emerald' Bougies</h1>
        <h2 style="color:#c9a84c">Votre commande est en préparation !</h2>
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Votre commande <strong style="color:#c9a84c">${orderId}</strong> est en préparation.</p>
        <div style="background:#111;padding:20px;border-radius:8px;margin:24px 0">
          <p style="margin:0;font-size:18px;color:#3b82f6;font-weight:bold">📦 En préparation</p>
        </div>
        <p>Vous recevrez un email dès qu'elle sera expédiée.</p>
        <hr style="border:none;border-top:1px solid #333;margin:24px 0"/>
        <p style="color:#666;font-size:12px">— L'équipe Emerald' Bougies</p>
      </div>`;
    } else if (status === 'shipped') {
      subject = `🚚 Votre commande ${orderId} est en route !`;
      html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5e6c8;padding:32px;border-radius:12px;border:1px solid #c9a84c">
        <h1 style="color:#c9a84c;text-align:center">🕯️ Emerald' Bougies</h1>
        <h2 style="color:#c9a84c">Votre commande est en route ! 🚚</h2>
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Votre commande <strong style="color:#c9a84c">${orderId}</strong> vient d'être expédiée.</p>
        <div style="background:#111;padding:20px;border-radius:8px;margin:24px 0">
          <p style="margin:0;font-size:18px;color:#8b5cf6;font-weight:bold">🚚 Expédiée</p>
          ${tracking ? `<p style="margin-top:12px"><strong>Suivi:</strong> <span style="color:#c9a84c">${tracking}</span></p><a href="https://www.laposte.fr/outils/track-a-parcel?code=${tracking}" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#c9a84c;color:#0d0d0d;text-decoration:none;border-radius:6px;font-weight:bold">📍 Suivre mon colis</a>` : ''}
        </div>
        <hr style="border:none;border-top:1px solid #333;margin:24px 0"/>
        <p style="color:#666;font-size:12px">— L'équipe Emerald' Bougies</p>
      </div>`;
    } else if (status === 'delivered') {
      subject = `✅ Votre commande ${orderId} est livrée !`;
      html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5e6c8;padding:32px;border-radius:12px;border:1px solid #c9a84c">
        <h1 style="color:#c9a84c;text-align:center">🕯️ Emerald' Bougies</h1>
        <h2 style="color:#c9a84c">Votre commande est livrée ! ✨</h2>
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Nous espérons que vos bougies vous apportent joie et sérénité !</p>
        <div style="background:#111;padding:20px;border-radius:8px;margin:24px 0">
          <p style="margin:0;font-size:18px;color:#10b981;font-weight:bold">✅ Livrée</p>
        </div>
        <hr style="border:none;border-top:1px solid #333;margin:24px 0"/>
        <p style="color:#666;font-size:12px">— L'équipe Emerald' Bougies</p>
      </div>`;
    } else {
      return res.status(400).json({ error: 'Statut non supporté' });
    }

    await transporter.sendMail({
      from: `"Emerald' Bougies" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports.handler = serverless(app);
