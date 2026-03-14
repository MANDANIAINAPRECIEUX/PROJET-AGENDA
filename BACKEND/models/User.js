// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Pour le hachage des mots de passe
const jwt = require("jsonwebtoken"); // Pour les JSON Web Tokens

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, " Veuillez  ajouter une (1) adresse email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez ajouter  une  adresse email valide",
      ],
    },
    password: {
      type: String,
      required: [true, "Veuillez ajouter un mot de passe"],
      minlength: [
        6,
        "Le mot de passe doit contenir plus six caractères",
      ],
      select: false, svdvsd qsdfsdf sdfs ge erg ergez
    },
    role: {
      type: String,
      enum: ["admin", "dentiste", "patient"],
      default: "patient",
    },
    prenom: {
      // Correspond à `prenom` dans votre formData du frontend
      type: String,
      required: [true, "Veuillez ajouter  un prénom"],
      trim: true,
    },
    nom: {
      // Correspond à `nom` dans votre formData du frontend
      type: String,
      required: [true, "Veuillez ajouter  un nom"],
      trim: true,
    },
    telephone: {
      // Correspond à `telephone` dans votre formData du frontend
      type: String,
      required: [true, "Veuillez ajouter  un numéro de téléphone"],
      trim: true,
    },
    age: {
      // Correspond à `age` dans votre formData du frontend
      type: Number,
      required: [true, "Veuillez ajouter l'âge"],
      min: [0, "L'âge ne peut pas être négatif"],
      max: [120, "L'âge maximum est de 150 ans"],
    },
    // Vous pouvez aussi ajouter une adresse si nécessaire
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  },
);
// --- Méthodes du Schéma ---

// Crypter le mot de passe avant de le sauvegarder (middleware Mongoose 'pre-save')
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next(); // Passe au middleware suivant si le mot de passe n'est pas modifié
  }
  const salt = await bcrypt.genSalt(10); // Génère un "salt" pour le hachage
  this.password = await bcrypt.hash(this.password, salt); // Hache le mot de passe
  next();
});

// Générer un JWT pour l'utilisateur
userSchema.methods.getSignedJwtToken = function () {
  console.log(
    "User.js JWT_SECRET utilisé pour la signature :",
    process.env.JWT_SECRET,
  );
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Comparer le mot de passe entré par l'utilisateur avec le mot de passe haché dans la base de données
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
