require('dotenv').config();
const nodemailer = require('nodemailer');

const t = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

t.sendMail({
  from: 'Emerald Bougies <' + process.env.SMTP_FROM + '>',
  to: process.env.CONTACT_TO,
  subject: 'Test SMTP Brevo',
  html: '<p>Test OK depuis le serveur Brevo</p>'
}).then(r => console.log('OK', r.messageId)).catch(e => console.error('ERR', e.message));
