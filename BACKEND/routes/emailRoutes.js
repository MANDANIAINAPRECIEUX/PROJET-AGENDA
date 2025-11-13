const express = require("express");
const router = express.Router(); // Créer un routeur Express

const { sendConfirmationEmail } = require("../controllers/emailController.js");
router.post("/confirmation", sendConfirmationEmail);

module.exports = router;
