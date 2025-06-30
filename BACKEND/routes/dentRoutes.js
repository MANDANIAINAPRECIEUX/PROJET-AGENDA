// backend/routes/dentRoutes.js
const express = require("express");
const router = express.Router(); // Créer un routeur Express

// Importer les fonctions du contrôleur Dent
const {
  getDents,
  getDentById,
  createDent,
  updateDent,
  deleteDent,
} = require("../controllers/DentController"); // Notez 'DentController'

// Définir les routes pour les dents

// Route GET pour obtenir toutes les dents et POST pour en créer une nouvelle
router.route("/").get(getDents).post(createDent);

// Route GET pour obtenir une dent par ID, PUT pour la mettre à jour, DELETE pour la supprimer
router.route("/:id").get(getDentById).put(updateDent).delete(deleteDent);

module.exports = router;
