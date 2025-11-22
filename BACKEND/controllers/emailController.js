const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendMail = async ({ to, subject, text, html }) => {
  return await transporter.sendMail({
    from: `"Cabinet Dentaire" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};

// =============================
// 🔥 Contrôleur Express
// =============================
const sendConfirmationEmail = async (req, res) => {
  try {
    const { email, sujet, message } = req.body;

    await sendMail({
      to: email,
      subject: sujet,
      text: message,
      html: `<p>${message}</p>`,
    });

    res.status(200).json({ success: true, message: "Email envoyé" });
  } catch (err) {
    console.error("Erreur envoi mail :", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { sendMail, sendConfirmationEmail };
