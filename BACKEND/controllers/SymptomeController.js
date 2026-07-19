// backend/controllers/SymptomeController.js
const Symptome = require("../models/Symptome"); // Importer le modèle Symptome
//const Dent = require("../models/Dent");  Importer le modèle Dent (nécessaire pour la validation et la population)
const RendezVous = require("../models/RendezVous");
const asyncHandler = require("express-async-handler"); // Pour gérer les erreurs asynchrones

// @desc    Obtenir tous les symptômes
// @route   GET /api/symptomes
// @access  Public (pour l'instant)
const getSymptomes = asyncHandler(async (req, res) => {
  const query = {};
  // Si vous voulez filtrer les symptômes par l'ID dans un rendez vous,
  // il faudrait une logique plus complexe car le lien est Symptome -> Dent -> Patient.
  // Pour l'instant, on filtre par l'ID du rendez vous si fourni.
  if (req.query.dentId) {
    // Exemple de filtrage par ID de dent
    query.RendezVous = req.query.RendezVousId;
  }

  // Population : Inclure les détails de la dent liée au symptôme.
  // Si vous avez aussi besoin du patient, il faudra une population imbriquée.
  const symptomes = await Symptome.find(query).populate(
    "rendezVous",
    "dateHeure dureeMinutes motif statut patient dentiste"
  ); // Popule la dent, et inclut l'ID du patient de la dent

  res.status(200).json(symptomes);
});

// @desc    Obtenir un symptôme par ID
// @route   GET /api/symptomes/:id
// @access  Public
const getSymptomeById = asyncHandler(async (req, res) => {
  // Population : Inclure les détails de la dent liée au symptôme.
  const symptome = await Symptome.findById(req.params.id).populate(
    "dent",
    "nomDent typeDent numero patient"
  ); // Popule la dent, et inclut l'ID du patient de la dent

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
  // Déstructuration : Utilisez les noms de champs EXACTS de votre modèle Symptome.js
  const { rendezVous, typeSymptome, niveauSymptome, description } = req.body;

  // Validation des champs obligatoires (selon le modèle Symptome.js)
  if (!rendezVous || !typeSymptome || !niveauSymptome) {
    res.status(400);
    throw new Error(
      "Veuillez ajouter tous les champs obligatoires : RendezVous, typeSymptome, niveauSymptome"
    );
  }

  // Vérifier si la DENT associée existe
  const RendezVousExists = await RendezVous.findById(rendezVous);
  if (!RendezVousExists) {
    res.status(404); // Ou 400 Bad Request, selon votre préférence pour ce type d'erreur de FK
    throw new Error("RendezVous associée non trouvée");
  }

  const symptome = await Symptome.create({
    rendezVous,
    typeSymptome,
    niveauSymptome,
    description, // Le champ est 'description' dans le modèle, pas 'descriptionSymptome'
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
  // Déstructuration : Utilisez les noms de champs EXACTS de votre modèle Symptome.js
  const { dent, typeSymptome, niveauSymptome, description } = req.body;

  const symptome = await Symptome.findById(req.params.id);

  if (!symptome) {
    res.status(404);
    throw new Error("Symptôme non trouvé");
  }

  // Si 'dent' est mis à jour, vérifiez si la nouvelle dent existe
  if (dent !== undefined && dent.toString() !== symptome.dent.toString()) {
    const newDentExists = await Dent.findById(dent);
    if (!newDentExists) {
      res.status(404);
      throw new Error("Nouvelle dent associée non trouvée");
    }
    symptome.dent = dent;
  }

  // Mettre à jour les champs si fournis
  symptome.typeSymptome =
    typeSymptome !== undefined ? typeSymptome : symptome.typeSymptome;
  symptome.niveauSymptome =
    niveauSymptome !== undefined ? niveauSymptome : symptome.niveauSymptome;
  symptome.description =
    description !== undefined ? description : symptome.description;

  const updatedSymptome = await symptome.save();
  res.status(200).json(updatedSymptome);
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
