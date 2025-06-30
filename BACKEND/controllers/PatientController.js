// backend/controllers/PatientController.js
const Patient = require("../models/Patient"); // Importer le modèle Patient
const asyncHandler = require("express-async-handler"); // Pour gérer les erreurs asynchrones

// @desc    Obtenir tous les patients
// @route   GET /api/patients
// @access  Public (pour l'instant, sera protégé plus tard)
const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({});
  res.status(200).json(patients);
});

//     Obtenir un patient par ID
// route   GET /api/patients/:id
// @access  Public
const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (patient) {
    res.status(200).json(patient);
  } else {
    res.status(404);
    throw new Error("Patient non trouvé");
  }
});

//     Créer un nouveau patient
// route   POST /api/patients
// @access  Public
const createPatient = asyncHandler(async (req, res) => {
  const { nom, prenom, age, email, telephone } = req.body;

  // Validation simple
  if (!nom || !prenom || !email) {
    res.status(400);
    throw new Error(
      "Veuillez ajouter tous les champs obligatoires : nom, prenom, email"
    );
  }

  const patientExists = await Patient.findOne({ email });

  if (patientExists) {
    res.status(400);
    throw new Error("Un patient avec cet email existe déjà");
  }

  const patient = await Patient.create({
    nom,
    prenom,
    age,
    email,
    telephone,
  });

  if (patient) {
    res.status(201).json({
      _id: patient._id,
      nom: patient.nom,
      prenom: patient.prenom,
      email: patient.email,
      telephone: patient.telephone,
    });
  } else {
    res.status(400);
    throw new Error("Données du patient invalides");
  }
});

// @desc    Mettre à jour un patient
// @route   PUT /api/patients/:id
// @access  Public
const updatePatient = asyncHandler(async (req, res) => {
  const { nom, prenom, age, email, telephone } = req.body;

  const patient = await Patient.findById(req.params.id);

  if (patient) {
    patient.nom = nom || patient.nom;
    patient.prenom = prenom || patient.prenom;
    patient.age = age || patient.age;
    patient.email = email || patient.email;
    patient.telephone = telephone || patient.telephone;

    const updatedPatient = await patient.save();
    res.status(200).json(updatedPatient);
  } else {
    res.status(404);
    throw new Error("Patient non trouvé");
  }
});

// @desc    Supprimer un patient
// @route   DELETE /api/patients/:id
// @access  Public
const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (patient) {
    await Patient.deleteOne({ _id: req.params.id }); // Ou patient.remove(); si Mongoose version < 6
    res.status(200).json({ message: "Patient supprimé avec succès" });
  } else {
    res.status(404);
    throw new Error("Patient non trouvé");
  }
});

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
