// backend/models/Soin.js
const mongoose = require("mongoose");

const soinSchema = mongoose.Schema(
  {
    rendezVous: {
      
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Un soin doit être lié à un rendez-vous"],
      ref: "RendezVous", // Fait référence au modèle 'RendezVous'
    },
    typeDeSoin: {
      // Mappe à TypeDeSoin
      type: String,
      required: [true, "Veuillez spécifier le type de soin"],
      trim: true,
      // Si plus tard vous avez un catalogue de soins disponibles,
      // 'typeDeSoin' pourrait devenir une référence à ce catalogue.
      // Pour l'instant, c'est une chaîne de caractères libre.
    },
    duree: {
      // Mappe à Durée
      type: Number,
      required: [true, "Veuillez spécifier la durée du soin en minutes"],
      min: 1,
    },
    commentaire: {
      // Mappe à Commentaire
      type: String,
      trim: true,
      // required: false // Le commentaire est optionnel
    },
    // IdSoins sera géré par Mongoose via le champ _id par défaut
  },
  {
    timestamps: true, // Ajoute automatiquement 'createdAt' (date de l'enregistrement du soin) et 'updatedAt'
  }
);

module.exports = mongoose.model("Soin", soinSchema);
