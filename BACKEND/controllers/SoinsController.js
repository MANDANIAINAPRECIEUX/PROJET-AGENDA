// backend/controllers/SoinsController.js (Contenu mis à jour)
const Soins = require("../models/Soins"); // Importer le modèle Soins (notez le 's')
const RendezVous = require("../models/RendezVous");
const Dentiste = require("../models/Dentiste");
const Patient = require("../models/Patient");
const Dent = require("../models/Dent");
const asyncHandler = require("express-async-handler");

// @desc    Obtenir tous les soins
// @route   GET /api/soins
// @access  Public
const getSoins = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.patientId) query.patient = req.query.patientId;
  if (req.query.dentisteId) query.dentiste = req.query.dentisteId;
  if (req.query.rendezVousId) query.rendezVous = req.query.rendezVousId;
  if (req.query.dentId) query.dent = req.query.dentId;

  const soins = await Soins.find(query) // Utiliser Soins.find
    .populate("rendezVous", "dateHeure motif")
    .populate("dentiste", "nom prenom")
    .populate("patient", "nom prenom")
    .populate("dent", "nomDent typeDent numero");

  res.status(200).json(soins);
});

// @desc    Obtenir un soin par ID
// @route   GET /api/soins/:id
// @access  Public
const getSoinById = asyncHandler(async (req, res) => {
  const soin = await Soins.findById(req.params.id) // Utiliser Soins.findById
    .populate("rendezVous", "dateHeure motif")
    .populate("dentiste", "nom prenom")
    .populate("patient", "nom prenom")
    .populate("dent", "nomDent typeDent numero");

  if (soin) {
    res.status(200).json(soin);
  } else {
    res.status(404);
    throw new Error("Soin non trouvé");
  }
});

// @desc    Créer un nouveau soin
// @route   POST /api/soins
// @access  Public
const createSoin = asyncHandler(async (req, res) => {
  const {
    typeSoin,
    descriptionSoin,
    coutSoin,
    dateHeureSoin,
    rendezVous,
    dentiste,
    patient,
    dent,
  } = req.body;

  if (
    !typeSoin ||
    !coutSoin ||
    !dateHeureSoin ||
    !rendezVous ||
    !dentiste ||
    !patient ||
    !dent
  ) {
    res.status(400);
    throw new Error(
      "Veuillez ajouter tous les champs obligatoires : typeSoin, coutSoin, dateHeureSoin, rendezVous, dentiste, patient, dent"
    );
  }

  const rdvExists = await RendezVous.findById(rendezVous);
  if (!rdvExists) {
    res.status(404);
    throw new Error("Rendez-vous associé non trouvé");
  }
  const dentisteExists = await Dentiste.findById(dentiste);
  if (!dentisteExists) {
    res.status(404);
    throw new Error("Dentiste associé non trouvé");
  }
  const patientExists = await Patient.findById(patient);
  if (!patientExists) {
    res.status(404);
    throw new Error("Patient associé non trouvé");
  }
  const dentExists = await Dent.findById(dent);
  if (!dentExists) {
    res.status(404);
    throw new Error("Dent associée non trouvée");
  }

  const soin = await Soins.create({
    // Utiliser Soins.create
    typeSoin,
    descriptionSoin,
    coutSoin,
    dateHeureSoin,
    rendezVous,
    dentiste,
    patient,
    dent,
  });

  if (soin) {
    res.status(201).json(soin);
  } else {
    res.status(400);
    throw new Error("Données du soin invalides");
  }
});

// @desc    Mettre à jour un soin
// @route   PUT /api/soins/:id
// @access  Public
const updateSoin = asyncHandler(async (req, res) => {
  const {
    typeSoin,
    descriptionSoin,
    coutSoin,
    dateHeureSoin,
    rendezVous,
    dentiste,
    patient,
    dent,
  } = req.body;

  const soin = await Soins.findById(req.params.id); // Utiliser Soins.findById

  if (soin) {
    soin.typeSoin = typeSoin !== undefined ? typeSoin : soin.typeSoin;
    soin.descriptionSoin =
      descriptionSoin !== undefined ? descriptionSoin : soin.descriptionSoin;
    soin.coutSoin = coutSoin !== undefined ? coutSoin : soin.coutSoin;
    soin.dateHeureSoin =
      dateHeureSoin !== undefined ? dateHeureSoin : soin.dateHeureSoin;
    soin.rendezVous = rendezVous !== undefined ? rendezVous : soin.rendezVous;
    soin.dentiste = dentiste !== undefined ? dentiste : soin.dentiste;
    soin.patient = patient !== undefined ? patient : soin.patient;
    soin.dent = dent !== undefined ? dent : soin.dent;

    const updatedSoin = await soin.save();
    res.status(200).json(updatedSoin);
  } else {
    res.status(404);
    throw new Error("Soin non trouvé");
  }
});

// @desc    Supprimer un soin
// @route   DELETE /api/soins/:id
// @access  Public
const deleteSoin = asyncHandler(async (req, res) => {
  const soin = await Soins.findById(req.params.id); // Utiliser Soins.findById

  if (soin) {
    await Soins.deleteOne({ _id: req.params.id }); // Utiliser Soins.deleteOne
    res.status(200).json({ message: "Soin supprimé avec succès" });
  } else {
    res.status(404);
    throw new Error("Soin non trouvé");
  }
});

module.exports = {
  getSoins,
  getSoinById,
  createSoin,
  updateSoin,
  deleteSoin,
};
