const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendConfirmationEmail = async (req, res) => {
  try {
    const { email, sujet, message } = req.body;

    console.log("🔑 Clé utilisée:", process.env.RESEND_API_KEY);
    console.log("📧 Envoi à:", email);

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: sujet,
      html: `<h3>📅 Confirmation de rendez-vous</h3><p>${message}</p>`,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
    res.status(500).json({
      success: false,
      message: "Échec de l'envoi de l'email.",
      error: error.message,
    });
  }
};

module.exports = { sendConfirmationEmail };
