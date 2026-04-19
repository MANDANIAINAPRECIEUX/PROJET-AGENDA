// backend/routes/dentRoutes.js
const express = require("express");
const router = express.Router(); 

// Importer les fonctions du contrôleur Dent
const {
  getDents,
  getDentById,
  createDent,
  updateDent,
  deleteDent,
  getDentByPatientAndNumber,
  getDentsByPatient,
} = require("../controllers/DentController"); // Notez 'DentController'
const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");
// Définir les routes pour les dents

// Route GET pour obtenir toutes les dents et POST pour en créer une nouvelle
router
  .route("/")
  .get(protect, authorize("admin", "dentiste", "patient"), getDents)
  .post(protect, authorize("patient"), createDent);

// Route GET pour obtenir une dent par ID, PUT pour la mettre à jour, DELETE pour la supprimer
router
  .route("/:id")
  .get(protect, authorize("admin", "dentiste", "patient"), getDentById)
  .put(protect, authorize("patient"), updateDent)
  .delete(protect, authorize("patient"), deleteDent);

router
  .route("/patient/:patientId/numero/:numeroDent")
  .get(
    protect,
    authorize("admin", "dentiste", "patient"),
    getDentByPatientAndNumber
  );
router.get("/patient/:patientId", getDentsByPatient);

module.exports = router;
