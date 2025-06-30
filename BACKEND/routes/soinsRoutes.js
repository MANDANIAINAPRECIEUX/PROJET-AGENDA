// backend/routes/soinsRoutes.js
const express = require("express");
const router = express.Router(); // Créer un routeur Express

// Importer les fonctions du contrôleur Soins
const {
  getSoins,
  getSoinById,
  createSoin,
  updateSoin,
  deleteSoin,
} = require("../controllers/SoinsController"); // Notez 'SoinsController'

// Définir les routes pour les soins

// Route GET pour obtenir tous les soins et POST pour en créer un nouveau
router.route("/").get(getSoins).post(createSoin);

// Route GET pour obtenir un soin par ID, PUT pour le mettre à jour, DELETE pour le supprimer
router.route("/:id").get(getSoinById).put(updateSoin).delete(deleteSoin);

module.exports = router;
