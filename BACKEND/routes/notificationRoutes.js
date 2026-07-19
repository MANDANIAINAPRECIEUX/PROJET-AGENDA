
const express = require("express");
const router = express.Router(); // Créer un routeur Express

// Importer les fonctions du contrôleur Notification
const {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} = require("../controllers/NotificationController"); 



// Route GET pour obtenir toutes les notifications et POST pour en créer une nouvelle
router.route("/").get(getNotifications).post(createNotification);

// Route GET pour obtenir une notification par ID, PUT pour la mettre à jour, DELETE pour la supprimer
router
  .route("/:id")
  .get(getNotificationById)
  .put(updateNotification)
  .delete(deleteNotification);

module.exports = router;
