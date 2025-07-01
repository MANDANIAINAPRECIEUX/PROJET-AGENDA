// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");

// Nous ajouterons le middleware 'protect' ici plus tard pour la route '/me'
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;
