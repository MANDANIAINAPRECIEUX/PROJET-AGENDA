// backend/models/RendezVous.js
const mongoose = require('mongoose');

const rendezVousSchema = mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId, // Le type est un ObjectId de MongoDB
        required: true,
        ref: 'Patient' // Fait référence au modèle 'Patient'
    },
    dentist: {
        type: mongoose.Schema.Types.ObjectId, // Le type est un ObjectId de MongoDB
        required: true,
        ref: 'Dentist' // Fait référence au modèle 'Dentist'
    },
    date: {
        type: Date, // Utilise le type Date pour stocker la date et l'heure
        required: [true, 'Veuillez spécifier la date du rendez-vous']
    },
    dureeMinutes: {
        type: Number,
        required: [true, 'Veuillez spécifier la durée du rendez-vous en minutes'],
        min: 1 // Un rendez-vous doit durer au moins 1 minute
    },
    motif: {
        type: String,
        required: [true, 'Veuillez spécifier le motif du rendez-vous'],
        trim: true
    },
    statut: {
        type: String,
        enum: ['Confirmé', 'Annulé', 'Terminé', 'En attente'], // Statuts possibles pour un rendez-vous
        default: 'En attente', // Statut par défaut lors de la création
        required: true
    },
    notes: {
        type: String,
        // required: false // Les notes sont optionnelles
    }
}, {
    timestamps: true // Ajoute automatiquement les champs 'createdAt' et 'updatedAt'
});

module.exports = mongoose.model('RendezVous', rendezVousSchema);