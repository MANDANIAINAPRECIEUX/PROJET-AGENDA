// backend/controllers/PatientController.js
const Patient = require("../models/Patient"); // Importer le modèle Patient
const Dentiste = require("../models/Dentiste");
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

  if (
    req.user.role === "patient" &&
    req.user._id.toString() !== patient._id.toString()
  ) {
    res.status(403); // 403 Forbidden
    throw new Error(
      "Accès refusé : vous ne pouvez accéder qu'à vos propres informations de patient."
    );
  }

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

  if (!patient) {
    res.status(404);
    throw new Error("Patient non trouvé");
  }

  // Logique d'autorisation supplémentaire pour le rôle 'patient'
  if (
    req.user.role === "patient" &&
    req.user._id.toString() !== patient._id.toString()
  ) {
    res.status(403); // 403 Forbidden
    throw new Error(
      "Accès refusé : vous ne pouvez modifier que vos propres informations de patient."
    );
  }

  // Mise à jour des champs avec l'opérateur logique OR pour conserver les valeurs existantes si non fournies
  patient.nom = nom !== undefined ? nom : patient.nom;
  patient.prenom = prenom !== undefined ? prenom : patient.prenom;
  patient.age = age !== undefined ? age : patient.age;
  patient.email = email !== undefined ? email : patient.email;
  patient.telephone = telephone !== undefined ? telephone : patient.telephone;

  const updatedPatient = await patient.save();
  res.status(200).json(updatedPatient);
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

const getPatientByEmail = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const patient = await Patient.findOne({ email: email.toLowerCase() });
  if (req.user.role === "patient" && req.user.email !== email.toLowerCase()) {
    res.status(403);
    throw new Error(
      "Accès refusé : vous ne pouvez accéder qu'à vos propres informations de patient."
    );
  }

  if (patient) {
    res.status(200).json(patient);
  } else {
    res.status(404);
    throw new Error("Patient non trouvé pour cet email");
  }
});

const countByDentiste = async (req, res) => {
  try {
    const result = await Patient.aggregate([
      {
        $group: {
          _id: "$dentisteId",
          totalPatients: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "dentistes",
          localField: "_id",
          foreignField: "_id",
          as: "dentiste",
        },
      },
      {
        $unwind: "$dentiste",
      },
      {
        $project: {
          _id: 0,
          dentisteId: "$_id",
          nom: "$dentiste.nom",
          prenom: "$dentiste.prenom",
          totalPatients: 1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error("⚠️ Erreur dans countByDentiste :", error);
    res.status(500).json({ message: "Erreur interne count-by-dentiste" });
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientByEmail,
  countByDentiste,
};
