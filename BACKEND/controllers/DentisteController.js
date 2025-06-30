const Dentiste = require('../models/Dentiste'); // Importer le modèle Dentiste (notez le 'e')
const asyncHandler = require('express-async-handler'); // Pour gérer les erreurs asynchrones

// @desc    Obtenir tous les dentistes
// @route   GET /api/dentistes
// @access  Public (pour l'instant)
const getDentistes = asyncHandler(async (req, res) => {
    const dentistes = await Dentiste.find({});
    res.status(200).json(dentistes);
});

// @desc    Obtenir un dentiste par ID
// @route   GET /api/dentistes/:id
// @access  Public
const getDentisteById = asyncHandler(async (req, res) => {
    const dentiste = await Dentiste.findById(req.params.id);

    if (dentiste) {
        res.status(200).json(dentiste);
    } else {
        res.status(404);
        throw new Error('Dentiste non trouvé');
    }
});

// @desc    Créer un nouveau dentiste
// @route   POST /api/dentistes
// @access  Public
const createDentiste = asyncHandler(async (req, res) => {
    const { nom, prenom, email, telephone, specialite, isAdmin } = req.body;

    if (!nom || !prenom || !email) {
        res.status(400);
        throw new Error('Veuillez ajouter tous les champs obligatoires : nom, prenom, email');
    }

    const dentisteExists = await Dentiste.findOne({ email });

    if (dentisteExists) {
        res.status(400);
        throw new Error('Un dentiste avec cet email existe déjà');
    }

    const dentiste = await Dentiste.create({
        nom,
        prenom,
        email,
        telephone,
        specialite,
        isAdmin
    });

    if (dentiste) {
        res.status(201).json({
            _id: dentiste._id,
            nom: dentiste.nom,
            prenom: dentiste.prenom,
            email: dentiste.email,
            telephone: dentiste.telephone,
            specialite: dentiste.specialite,
            isAdmin: dentiste.isAdmin
        });
    } else {
        res.status(400);
        throw new Error('Données du dentiste invalides');
    }
});

// @desc    Mettre à jour un dentiste
// @route   PUT /api/dentistes/:id
// @access  Public
const updateDentiste = asyncHandler(async (req, res) => {
    const { nom, prenom, email, telephone, specialite, isAdmin } = req.body;

    const dentiste = await Dentiste.findById(req.params.id);

    if (dentiste) {
        dentiste.nom = nom !== undefined ? nom : dentiste.nom;
        dentiste.prenom = prenom !== undefined ? prenom : dentiste.prenom;
        dentiste.email = email !== undefined ? email : dentiste.email;
        dentiste.telephone = telephone !== undefined ? telephone : dentiste.telephone;
        dentiste.specialite = specialite !== undefined ? specialiste : dentiste.specialite;
        dentiste.isAdmin = isAdmin !== undefined ? isAdmin : dentiste.isAdmin;

        const updatedDentiste = await dentiste.save();
        res.status(200).json(updatedDentiste);
    } else {
        res.status(404);
        throw new Error('Dentiste non trouvé');
    }
});

// @desc    Supprimer un dentiste
// @route   DELETE /api/dentistes/:id
// @access  Public
const deleteDentiste = asyncHandler(async (req, res) => {
    const dentiste = await Dentiste.findById(req.params.id);

    if (dentiste) {
        await Dentiste.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Dentiste supprimé avec succès' });
    } else {
        res.status(404);
        throw new Error('Dentiste non trouvé');
    }
});

module.exports = {
    getDentistes,
    getDentisteById,
    createDentiste,
    updateDentiste,
    deleteDentiste,
};