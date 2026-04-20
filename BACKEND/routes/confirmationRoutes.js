// backend/routes/confirmationRoutes.js
const express = require("express");
const router = express.Router(); // Créer un routeur Express

// Importer les fonctions du contrôleur Confirmation
const {
  getConfirmations,
  getConfirmationById,
  createConfirmation,
  updateConfirmation,
  deleteConfirmation,
} = require("../controllers/ConfirmationController"); // Notez 'ConfirmationController'

// Définir les routes pour les confirmations

// Route GET pour obtenir toutes les confirmations et POST pour en créer une nouvelle
router.route("/").get(getConfirmations).post(createConfirmation);

// Route GET pour obtenir une confirmation par ID, PUT pour la mettre à jour, DELETE pour la supprimer
router
  .route("/:id")
  .get(getConfirmationById)
  .put(updateConfirmation)
  .delete(deleteConfirmation);

module.exports = router;
