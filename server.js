// ── LOCAL DEV SERVER ──────────────────────────────────────────────────────────
// Use this to run locally: node server.js  OR  npx nodemon server.js
// For Vercel deployment, this file is NOT used — Vercel uses api/*.js instead.
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Contact ──────────────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: 'All fields required.' });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name} — Portfolio`,
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b><br>${message}</p>`,
    });

    await transporter.sendMail({
      from: `"Yash Raj Sharan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thanks for reaching out!',
      html: `<p>Hey ${name}! Thanks for your message — I'll get back to you soon.<br><br>— Yash</p>`,
    });

    res.json({ success: true, message: 'Message sent!' });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

// ── GitHub Repos ─────────────────────────────────────────────────────────────
app.get('/api/repos', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(
      'https://api.github.com/users/omen18/repos?sort=updated&per_page=100',
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch repos' });
  }
});

// ── Resume ────────────────────────────────────────────────────────────────────
app.get('/api/resume', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'resume.pdf');
  if (!fs.existsSync(filePath))
    return res.status(404).json({ message: 'resume.pdf not found in public/ folder.' });
  res.download(filePath, 'Yash_Raj_Sharan_Resume.pdf');
});

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ── Catch-all → serve frontend ───────────────────────────────────────────────
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

app.listen(PORT, () =>
  console.log(`\n🚀  Portfolio running at http://localhost:${PORT}\n`)
);
