// backend/controllers/authController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/User"); // Importer le modèle User
const crypto = require("crypto");
const { sendMail } = require("../controllers/emailController");
// @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role, nom, prenom, age, telephone } = req.body;

  // 1. Validation des champs d'entrée
  if (!email || !password) {
    res.status(400);
    throw new Error(
      "Veuillez entrer tous les champs obligatoires : email et mot de passe."
    );
  }

  // 2. Vérifier si l'utilisateur existe déjà
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Un utilisateur avec cet email existe déjà.");
  }

  // 3. Créer l'utilisateur
  // Le hachage du mot de passe se fait automatiquement via le middleware 'pre-save' dans le modèle User.js
  const user = await User.create({
    email,
    password,
    role: role || "patient",
    nom,
    prenom,
    age,
    telephone,
    // Utilise le rôle fourni ou 'patient' par défaut
  });

  // 4. Répondre avec les informations de l'utilisateur et un JWT
  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      nom: user.nom,
      prenom: user.prenom,
      age: user.age,
      telephone: user.telephone,
      password: user.password,
      token: user.getSignedJwtToken(), // Génère et envoie le JWT
    });
  } else {
    res.status(400);
    throw new Error("Données utilisateur invalides.");
  }
});

// @desc    Connecter un utilisateur
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Validation des champs d'entrée
  if (!email || !password) {
    res.status(400);
    throw new Error("Veuillez entrer l'email et le mot de passe.");
  }

  // 2. Vérifier si l'utilisateur existe et obtenir le mot de passe (select: false)
  // Utiliser .select('+password') pour forcer la sélection du champ password qui est par défaut caché
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401); // 401 Unauthorized
    throw new Error("Identifiants invalides.");
  }

  // 3. Comparer le mot de passe entré avec le mot de passe haché
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Identifiants invalides.");
  }

  // 4. Si les identifiants sont valides, renvoyer un JWT
  res.status(200).json({
    _id: user._id,
    email: user.email,
    role: user.role,
    token: user.getSignedJwtToken(), // Génère et envoie le JWT
  });
});

// @desc    Obtenir les informations de l'utilisateur actuel (profil)
// @route   GET /api/auth/me
// @access  Private (nécessite un token JWT valide)
const getMe = asyncHandler(async (req, res) => {
  // req.user est défini par le middleware de protection JWT
  const user = await User.findById(req.user.id).select("-password"); // Exclure le mot de passe

  if (user) {
    res.status(200).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    res.status(404);
    throw new Error("Utilisateur non trouvé.");
  }
});

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/users (ou /api/auth/users)
// @access  Privé (Admin seulement)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password"); // Exclut les mots de passe
  res.status(200).json(users);
});

//mitady user am email
const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const sendForgotPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Génération token reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // expire 10 minutes
    await user.save();

    // URL envoyée par email
    const resetURL = `http://localhost:5173/reset-password?token=${resetToken}`;

    // email
    await sendMail({
      to: user.email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <p>Bonjour,</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>Ce lien expire dans 10 minutes.</p>
      `,
    });

    res.json({ message: "Email envoyé" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpire: { $gt: Date.now() }, // pas expiré
    });

    if (!user) {
      return res.status(400).json({ message: "delai d'attente expiré" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUserByEmail,
  sendForgotPasswordEmail,
  resetPassword,
};
