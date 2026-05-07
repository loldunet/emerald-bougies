require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Stockage messages en mémoire (persiste tant que le serveur tourne)
let contactMessages = [];

const app = express();

// CORS - autoriser le frontend OVH + dev local
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4242',
  'https://emerald-bougies.re',
  'https://www.emerald-bougies.re',
  process.env.FRONTEND_URL,
].filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.post('/api/send-contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Champs manquants' });
    }

    // Sauvegarder le message
    const newMsg = {
      id: `MSG-${Date.now()}`,
      date: new Date().toISOString(),
      name, email, subject, message,
      read: false,
    };
    contactMessages.unshift(newMsg);

    await transporter.sendMail({
      from: `"Emerald Bougies" <${process.env.SMTP_FROM}>`,
      replyTo: email,
      to: process.env.CONTACT_TO,
      subject: `[Emerald Bougies] ${subject} — ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5e6c8;padding:32px;border-radius:12px;border:1px solid #c9a84c">
          <h2 style="color:#c9a84c;font-family:Georgia,serif;margin-top:0">Nouveau message Contact</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#999;width:120px">Nom</td><td style="padding:8px 0"><strong>${name}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#999">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#c9a84c">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#999">Sujet</td><td style="padding:8px 0">${subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #c9a84c;margin:20px 0"/>
          <h3 style="color:#c9a84c;margin-top:0">Message</h3>
          <p style="line-height:1.7;white-space:pre-wrap">${message}</p>
          <hr style="border:none;border-top:1px solid #333;margin:20px 0"/>
          <p style="color:#666;font-size:12px">Message envoyé depuis le formulaire contact de emerald-bougies.re</p>
        </div>
      `,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Erreur envoi email:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/send-order-confirmation', async (req, res) => {
  try {
    const { orderId, customer, items, total, shipping, address } = req.body;
    if (!customer?.email) return res.status(400).json({ error: 'Email manquant' });

    const shippingLabel = shipping === 'express' ? 'Livraison express (2–3j)' : shipping === 'pickup' ? 'Retrait à l\'atelier' : 'Livraison standard (5–7j)';
    const itemsHtml = items.map(i => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;color:#f5e6c8">${i.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;color:#999;text-align:center">×${i.qty}</td>
        <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;color:#c9a84c;text-align:right;font-weight:bold">${(i.price * i.qty).toFixed(2)} €</td>
      </tr>`).join('');

    const info = await transporter.sendMail({
      from: `"Emerald Bougies" <${process.env.SMTP_FROM}>`,
      to: customer.email,
      subject: `✅ Confirmation de commande ${orderId} — Emerald Bougies`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5e6c8;border-radius:12px;overflow:hidden;border:1px solid #c9a84c">
          <div style="background:linear-gradient(135deg,#0d0d0d,#1a1208);padding:36px 40px;text-align:center;border-bottom:1px solid #c9a84c">
            <img src="https://emerald-bougies.re/logo.png" alt="Emerald Bougies" style="max-width:280px;height:auto;display:block;margin:0 auto 16px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))" />
            <p style="color:#999;margin:0;font-size:13px;letter-spacing:.1em">CONFIRMATION DE COMMANDE</p>
          </div>
          <div style="padding:32px 40px">
            <p style="font-size:16px;margin:0 0 8px">Bonjour <strong style="color:#c9a84c">${customer.firstName}</strong>,</p>
            <p style="color:#999;margin:0 0 28px">Merci pour votre commande ! Nous avons bien reçu votre paiement et préparons votre envoi avec soin. 🕯️</p>

            <div style="background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:20px;margin-bottom:24px">
              <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:.1em">Numéro de commande</p>
              <p style="margin:0;font-size:20px;color:#c9a84c;font-weight:bold;font-family:Georgia,serif">${orderId}</p>
            </div>

            <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
              <thead>
                <tr><th style="text-align:left;padding-bottom:10px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.1em;border-bottom:1px solid #c9a84c">Produit</th><th style="text-align:center;padding-bottom:10px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.1em;border-bottom:1px solid #c9a84c">Qté</th><th style="text-align:right;padding-bottom:10px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.1em;border-bottom:1px solid #c9a84c">Prix</th></tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
              <tfoot>
                <tr><td colspan="2" style="padding-top:14px;color:#999;font-size:13px">${shippingLabel}</td><td style="padding-top:14px;color:#c9a84c;text-align:right;font-size:18px;font-weight:bold">${total.toFixed(2)} €</td></tr>
              </tfoot>
            </table>

            <div style="background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;margin-bottom:28px">
              <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:.1em">Adresse de livraison</p>
              <p style="margin:0;color:#f5e6c8">${address}</p>
            </div>

            <p style="color:#999;font-size:13px;line-height:1.7">Vous recevrez un email avec votre numéro de suivi dès l'expédition de votre colis. Pour toute question, répondez à cet email ou contactez-nous sur <a href="mailto:${process.env.CONTACT_TO}" style="color:#c9a84c">${process.env.CONTACT_TO}</a>.</p>
          </div>
          <div style="padding:20px 40px;border-top:1px solid #1e1e1e;text-align:center">
            <p style="margin:0;color:#444;font-size:12px">© Emerald Bougies — Énergie & Harmonie</p>
          </div>
        </div>
      `,
    });

    console.log('Email confirmation envoyé:', info.messageId, 'à', customer.email);
    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('Erreur confirmation commande:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/send-reply', async (req, res) => {
  console.log('📧 [send-reply] Requête reçue:', req.body);
  try {
    const { to, name, subject, originalMessage, reply } = req.body;
    if (!to || !reply) {
      console.log('❌ [send-reply] Champs manquants:', { to, reply });
      return res.status(400).json({ error: 'Champs manquants: to et reply sont requis' });
    }

    await transporter.sendMail({
      from: `"Emerald Bougies" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5e6c8;padding:32px;border-radius:12px;border:1px solid #c9a84c">
          <div style="text-align:center;margin-bottom:24px">
            <img src="https://emerald-bougies.re/logo.png" alt="Emerald Bougies" style="max-width:240px;height:auto;display:block;margin:0 auto;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))" />
          </div>
          <p style="margin-bottom:4px">Bonjour <strong>${name}</strong>,</p>
          <div style="line-height:1.8;white-space:pre-wrap;margin:20px 0">${reply.replace(/\n/g, '<br/>')}</div>
          <hr style="border:none;border-top:1px solid #333;margin:24px 0"/>
          <p style="color:#666;font-size:12px;margin:0">— L'équipe Emerald Bougies</p>
          <hr style="border:none;border-top:1px solid #1a1a1a;margin:24px 0"/>
          <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #c9a84c;background:#111;border-radius:0 6px 6px 0">
            <p style="color:#666;font-size:12px;margin:0 0 8px">Message original :</p>
            <p style="color:#999;font-size:12px;line-height:1.6;margin:0;white-space:pre-wrap">${originalMessage}</p>
          </blockquote>
        </div>
      `,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Erreur envoi réponse:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/send-status-update', async (req, res) => {
  console.log('📧 [send-status-update] Requête reçue:', req.body);
  try {
    const { to, name, orderId, status, tracking, subject, html } = req.body;
    if (!to || !orderId || !status) {
      console.log('❌ [send-status-update] Champs manquants:', { to, orderId, status });
      return res.status(400).json({ error: 'Champs manquants' });
    }

    let emailHTML = html;
    let emailSubject = subject;

    // Templates par défaut si pas de HTML fourni
    if (!emailHTML) {
      if (status === 'processing') {
        emailSubject = `🕯️ Votre commande ${orderId} est en préparation`;
        emailHTML = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5e6c8;padding:32px;border-radius:12px;border:1px solid #c9a84c">
            <div style="text-align:center;margin-bottom:30px">
              <img src="https://emerald-bougies.re/logo.png" alt="Emerald Bougies" style="max-width:260px;height:auto;display:block;margin:0 auto 20px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))" />
            </div>
            <h2 style="color:#c9a84c;font-family:Georgia,serif">Votre commande est en préparation !</h2>
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Grande nouvelle ! Votre commande <strong style="color:#c9a84c">${orderId}</strong> est actuellement en préparation dans notre atelier.</p>
            <div style="background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:20px;margin:24px 0">
              <p style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:.1em">Statut</p>
              <p style="margin:0;font-size:18px;color:#3b82f6;font-weight:bold">📦 En préparation</p>
            </div>
            <p>Nous mettons tout notre savoir-faire artisanal pour préparer votre colis avec soin. Chaque bougie est coulée, assemblée et contrôlée à la main.</p>
            <p>Vous recevrez un nouvel email dès que votre commande sera expédiée avec votre numéro de suivi.</p>
            <hr style="border:none;border-top:1px solid #333;margin:24px 0"/>
            <p style="color:#666;font-size:12px">Merci pour votre confiance !<br/>— L'équipe Emerald' Bougies</p>
          </div>
        `;
      } else if (status === 'shipped') {
        emailSubject = `🚚 Votre commande ${orderId} est en route !`;
        emailHTML = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5e6c8;padding:32px;border-radius:12px;border:1px solid #c9a84c">
            <div style="text-align:center;margin-bottom:30px">
              <img src="https://emerald-bougies.re/logo.png" alt="Emerald Bougies" style="max-width:260px;height:auto;display:block;margin:0 auto 20px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))" />
            </div>
            <h2 style="color:#c9a84c;font-family:Georgia,serif">Votre commande est en route ! 🚚</h2>
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Excellente nouvelle ! Votre commande <strong style="color:#c9a84c">${orderId}</strong> vient d'être expédiée et est en route vers vous.</p>
            <div style="background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:20px;margin:24px 0">
              <p style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:.1em">Statut</p>
              <p style="margin:0;font-size:18px;color:#8b5cf6;font-weight:bold">🚚 Expédiée</p>
              ${tracking ? `<p style="margin:12px 0 0 0;font-size:14px"><strong>Numéro de suivi :</strong> <span style="color:#c9a84c;font-size:16px">${tracking}</span></p>
              <a href="https://www.laposte.fr/outils/track-a-parcel?code=${tracking}" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#c9a84c;color:#0d0d0d;text-decoration:none;border-radius:6px;font-weight:bold">📍 Suivre mon colis</a>` : '<p style="margin:8px 0 0 0;color:#666;font-size:13px">Votre numéro de suivi sera disponible prochainement</p>'}
            </div>
            <p>Votre colis devrait arriver dans les prochains jours selon le mode de livraison choisi.</p>
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            <hr style="border:none;border-top:1px solid #333;margin:24px 0"/>
            <p style="color:#666;font-size:12px">Merci pour votre confiance !<br/>— L'équipe Emerald' Bougies</p>
          </div>
        `;
      } else if (status === 'delivered') {
        emailSubject = `✅ Votre commande ${orderId} est livrée !`;
        emailHTML = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5e6c8;padding:32px;border-radius:12px;border:1px solid #c9a84c">
            <div style="text-align:center;margin-bottom:30px">
              <img src="https://emerald-bougies.re/logo.png" alt="Emerald Bougies" style="max-width:260px;height:auto;display:block;margin:0 auto 20px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))" />
            </div>
            <h2 style="color:#c9a84c;font-family:Georgia,serif">Votre commande est livrée ! ✨</h2>
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Nous espérons que vos bougies vous apportent joie et sérénité !</p>
            <div style="background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:20px;margin:24px 0">
              <p style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:.1em">Statut</p>
              <p style="margin:0;font-size:18px;color:#10b981;font-weight:bold">✅ Livrée</p>
            </div>
            <p>Nous vous remercions pour votre confiance et serions ravis de recevoir votre avis sur nos produits.</p>
            <p>Allumez votre bougie… et laissez la magie opérer 🕯️</p>
            <div style="text-align:center;margin:28px 0;padding:24px;background:#111;border-radius:12px;border:1px solid #1e1e1e">
              <p style="margin:0 0 6px;color:#c9a84c;font-weight:bold;font-size:15px">⭐ Votre avis compte !</p>
              <p style="margin:0 0 16px;color:#999;font-size:13px">Partagez votre expérience et aidez d'autres clients à découvrir nos bougies.</p>
              <a href="https://fr.trustpilot.com/evaluate/emerald-bougies.re" target="_blank" style="display:inline-block;padding:12px 28px;background:#00b67a;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px">⭐ Laisser un avis sur Trustpilot</a>
            </div>
            <hr style="border:none;border-top:1px solid #333;margin:24px 0"/>
            <p style="color:#666;font-size:12px">Merci pour votre confiance !<br/>— L'équipe Emerald' Bougies</p>
          </div>
        `;
      }
    }

    console.log('📤 [send-status-update] Envoi email à:', to);
    console.log('📤 [send-status-update] Sujet:', emailSubject);
    
    const info = await transporter.sendMail({
      from: `"Emerald' Bougies" <${process.env.SMTP_FROM}>`,
      to,
      subject: emailSubject,
      html: emailHTML,
    });
    
    console.log('✅ [send-status-update] Email envoyé:', info.messageId);

    // Envoi invitation Trustpilot automatique à la livraison
    if (status === 'delivered') {
      await transporter.sendMail({
        from: `"Emerald' Bougies" <${process.env.SMTP_FROM}>`,
        to: 'emerald-bougies.re+64ad94766f@invite.trustpilot.com',
        subject: `Invitation avis — ${name} — ${orderId}`,
        html: `
          <p>Nom : ${name}</p>
          <p>Email : ${to}</p>
          <p>Commande : ${orderId}</p>
        `,
      }).catch(e => console.error('Trustpilot invite error:', e.message));
    }

    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('❌ [send-status-update] Erreur envoi email:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const generateInvoicePDF = (data) => {
  return new Promise((resolve, reject) => {
    const { customer, orderId, date, status, items, total, address, tracking } = data;
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const buffers = [];
    doc.on('data', b => buffers.push(b));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const GOLD = '#c9a84c';
    const DARK = '#0d0d0d';
    const W = 495;

    // En-tête fond sombre
    doc.rect(0, 0, 595, 120).fill(DARK);
    doc.fillColor(GOLD).fontSize(22).font('Helvetica-Bold')
      .text("Emerald' Bougies", 50, 35);
    doc.fillColor('#999').fontSize(9).font('Helvetica')
      .text('28 Rue du Tampon — 97430 La Réunion', 50, 62)
      .text('contact@emerald-bougies.re  |  emerald-bougies.re', 50, 75);
    doc.fillColor(GOLD).fontSize(28).font('Helvetica-Bold')
      .text('FACTURE', 400, 40, { align: 'right', width: 145 });

    // Ligne dorée séparatrice
    doc.moveTo(50, 130).lineTo(545, 130).strokeColor(GOLD).lineWidth(1.5).stroke();

    // Infos commande
    let y = 150;
    doc.fillColor('#333').fontSize(9).font('Helvetica-Bold').text('N° COMMANDE', 50, y);
    doc.fillColor(GOLD).fontSize(13).font('Helvetica-Bold').text(orderId, 50, y + 12);
    doc.fillColor('#333').fontSize(9).font('Helvetica-Bold').text('DATE', 200, y);
    doc.fillColor('#222').fontSize(11).font('Helvetica').text(date, 200, y + 12);
    doc.fillColor('#333').fontSize(9).font('Helvetica-Bold').text('STATUT', 350, y);
    doc.fillColor('#222').fontSize(11).font('Helvetica').text(status, 350, y + 12);

    // Facturer à
    y = 210;
    doc.moveTo(50, y).lineTo(545, y).strokeColor('#e0e0e0').lineWidth(0.5).stroke();
    y += 15;
    doc.fillColor('#333').fontSize(9).font('Helvetica-Bold').text('FACTURER À', 50, y);
    doc.fillColor('#111').fontSize(11).font('Helvetica-Bold').text(customer, 50, y + 13);
    doc.fillColor('#444').fontSize(10).font('Helvetica').text(address, 50, y + 27);
    if (tracking) {
      doc.fillColor('#333').fontSize(9).font('Helvetica-Bold').text('SUIVI', 350, y);
      doc.fillColor(GOLD).fontSize(10).font('Helvetica').text(tracking, 350, y + 13);
    }

    // Tableau articles
    y += 70;
    doc.moveTo(50, y).lineTo(545, y).strokeColor(GOLD).lineWidth(1).stroke();
    y += 8;
    doc.fillColor('#666').fontSize(9).font('Helvetica-Bold');
    doc.text('PRODUIT', 50, y);
    doc.text('QTÉ', 360, y, { width: 60, align: 'center' });
    doc.text('PRIX UNIT.', 420, y, { width: 60, align: 'right' });
    doc.text('TOTAL', 480, y, { width: 65, align: 'right' });
    y += 14;
    doc.moveTo(50, y).lineTo(545, y).strokeColor('#ddd').lineWidth(0.5).stroke();
    y += 8;

    items.forEach((item, idx) => {
      if (idx % 2 === 0) doc.rect(50, y - 4, W, 22).fill('#f9f9f9');
      doc.fillColor('#111').fontSize(10).font('Helvetica').text(item.name, 52, y, { width: 290 });
      doc.text(String(item.qty), 360, y, { width: 60, align: 'center' });
      doc.text(`${item.price.toFixed(2)} €`, 420, y, { width: 60, align: 'right' });
      doc.fillColor(GOLD).font('Helvetica-Bold').text(`${(item.price * item.qty).toFixed(2)} €`, 480, y, { width: 65, align: 'right' });
      y += 22;
    });

    // Total
    y += 10;
    doc.moveTo(50, y).lineTo(545, y).strokeColor(GOLD).lineWidth(1).stroke();
    y += 12;
    doc.rect(350, y - 4, 195, 28).fill(DARK);
    doc.fillColor('#999').fontSize(10).font('Helvetica').text('TOTAL TTC', 355, y + 2);
    doc.fillColor(GOLD).fontSize(14).font('Helvetica-Bold').text(`${total.toFixed(2)} €`, 480, y, { width: 60, align: 'right' });

    // Pied de page
    y += 60;
    doc.moveTo(50, y).lineTo(545, y).strokeColor('#e0e0e0').lineWidth(0.5).stroke();
    y += 12;
    doc.fillColor('#999').fontSize(8).font('Helvetica')
      .text("Merci pour votre confiance ! — Emerald' Bougies — SIRET : XXXXXXXXXXXXXXX", 50, y, { align: 'center', width: W });

    doc.end();
  });
};

app.post('/api/send-invoice', async (req, res) => {
  try {
    const { to, customer, orderId, date, status, items, total, address, tracking } = req.body;
    if (!to || !orderId) return res.status(400).json({ error: 'Champs manquants' });

    // Générer le PDF
    const pdfBuffer = await generateInvoicePDF({ customer, orderId, date, status, items, total, address, tracking });

    const itemsHtml = items.map(i => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;color:#f5e6c8">${i.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;color:#999;text-align:center">×${i.qty}</td>
        <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;color:#c9a84c;text-align:right;font-weight:bold">${(i.price * i.qty).toFixed(2)} €</td>
      </tr>`).join('');

    await transporter.sendMail({
      from: `"Emerald' Bougies" <${process.env.SMTP_FROM}>`,
      to,
      subject: `📄 Votre facture ${orderId} — Emerald Bougies`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5e6c8;border-radius:12px;overflow:hidden;border:1px solid #c9a84c">
          <div style="background:linear-gradient(135deg,#0d0d0d,#1a1208);padding:36px 40px;text-align:center;border-bottom:1px solid #c9a84c">
            <img src="https://emerald-bougies.re/logo.png" alt="Emerald Bougies" style="max-width:280px;height:auto;display:block;margin:0 auto 16px" />
            <p style="color:#999;margin:0;font-size:13px;letter-spacing:.1em">FACTURE</p>
          </div>
          <div style="padding:32px 40px">
            <p>Bonjour <strong style="color:#c9a84c">${customer}</strong>,</p>
            <p style="color:#999">Veuillez trouver votre facture en pièce jointe PDF.</p>
            <div style="display:flex;gap:16px;margin-bottom:24px">
              <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px">
                <p style="margin:0 0 4px;font-size:11px;color:#666;text-transform:uppercase">N° Commande</p>
                <p style="margin:0;color:#c9a84c;font-weight:bold">${orderId}</p>
              </div>
              <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px">
                <p style="margin:0 0 4px;font-size:11px;color:#666;text-transform:uppercase">Date</p>
                <p style="margin:0">${date}</p>
              </div>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
              <thead><tr>
                <th style="text-align:left;padding-bottom:10px;color:#666;font-size:12px;text-transform:uppercase;border-bottom:1px solid #c9a84c">Produit</th>
                <th style="text-align:center;padding-bottom:10px;color:#666;font-size:12px;text-transform:uppercase;border-bottom:1px solid #c9a84c">Qté</th>
                <th style="text-align:right;padding-bottom:10px;color:#666;font-size:12px;text-transform:uppercase;border-bottom:1px solid #c9a84c">Prix</th>
              </tr></thead>
              <tbody>${itemsHtml}</tbody>
              <tfoot><tr>
                <td colspan="2" style="padding-top:14px;color:#999;font-size:13px">Total</td>
                <td style="padding-top:14px;color:#c9a84c;text-align:right;font-size:20px;font-weight:bold">${total.toFixed(2)} €</td>
              </tr></tfoot>
            </table>
            <p style="color:#666;font-size:12px">📎 La facture PDF est jointe à cet email.</p>
          </div>
          <div style="padding:20px 40px;border-top:1px solid #1e1e1e;text-align:center">
            <p style="margin:0;color:#444;font-size:12px">© Emerald' Bougies — 28 rue du Tampon, 97430 La Réunion</p>
          </div>
        </div>
      `,
      attachments: [{
        filename: `Facture-${orderId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }],
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Erreur envoi facture:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Routes admin messages (protégées par clé)
const ADMIN_KEY = process.env.ADMIN_KEY || 'emerald2024';

app.get('/api/admin/messages', (req, res) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).json({ error: 'Non autorisé' });
  res.json(contactMessages);
});

app.patch('/api/admin/messages/:id/read', (req, res) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).json({ error: 'Non autorisé' });
  contactMessages = contactMessages.map(m => m.id === req.params.id ? { ...m, read: true } : m);
  res.json({ ok: true });
});

app.delete('/api/admin/messages/:id', (req, res) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).json({ error: 'Non autorisé' });
  contactMessages = contactMessages.filter(m => m.id !== req.params.id);
  res.json({ ok: true });
});

// Health check pour Render
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🌐 API disponible sur: http://localhost:${PORT}/api`);
});
