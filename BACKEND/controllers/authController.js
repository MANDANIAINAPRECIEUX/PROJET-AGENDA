// backend/controllers/authController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/User"); // Importer le modèle User

// @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

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
    role: role || "patient", // Utilise le rôle fourni ou 'patient' par défaut
  });

  // 4. Répondre avec les informations de l'utilisateur et un JWT
  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
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

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
};
