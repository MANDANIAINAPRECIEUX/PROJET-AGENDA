// backend/routes/dentisteRoutes.js
const express = require("express");
const router = express.Router(); // Créer un routeur Express

// Importer les fonctions du contrôleur Dentiste
const {
  getDentistes,
  getDentisteById,
  createDentiste,
  updateDentiste,
  deleteDentiste,
} = require("../controllers/DentisteController"); // Notez 'DentisteController'

const { protect } = require("../middlewares/authMiddleware");

// Définir les routes pour les dentistes

// Route GET pour obtenir tous les dentistes et POST pour en créer un nouveau
router.route("/").get(getDentistes).post(createDentiste);

// Route GET pour obtenir un dentiste par ID, PUT pour le mettre à jour, DELETE pour le supprimer
router
  .route("/:id")
  .get(getDentisteById)
  .put(updateDentiste)
  .delete(deleteDentiste);

module.exports = router;
