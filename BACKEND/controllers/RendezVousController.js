// backend/controllers/RendezVousController.js
const RendezVous = require("../models/RendezVous"); // Importer le modèle RendezVous
const Patient = require("../models/Patient"); // Importer le modèle Patient pour la vérification
const Dentiste = require("../models/Dentiste"); // Importer le modèle Dentiste pour la vérification
const asyncHandler = require("express-async-handler"); // Pour gérer les erreurs asynchrones
const User = require("../models/User");

// @desc    Obtenir tous les rendez-vous
// @route   GET /api/rendezvous
// @access  Public (pour l'instant)
const getRendezVous = asyncHandler(async (req, res) => {
  // Optionnel: Filtrer par patient ou dentiste si les IDs sont passés en query
  const query = {};
  if (req.query.userId) {
    query.patient = req.query.userId;
  }
  if (req.query.dentisteId) {
    query.dentiste = req.query.dentisteId;
  }

  // Utiliser .populate() pour obtenir les détails du patient et du dentiste liés
  const rendezVous = await RendezVous.find(query)
    .populate("patient", "nom prenom email") // Inclure nom, prenom, email du patient
    .populate("dentiste", "nom prenom specialite"); // Inclure nom, prenom, specialite du dentiste

  res.status(200).json(rendezVous);
});

// @desc    Obtenir un rendez-vous par ID
// @route   GET /api/rendezvous/:id
// @access  Public
const getRendezVousById = asyncHandler(async (req, res) => {
  const rendezVous = await RendezVous.findById(req.params.id)
    .populate("patient", "nom prenom email")
    .populate("dentiste", "nom prenom specialite");

  if (rendezVous) {
    res.status(200).json(rendezVous);
  } else {
    res.status(404);
    throw new Error("Rendez-vous non trouvé");
  }
});

// @desc    Créer un nouveau rendez-vous
// @route   POST /api/rendezvous
// @access  Public
const createRendezVous = asyncHandler(async (req, res) => {
  const { patient, dentiste, dateHeure, dureeMinutes, motif, statut, notes } =
    req.body;

  // Validation des champs obligatoires
  if (!patient || !dentiste || !dateHeure || !dureeMinutes || !motif) {
    res.status(400);
    throw new Error(
      "Veuillez ajouter tous les champs obligatoires : patient, dentiste, dateHeure, dureeMinutes, motif"
    );
  }

  // Vérifier si le patient et le dentiste existent
  const patientExists = await User.findById(patient);
  if (!patientExists) {
    res.status(404);
    throw new Error("Patient non trouvé");
  }

  const dentisteExists = await Dentiste.findById(dentiste);
  if (!dentisteExists) {
    res.status(404);
    throw new Error("Dentiste non trouvé");
  }

  // Logique de vérification de disponibilité (très simplifiée ici)
  // Dans une vraie application, il faudrait vérifier les chevauchements d'horaires pour le dentiste.
  // Exemple simple: vérifier si le dentiste a déjà un RDV à la même heure
  const conflictingRendezVous = await RendezVous.findOne({
    dentiste: dentiste,
    dureeMinutes: dureeMinutes,
    dateHeure: dateHeure, // Simplifié: juste la même date/heure. Idéalement, vérifier une plage.
  });

  if (conflictingRendezVous) {
    res.status(400);
    throw new Error("Le dentiste n'est pas disponible à cette heure.");
  }

  const rendezVous = await RendezVous.create({
    patient,
    dentiste,
    dateHeure,
    dureeMinutes,
    motif,
    statut,
    notes, // Utilise la valeur par défaut du schéma si non fournie
  });

  if (rendezVous) {
    res.status(201).json(rendezVous);
  } else {
    res.status(400);
    throw new Error("Données du rendez-vous invalides");
  }
});

// @desc    Mettre à jour un rendez-vous
// @route   PUT /api/rendezvous/:id
// @access  Public
// const updateRendezVous = asyncHandler(async (req, res) => {
//   const { patient, dentiste, dateHeure, dureeMinutes, motif, statut, notes } =
//     req.body;

//   const rendezVous = await RendezVous.findById(req.params.id);

//   if (rendezVous) {
//     // Mettre à jour les champs si fournis dans le corps de la requête
//     rendezVous.patient = patient || rendezVous.patient;
//     rendezVous.dentiste = dentiste || rendezVous.dentiste;
//     rendezVous.dateHeure = dateHeure || rendezVous.dateHeure;
//     rendezVous.dureeMinutes = dureeMinutes || rendezVous.dureeMinutes;
//     rendezVous.motif = motif || rendezVous.motif;
//     rendezVous.statut = statut || rendezVous.statut;
//     rendezVous.notes = notes !== undefined ? notes : rendezVous.notes;

//     const updatedRendezVous = await rendezVous.save();
//     res.status(200).json(updatedRendezVous);
//   } else {
//     res.status(404);
//     throw new Error("Rendez-vous non trouvé");
//   }
// });

const updateRendezVous = asyncHandler(async (req, res) => {
  try {
    const rendezVous = await RendezVous.findById(req.params.id);

    if (!rendezVous) {
      res.status(404);
      throw new Error("Rendez-vous non trouvé");
    }

    // mise à jour ciblée : fusionne seulement les champs envoyés
    Object.assign(rendezVous, req.body);

    const updatedRendezVous = await rendezVous.save();
    res.status(200).json(updatedRendezVous);
  } catch (error) {
    console.error("❌ Erreur updateRendezVous:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// @desc    Supprimer un rendez-vous
// @route   DELETE /api/rendezvous/:id
// @access  Public
const deleteRendezVous = asyncHandler(async (req, res) => {
  const rendezVous = await RendezVous.findById(req.params.id);

  if (rendezVous) {
    await RendezVous.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
  } else {
    res.status(404);
    throw new Error("Rendez-vous non trouvé");
  }
});

// Récupérer tous les RDV d'un patient
const getRendezVousByPatient = asyncHandler(async (req, res) => {
  const patientId = req.params.patientId;

  console.log("patientId reçu :", patientId);

  const rdv = await RendezVous.find({ patient: patientId })
    .populate("patient", "nom prenom email")
    .populate("dentiste", "nom prenom specialite");

  res.status(200).json(rdv);
});

module.exports = {
  getRendezVous,
  getRendezVousById,
  createRendezVous,
  updateRendezVous,
  deleteRendezVous,
  getRendezVousByPatient,
};
