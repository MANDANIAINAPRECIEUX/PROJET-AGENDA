// backend/models/Patient.js
const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Veuillez ajouter un nom']
    },
    prenom: {
        type: String,
        required: [true, 'Veuillez ajouter un prénom']
    },
    age: {
        type: Number,
        min: 0, // Optionnel: pour s'assurer que l'âge est positif
    },
    email: {VDSVDFV DVDVFS DFVSDFVDF DFVSDFDSF DFGSDFGDF
        type: String,
        required: [true, 'Veuillez ajouter un email'],
        unique: true, // L'email doit être unique dans la collection
        lowercase: true, // Stocke l'email en minuscules pour la cohérence
        trim: true, // Supprime les espaces blancs inutiles
        match: [/.+@.+\..+/, 'Veuillez utiliser une adresse email valide'] // Validation de format simple
    },
    telephone: {
        type: String,
        trim: true,
        // match: [/^\d{10}$/, 'Veuillez utiliser un numéro de téléphone à 10 chiffres'] // Exemple pour 10 chiffres (décommenter si nécessaire)
    }
}, {
    timestamps: true // Ajoute automatiquement les champs 'createdAt' et 'updatedAt'
});

module.exports = mongoose.model('Patient', patientSchema);