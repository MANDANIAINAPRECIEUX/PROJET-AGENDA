// backend/models/
const mongoose = require("mongoose");
const crypto = require("crypto");
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
    proId: {
      type: String,
      unique: true,
      default: function () {
        return "DENT-" + crypto.randomBytes(4).toString("hex").toUpperCase();
      },
    },

    specialite: {
      type: String,
      // required: [true, 'Veuillez spécifier la spécialité du dentiste'],
      // enum: ['Généraliste', 'Orthodontiste', 'Parodontiste', 'Endodontiste', 'Pédodontiste'],
    },

    password: {
      type: String,
      required: false, // tu choisis selon ton type d’authentification
      select: false,
    },
    email: {
      type: String,
      required: [false, "veuillez ajoutter un email"],
      unique: false,
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
    },
    badgePdfUrl: {
      type: String,
      required: false,
    },

    qrCode: {
      type: String,wxcxwxc
      required: false,
    },
  },
  {
    timestamps: true, // Ajoute automatiquement les champs 'createdAt' et 'updatedAt'
  }
);

module.exports = mongoose.model("Dentiste", dentisteSchema);
