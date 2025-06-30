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

// Définir les routes pour les patients

// Route GET pour obtenir tous les patients et POST pour en créer un nouveau
router.route("/").get(getPatients).post(createPatient);

// Route GET pour obtenir un patient par ID, PUT pour le mettre à jour, DELETE pour le supprimer
router
  .route("/:id")
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

module.exports = router;
