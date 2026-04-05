// backend/models/Confirmation.js (Ce modèle reflète la table CONFIRMATION selon vos dernières précisions)
const mongoose = require('mongoose');

const confirmationSchema = mongoose.Schema({
    rendezVous: { // Mappe à idRendezVous (FK vers RDV)
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Une confirmation doit être liée à un rendez-vous'],
        ref: 'RendezVous' // Fait référence au modèle 'RendezVous'
    },
    dentist: { // Mappe à idDentiste (FK vers DENTISTE)
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Une confirmation doit être liée à un dentiste'],
        ref: 'Dentist' // Fait référence au modèle 'Dentist'
    },
    dateAction: { // Mappe à dateAction
        type: Date,
        required: [true, 'Veuillez spécifier la date de l\'action de confirmation'],
        default: Date.now // Définit la date actuelle par défaut si non spécifiée
    },
    typeAction: { // Mappe à typeAction (ex: 'Création RDV', 'Modification RDV', 'Annulation RDV')
        type: String,
        required: [true, 'Veuillez spécifier le type d\'action'],
        trim: true
       
    },
    commentaire: { // Mappe à commentaire
        type: String,
        trim: true,
        // required: false // Le commentaire est optionnel
    }
    // idConfirmation sera géré par Mongoose via le champ _id par défaut
}, {
    timestamps: true // Ajoute automatiquement 'createdAt' et 'updatedAt'
});

module.exports = mongoose.model('Confirmation', confirmationSchema);