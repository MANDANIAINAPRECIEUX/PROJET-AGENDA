
const express = require("express");
const router = express.Router(); 

// Importer les fonctions du contrôleur Symptome
const {
  getSymptomes,
  getSymptomeById,
  createSymptome,
  updateSymptome,
  deleteSymptome,
} = require("../controllers/SymptomeController"); 
const { protect } = require("../middlewares/authMiddleware");

// Définir les routes pour les symptômes

// Route GET pour obtenir tous les symptômes et POST pour en créer un nouveau
router.route("/").get(getSymptomes).post(createSymptome);

// Route GET pour obtenir un symptôme par ID, PUT pour le mettre à jour, DELETE pour le supprimer
router
  .route("/:id")
  .get(getSymptomeById)
  .put(updateSymptome)
  .delete(deleteSymptome);

module.exports = router;
wxcwxcwxcwx qdqsdqsd