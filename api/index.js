// Vercel Serverless Function - API Backend
const express = require('express');

const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'Emerald Bougies API' });
});

// Payment intent (mock for demo - replace with real Stripe in production)
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { items } = req.body;
    const amount = items.reduce((sum, item) => {
      return sum + Math.round(item.price * 100) * item.quantity;
    }, 0);

    // Note: In production, use real Stripe here
    // For demo, return a mock client secret
    res.json({ 
      clientSecret: 'pi_' + Date.now() + '_secret_' + Math.random().toString(36).substring(7),
      amount: amount
    });
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
    // Email would be sent here with nodemailer
    console.log('Contact form:', { name, email, subject });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order confirmation
app.post('/send-order-confirmation', async (req, res) => {
  try {
    const { orderId, customer, items, total } = req.body;
    console.log('Order confirmation:', { orderId, customer, total });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reply to message
app.post('/send-reply', async (req, res) => {
  try {
    const { to, name, reply } = req.body;
    if (!to || !reply) return res.status(400).json({ error: 'Champs manquants' });
    console.log('Reply sent to:', to);
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
    console.log('Status update:', { to, orderId, status, tracking });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
