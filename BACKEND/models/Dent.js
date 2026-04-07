// backend/models/Dent.js (Ce modèle reflète la table DENT de votre UML)
const mongoose = require("mongoose");

const dentSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Fait référence au modèle 'User'
    },

    nomDent: {
      // Mappe à nomDent
      type: String,
      required: [true, "Veuillez spécifier le nom de la dent"],
      trim: true,
    },
    typeDent: {gdgfdsgf dfgdsfgsdfg dfgsdfgsdg dfgsdgsdfg dfgsdgsdgsdg
      // Mappe à typeDent
      type: String,
      required: [true, "Veuillez spécifier le type de dent "],
      trim: true,
    },
    secteurDentaire: {
      // Mappe à secteurDentaire (ex: quadrant, arcade)
      type: String,
      required: [
        true,
        "Veuillez spécifier le secteur dentaire (ex: supérieur droit, inférieur gauche)",
      ],
      trim: true,
    },
    numero: {
      // Mappe à numero (numérotation universelle ou FDI)
      type: Number,
      required: [true, "Veuillez spécifier le numéro de la dent"],
      min: 1, // Les numéros de dents sont généralement positifs
    },
    // idDent sera géré par Mongoose via le champ _id par défaut
  },
  {
    timestamps: true, // Ajoute automatiquement 'createdAt' et 'updatedAt'
  }
);

module.exports = mongoose.model("Dent", dentSchema);
