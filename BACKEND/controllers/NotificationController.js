// backend/controllers/NotificationController.js
const Notification = require("../models/Notification"); // Importer le modèle Notification
const Patient = require("../models/Patient"); // Pour vérifier l'existence du patient
const Dentiste = require("../models/Dentiste"); // Pour vérifier l'existence du dentiste
const asyncHandler = require("express-async-handler"); // Pour gérer les erreurs asynchrones

// @desc    Obtenir toutes les notifications
// @route   GET /api/notifications
// @access  Public (pour l'instant, peut être protégé par rôle plus tard)
const getNotifications = asyncHandler(async (req, res) => {
  // Optionnel: Filtrer par recipientId et recipientModel si passés en query
  const query = {};
  if (req.query.recipientId && req.query.recipientModel) {
    query.recipient = req.query.recipientId;
    query.recipientModel = req.query.recipientModel;
  }

  // Utiliser .populate() avec populate() dynamique pour obtenir les détails du destinataire
  const notifications = await Notification.find(query).populate({
    path: "recipient",
    model: "recipientModel", // Mongoose utilisera la valeur de 'recipientModel' pour le populate
  });

  res.status(200).json(notifications);
});

// let notifications;
// if (req.query.recipientModel === 'Patient') {
//     notifications = await Notification.find(query).populate('recipient', 'nom prenom email');
// } else if (req.query.recipientModel === 'Dentiste') {
//     notifications = await Notification.find(query).populate('recipient', 'nom email');
// } else {
//     notifications = await Notification.find(query);
// }

// @desc    Obtenir une notification par ID
// @route   GET /api/notifications/:id
// @access  Public
const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id).populate({
    path: "recipient",
    model: "recipientModel",
  });

  if (notification) {
    res.status(200).json(notification);
  } else {
    res.status(404);
    throw new Error("Notification non trouvée");
  }
});

// @desc    Créer une nouvelle notification
// @route   POST /api/notifications
// @access  Public
const createNotification = asyncHandler(async (req, res) => {
  const { recipient, recipientModel, message, lue } = req.body;

  // Validation des champs obligatoires
  if (!recipient || !recipientModel || !message) {
    res.status(400);
    throw new Error(
      "Veuillez ajouter tous les champs obligatoires : recipient, recipientModel, message"
    );
  }

  // Vérifier si le recipientId existe pour le recipientModel donné
  let recipientExists = null;
  if (recipientModel === "Patient") {
    recipientExists = await Patient.findById(recipient);
  } else if (recipientModel === "Dentiste") {
    recipientExists = await Dentiste.findById(recipient);
  } else {
    res.status(400);
    throw new Error(
      "Type de destinataire (recipientModel) non valide. Doit être Patient ou Dentiste."
    );
  }

  if (!recipientExists) {
    res.status(404);
    throw new Error(`${recipientModel} destinataire non trouvé`);
  }

  const notification = await Notification.create({
    recipient,
    recipientModel,
    message,
    lue, // Utilise la valeur par défaut du schéma si non fournie
  });

  if (notification) {
    res.status(201).json(notification);
  } else {
    res.status(400);
    throw new Error("Données de notification invalides");
  }
});

// @desc    Mettre à jour une notification
// @route   PUT /api/notifications/:id
// @access  Public
const updateNotification = asyncHandler(async (req, res) => {
  const { recipient, recipientModel, message, lue } = req.body;

  const notification = await Notification.findById(req.params.id);

  if (notification) {
    // Mettre à jour les champs si fournis dans le corps de la requête
    notification.recipient =
      recipient !== undefined ? recipient : notification.recipient;
    notification.recipientModel =
      recipientModel !== undefined
        ? recipientModel
        : notification.recipientModel;
    notification.message =
      message !== undefined ? message : notification.message;
    notification.lue = lue !== undefined ? lue : notification.lue;

    const updatedNotification = await notification.save();
    res.status(200).json(updatedNotification);
  } else {
    res.status(404);
    throw new Error("Notification non trouvée");
  }
});

// @desc    Supprimer une notification
// @route   DELETE /api/notifications/:id
// @access  Public
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    await Notification.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Notification supprimée avec succès" });
  } else {
    res.status(404);
    throw new Error("Notification non trouvée");
  }
});

module.exports = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
};
