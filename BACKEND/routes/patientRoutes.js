// backend/routes/patientRoutes.js
const express = require("express");
const router = express.Router(); // Créer un routeur Express

// Importer les fonctions du contrôleur Patient
const {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/PatientController");

const { protect } = require("../middlewares/authMiddleware"); // Importe le middleware d'authentification
const authorize = require("../middlewares/authorize");

// Définir les routes pour les patients

// Route GET pour obtenir tous les patients et POST pour en créer un nouveau
router
  .route("/")
  .get(protect, authorize("admin", "dentiste"), getPatients)
  .post(protect, authorize("admin", "dentiste", "patient"), createPatient);

// Route GET pour obtenir un patient par ID, PUT pour le mettre à jour, DELETE pour le supprimer
router
  .route("/:id")
  .get(protect, authorize("admin", "dentiste", "patient"), getPatientById)
  .put(protect, authorize("admin", "dentiste", "patient"), updatePatient)
  .delete(protect, authorize("admin"), deletePatient);

module.exports = router;
