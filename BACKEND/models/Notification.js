// backend/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // Pour le moment, nous allons permettre de référencer soit un Patient, soit un Dentiste.
        // Une approche plus avancée pourrait utiliser un champ 'onModel' pour une référence dynamique
        // ou un modèle 'User' général pour centraliser les destinataires.
        // Pour l'instant, on suppose que recipient pourrait être un patient ou un dentiste.
        // On le précisera dans les contrôleurs.
        // Si nous avions un modèle 'User', ce serait 'ref: 'User''
    },
    recipientModel: { // Champ pour indiquer si le destinataire est un Patient ou un Dentist
        type: String,
        required: true,
        enum: ['Patient', 'Dentist'] // Les modèles possibles pour le destinataire
    },
    type: { // Type de notification (ex: 'rappel_rdv', 'annulation', 'message_admin')
        type: String,
        required: [true, 'Veuillez spécifier le type de notification'],
        enum: ['Rappel RDV', 'Annulation RDV', 'Message', 'Promotion', 'Autre'] // Exemples de types
    },
    message: {
        type: String,sdfgdsg dfgsdfgsdf
        required: [true, 'Veuillez ajouter le contenu du message'],
        trim: true
    },
    read: { // Statut de lecture de la notification
        type: Boolean,
        default: false
    },
    // Vous pouvez ajouter une référence au rendez-vous si la notification est liée à un RDV
    // rendezVous: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'RendezVous',
    //     required: false // Optionnel
    // }
}, {
    timestamps: true // Ajoute automatiquement les champs 'createdAt' et 'updatedAt'
});

module.exports = mongoose.model('Notification', notificationSchema);