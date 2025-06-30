// backend/controllers/ConfirmationController.js
const Confirmation = require("../models/Confirmation"); // Importer le modèle Confirmation
const RendezVous = require("../models/RendezVous"); // Pour la validation et population
const asyncHandler = require("express-async-handler"); // Pour gérer les erreurs asynchrones

// @desc    Obtenir toutes les confirmations
// @route   GET /api/confirmations
// @access  Public (pour l'instant)
const getConfirmations = asyncHandler(async (req, res) => {
  // Optionnel: Filtrer par rendez-vous si l'ID est passé en query
  const query = {};
  if (req.query.rendezVousId) {
    query.rendezVous = req.query.rendezVousId;
  }

  const confirmations = await Confirmation.find(query).populate(
    "rendezVous",
    "dateHeure motif patient dentiste"
  ); // Inclure des détails du rendez-vous lié

  res.status(200).json(confirmations);
});

// @desc    Obtenir une confirmation par ID
// @route   GET /api/confirmations/:id
// @access  Public
const getConfirmationById = asyncHandler(async (req, res) => {
  const confirmation = await Confirmation.findById(req.params.id).populate(
    "rendezVous",
    "dateHeure motif patient dentiste"
  );

  if (confirmation) {
    res.status(200).json(confirmation);
  } else {
    res.status(404);
    throw new Error("Confirmation non trouvée");
  }
});

// @desc    Créer une nouvelle confirmation
// @route   POST /api/confirmations
// @access  Public
const createConfirmation = asyncHandler(async (req, res) => {
  const { dateConfirmation, methodeConfirmation, rendezVous } = req.body;

  // Validation des champs obligatoires
  if (!dateConfirmation || !methodeConfirmation || !rendezVous) {
    res.status(400);
    throw new Error(
      "Veuillez ajouter tous les champs obligatoires : dateConfirmation, methodeConfirmation, rendezVous"
    );
  }

  // Vérifier si le rendez-vous existe
  const rdvExists = await RendezVous.findById(rendezVous);
  if (!rdvExists) {
    res.status(404);
    throw new Error("Rendez-vous associé non trouvé");
  }

  // Optionnel: Vérifier s'il n'y a pas déjà une confirmation pour ce rendez-vous (logique métier)
  const existingConfirmation = await Confirmation.findOne({ rendezVous });
  if (existingConfirmation) {
    res.status(400);
    throw new Error("Ce rendez-vous a déjà une confirmation enregistrée.");
  }

  const confirmation = await Confirmation.create({
    dateConfirmation,
    methodeConfirmation,
    rendezVous,
  });

  if (confirmation) {
    res.status(201).json(confirmation);
  } else {
    res.status(400);
    throw new Error("Données de confirmation invalides");
  }
});

// @desc    Mettre à jour une confirmation
// @route   PUT /api/confirmations/:id
// @access  Public
const updateConfirmation = asyncHandler(async (req, res) => {
  const { dateConfirmation, methodeConfirmation, rendezVous } = req.body;

  const confirmation = await Confirmation.findById(req.params.id);

  if (confirmation) {
    // Vérifier si le nouveau rendez-vous existe si mis à jour
    if (
      rendezVous &&
      rendezVous.toString() !== confirmation.rendezVous.toString()
    ) {
      const rdvExists = await RendezVous.findById(rendezVous);
      if (!rdvExists) {
        res.status(404);
        throw new Error("Nouveau rendez-vous associé non trouvé");
      }
      // Vérifier qu'il n'y ait pas déjà une confirmation pour le nouveau rendez-vous
      const existingConfirmationForNewRdv = await Confirmation.findOne({
        rendezVous,
      });
      if (
        existingConfirmationForNewRdv &&
        existingConfirmationForNewRdv._id.toString() !==
          confirmation._id.toString()
      ) {
        res.status(400);
        throw new Error(
          "Le nouveau rendez-vous a déjà une confirmation enregistrée."
        );
      }
    }

    // Mettre à jour les champs si fournis
    confirmation.dateConfirmation =
      dateConfirmation !== undefined
        ? dateConfirmation
        : confirmation.dateConfirmation;
    confirmation.methodeConfirmation =
      methodeConfirmation !== undefined
        ? methodeConfirmation
        : confirmation.methodeConfirmation;
    confirmation.rendezVous =
      rendezVous !== undefined ? rendezVous : confirmation.rendezVous;

    const updatedConfirmation = await confirmation.save();
    res.status(200).json(updatedConfirmation);
  } else {
    res.status(404);
    throw new Error("Confirmation non trouvée");
  }
});

// @desc    Supprimer une confirmation
// @route   DELETE /api/confirmations/:id
// @access  Public
const deleteConfirmation = asyncHandler(async (req, res) => {
  const confirmation = await Confirmation.findById(req.params.id);

  if (confirmation) {
    await Confirmation.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Confirmation supprimée avec succès" });
  } else {
    res.status(404);
    throw new Error("Confirmation non trouvée");
  }
});

module.exports = {
  getConfirmations,
  getConfirmationById,
  createConfirmation,
  updateConfirmation,
  deleteConfirmation,
};
