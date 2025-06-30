// backend/controllers/SymptomeController.js
const Symptome = require("../models/Symptome"); // Importer le modèle Symptome
const Patient = require("../models/Patient"); // Pour la validation et population
const asyncHandler = require("express-async-handler"); // Pour gérer les erreurs asynchrones

// @desc    Obtenir tous les symptômes
// @route   GET /api/symptomes
// @access  Public (pour l'instant)
const getSymptomes = asyncHandler(async (req, res) => {
  // Optionnel: Filtrer par patient si ID passé en query
  const query = {};
  if (req.query.patientId) {
    query.patient = req.query.patientId;
  }

  const symptomes = await Symptome.find(query).populate(
    "patient",
    "nom prenom"
  ); // Inclure nom, prenom du patient lié

  res.status(200).json(symptomes);
});

// @desc    Obtenir un symptôme par ID
// @route   GET /api/symptomes/:id
// @access  Public
const getSymptomeById = asyncHandler(async (req, res) => {
  const symptome = await Symptome.findById(req.params.id).populate(
    "patient",
    "nom prenom"
  );

  if (symptome) {
    res.status(200).json(symptome);
  } else {
    res.status(404);
    throw new Error("Symptôme non trouvé");
  }
});

// @desc    Créer un nouveau symptôme
// @route   POST /api/symptomes
// @access  Public
const createSymptome = asyncHandler(async (req, res) => {
  const { typeSymptome, descriptionSymptome, dateApparition, patient } =
    req.body;

  // Validation des champs obligatoires
  if (!typeSymptome || !dateApparition || !patient) {
    res.status(400);
    throw new Error(
      "Veuillez ajouter tous les champs obligatoires : typeSymptome, dateApparition, patient"
    );
  }

  // Vérifier si le patient existe
  const patientExists = await Patient.findById(patient);
  if (!patientExists) {
    res.status(404);
    throw new Error("Patient associé non trouvé");
  }

  const symptome = await Symptome.create({
    typeSymptome,
    descriptionSymptome,
    dateApparition,
    patient,
  });

  if (symptome) {
    res.status(201).json(symptome);
  } else {
    res.status(400);
    throw new Error("Données du symptôme invalides");
  }
});

// @desc    Mettre à jour un symptôme
// @route   PUT /api/symptomes/:id
// @access  Public
const updateSymptome = asyncHandler(async (req, res) => {
  const { typeSymptome, descriptionSymptome, dateApparition, patient } =
    req.body;

  const symptome = await Symptome.findById(req.params.id);

  if (symptome) {
    // Mettre à jour les champs si fournis
    symptome.typeSymptome =
      typeSymptome !== undefined ? typeSymptome : symptome.typeSymptome;
    symptome.descriptionSymptome =
      descriptionSymptome !== undefined
        ? descriptionSymptome
        : symptome.descriptionSymptome;
    symptome.dateApparition =
      dateApparition !== undefined ? dateApparition : symptome.dateApparition;
    symptome.patient = patient !== undefined ? patient : symptome.patient;

    const updatedSymptome = await symptome.save();
    res.status(200).json(updatedSymptome);
  } else {
    res.status(404);
    throw new Error("Symptôme non trouvé");
  }
});

// @desc    Supprimer un symptôme
// @route   DELETE /api/symptomes/:id
// @access  Public
const deleteSymptome = asyncHandler(async (req, res) => {
  const symptome = await Symptome.findById(req.params.id);

  if (symptome) {
    await Symptome.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Symptôme supprimé avec succès" });
  } else {
    res.status(404);
    throw new Error("Symptôme non trouvé");
  }
});

module.exports = {
  getSymptomes,
  getSymptomeById,
  createSymptome,
  updateSymptome,
  deleteSymptome,
};
