// backend/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        
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
        type: String,sfsdfsdfs sfsdfsdf sdfsfsdfs
        required: [true, 'Veuillez ajouter le contenu du message'],
        trim: true
    },
    read: { // Statut de lecture de la notification
        type: Boolean,
        default: false
    },
    
}, {
    timestamps: true // Ajoute automatiquement les champs 'createdAt' et 'updatedAt'
});

module.exports = mongoose.model('Notification', notificationSchema);