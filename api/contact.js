const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to you
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name} — Portfolio`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;padding:32px;background:#0a0a0a;color:#f0f0f0;border-radius:8px;">
          <h2 style="color:#c8ff00;margin-bottom:20px;">New Portfolio Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p style="margin-top:16px;"><strong>Message:</strong></p>
          <p style="background:#161616;padding:16px;border-left:3px solid #c8ff00;border-radius:4px;">${message}</p>
        </div>`,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: `"Yash Raj Sharan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thanks for reaching out!',
      html: `
        <div style="font-family:sans-serif;max-width:560px;padding:32px;">
          <h2>Hey ${name}! 👋</h2>
          <p>Thanks for reaching out. I've received your message and will get back to you soon.</p>
          <p>— <strong>Yash Raj Sharan</strong><br>
          <a href="https://github.com/omen18">GitHub</a> · 
          <a href="https://linkedin.com/in/yashraj10">LinkedIn</a></p>
        </div>`,
    });

    return res.status(200).json({ success: true, message: 'Message sent!' });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send. Please try again.' });
  }
};
