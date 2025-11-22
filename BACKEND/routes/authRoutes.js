// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUserByEmail,
  sendForgotPasswordEmail,
  resetPassword,
} = require("../controllers/authController");

// Nous ajouterons le middleware 'protect' ici plus tard pour la route '/me'
const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get(
  "/users",
  protect,
  authorize("admin", "patient", "dentiste"),
  getUsers
);
// router.get("/email/:email", getUserByEmail);
router.get("/users/email/:email", protect, getUserByEmail);
router.post("/forgot-password", sendForgotPasswordEmail);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
