// backend/routes/rendezVousRoutes.js
const express = require("express");
const router = express.Router(); // Créer un routeur Express

// Importer les fonctions du contrôleur RendezVous
const {
  getRendezVous,
  getRendezVousById,
  createRendezVous,
  updateRendezVous,
  deleteRendezVous,
} = require("../controllers/RendezVousController"); // Notez 'RendezVousController'
const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");
// Définir les routes pour les rendez-vous

// Route GET pour obtenir tous les rendez-vous et POST pour en créer un nouveau
router
  .route("/")
  .get(protect, authorize("admin", "dentiste"), getRendezVous)
  .post(protect, authorize("admin", "dentiste", "patient"), createRendezVous);

// Route GET pour obtenir un rendez-vous par ID, PUT pour le mettre à jour, DELETE pour le supprimer
router
  .route("/:id")
  .get(protect, authorize("admin", "dentiste", "patient"), getRendezVousById)
  .put(protect, authorize("admin", "dentiste", "patient"), updateRendezVous)
  .delete(protect, authorize("admin", "dentiste"), deleteRendezVous);

module.exports = router;
