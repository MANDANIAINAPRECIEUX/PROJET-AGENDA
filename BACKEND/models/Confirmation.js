// backend/models/Confirmation.js (Ce modèle reflète la table CONFIRMATION selon vos dernières précisions)
const mongoose = require('mongoose');

const confirmationSchema = mongoose.Schema({
    rendezVous: { 
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Une confirmation doit être liée à un rendez-vous'],
        ref: 'RendezVous' 
    },
    dentist: { 
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Une confirmation doit être liée à un dentiste'],
        ref: 'Dentist' 
    },
    dateAction: { 
        type: Date,
        required: [true, 'Veuillez spécifier la date de l\'action de confirmation'],
        default: Date.now 
    },
    typeAction: { 
        type: String,
        required: [true, 'Veuillez spécifier le type d\'action'],
        trim: true
       
    },
    commentaire: { 
        type: String,
        trim: true,
        
    }
    
}, {
    timestamps: true 
});

module.exports = mongoose.model('Confirmation', confirmationSchema);