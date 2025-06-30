// backend/models/Patient.js
const mongoose = require("mongoose");

const dentisteSchema = mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "veuillez entrer votre nom"],
    },
    prenom: {
      type: String,
      required: [true, "veuillez entrer votre prénom"],
    },
    specialite: {
      type: String,
      // required: [true, 'Veuillez spécifier la spécialité du dentiste'],
      // enum: ['Généraliste', 'Orthodontiste', 'Parodontiste', 'Endodontiste', 'Pédodontiste'],
    },
    email: {
      type: String,
      required: [true, "veuillez ajoutter un email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Veuillez utiliser une adresse email valide"],
    },
    telephone: {
      type: String,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      required: true, // Un dentiste doit avoir un statut admin ou non
      default: false, // Par défaut, un dentiste n'est pas administrateur
    },
  },
  {
    timestamps: true, // Ajoute automatiquement les champs 'createdAt' et 'updatedAt'
  }
);

module.exports = mongoose.model("Dentiste", dentisteSchema);
