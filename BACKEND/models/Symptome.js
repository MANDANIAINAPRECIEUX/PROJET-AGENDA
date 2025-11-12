// backend/models/Symptome.js (Ce modèle reflète la table SYMPTOME de votre UML)
const mongoose = require("mongoose");

const symptomeSchema = mongoose.Schema(
  {
    rendezVous: {
      // Mappe à IdDent (FK vers DENT)
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Un symptôme doit être associé à une dent"],
      ref: "RendezVous", // Fait référence au modèle 'Dent'
    },
    typeSymptome: {
      // Mappe à typeSymptome
      type: String,
      required: [true, "Veuillez spécifier le type de symptôme"],
      trim: true,
    },
    niveauSymptome: {
      // Mappe à niveauSymptome
      type: String,
      // Considérez un 'enum' ici si les niveaux sont prédéfinis (ex: 'Faible', 'Modéré', 'Sévère')
      // enum: ['Faible', 'Modéré', 'Sévère'],
      required: [true, "Veuillez spécifier le niveau du symptôme"],
      trim: true,
    },
    description: {
      // Mappe à description
      type: String,
      trim: true,
      required: false, // La description est optionnelle
    },
    // idSymptome sera géré par Mongoose via le champ _id par défaut
  },
  {
    timestamps: true, // Ajoute automatiquement 'createdAt' et 'updatedAt'
  }
);

module.exports = mongoose.model("Symptome", symptomeSchema);
