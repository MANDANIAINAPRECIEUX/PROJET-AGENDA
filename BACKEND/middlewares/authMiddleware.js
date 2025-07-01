// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User"); // Importez le modèle User

// Middleware pour protéger les routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les en-têtes d'autorisation
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraire le token de l'en-tête "Bearer token"
      token = req.headers.authorization.split(" ")[1];
      console.log(
        "AuthMiddleware.js JWT_SECRET utilisé pour la vérification :",
        process.env.JWT_SECRET
      );
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur correspondant au token et l'attacher à l'objet de requête
      // Le .select('-password') exclut le mot de passe de l'objet utilisateur
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Non autorisé, utilisateur non trouvé");
      }

      next(); // Passer au middleware ou à la fonction de route suivante
    } catch (error) {
      console.error(error); // Log l'erreur pour le débogage
      res.status(401);
      throw new Error("Non autorisé, token invalide");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Non autorisé, pas de token");
  }
});

module.exports = { protect };
