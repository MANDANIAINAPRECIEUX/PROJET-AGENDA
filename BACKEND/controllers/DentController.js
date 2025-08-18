// backend/controllers/DentController.js
const Dent = require("../models/Dent");

const asyncHandler = require("express-async-handler"); // Pour gérer les erreurs asynchrones

// @desc    Obtenir toutes les dents
// @route   GET /api/dents
// @access  Public (pour l'instant)
const getDents = asyncHandler(async (req, res) => {
  const dents = await Dent.find({});
  res.status(200).json(dents);
});

// @desc    Obtenir une dent par ID
// @route   GET /api/dents/:id
// @access  Public
const getDentById = asyncHandler(async (req, res) => {
  const dent = await Dent.findById(req.params.id);

  if (dent) {
    res.status(200).json(dent);
  } else {
    res.status(404);
    throw new Error("Dent non trouvée");
  }
});

// @desc    Créer une nouvelle dent
// @route   POST /api/dents
// @access  Public
const createDent = asyncHandler(async (req, res) => {
  const { patient, typeDent, secteurDentaire, numero } = req.body;

  // Validation des champs obligatoires
  if (!patient || !typeDent || !numero || !secteurDentaire) {
    res.status(400);
    throw new Error(
      "Veuillez ajouter tous les champs obligatoires : nomDent, typeDent, numero"
    );
  }

  // Optionnel: Vérifier si une dent avec le même numéro et type existe déjà
  const dentExists = await Dent.findOne({ numero, typeDent });
  if (dentExists) {
    res.status(400);
    throw new Error("Une dent avec ce numéro et ce type existe déjà.");
  }

  const dent = await Dent.create({
    typeDent,
    numero,
    patient,
    secteurDentaire,
  });

  if (dent) {
    res.status(201).json(dent);
  } else {
    res.status(400);
    throw new Error("Données de la dent invalides");
  }
});

// @desc    Mettre à jour une dent
// @route   PUT /api/dents/:id
// @access  Public
const updateDent = asyncHandler(async (req, res) => {
  const { typeDent, numero } = req.body;

  const dent = await Dent.findById(req.params.id);

  if (dent) {
    // Mettre à jour les champs si fournis

    dent.typeDent = typeDent !== undefined ? typeDent : dent.typeDent;
    dent.numero = numero !== undefined ? numero : dent.numero;

    const updatedDent = await dent.save();
    res.status(200).json(updatedDent);
  } else {
    res.status(404);
    throw new Error("Dent non trouvée");
  }
});

// @desc    Supprimer une dent
// @route   DELETE /api/dents/:id
// @access  Public
const deleteDent = asyncHandler(async (req, res) => {
  const dent = await Dent.findById(req.params.id);

  if (dent) {
    await Dent.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Dent supprimée avec succès" });
  } else {
    res.status(404);
    throw new Error("Dent non trouvée");
  }
});

const getDentByPatientAndNumber = asyncHandler(async (req, res, next) => {
  const { patientId, numeroDent } = req.params;

  // Recherche dans la base de données
  const dent = await Dent.findOne({
    patient: patientId, // Correspondance de l'ID patient
    numero: numeroDent, // Correspondance du numéro de dent
  });

  if (!dent) {
    // Si aucune dent n'est trouvée, renvoyer une erreur 404
    return res.status(404).json({
      success: false,
      message: "Cette dent n'existe pas pour ce patient.",
    });
  }

  // Si la dent est trouvée, renvoyer une réponse 200 avec l'objet dent
  res.status(200).json({ success: true, data: dent });
});

module.exports = {
  getDents,
  getDentById,
  createDent,
  updateDent,
  deleteDent,
  getDentByPatientAndNumber,
};
