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
  getDentisteBadge,
  creerDentiste,
} = require("../controllers/DentisteController"); // Notez 'DentisteController'

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");
router.get("/:id/badge", getDentisteBadge);
router.post("/ajouter", creerDentiste);
// Définir les routes pour les dentistes

// Route GET pour obtenir tous les dentistes et POST pour en créer un nouveau
router
  .route("/")
  .get(protect, authorize("admin", "dentiste", "patient"), getDentistes)
  .post(protect, authorize("admin"), createDentiste);

// Route GET pour obtenir un dentiste par ID, PUT pour le mettre à jour, DELETE pour le supprimer
router
  .route("/:id")
  .get(protect, authorize("admin", "dentiste", "patient"), getDentisteById)
  .put(protect, authorize("admin", "dentiste"), updateDentiste)
  .delete(protect, authorize("admin"), deleteDentiste);

module.exports = router;
