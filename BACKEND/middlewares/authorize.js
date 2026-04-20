// backend/middlewares/authorize.js

const authorize = (...roles) => {
  // ...roles permet de passer plusieurs rôles (ex: authorize('admin', 'dentiste'))
  return (req, res, next) => {
    // req.user est défini par le middleware 'protect'
    if (!req.user || !req.user.role) {
      // Si l'utilisateur n'est pas authentifié ou n'a pas de rôle (ne devrait pas arriver avec 'protect' avant)
      return res
        .status(403)
        .json({ message: "Accès refusé : rôle utilisateur non défini." });
    }

    // Vérifier si le rôle de l'utilisateur est inclus dans les rôles autorisés
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: `Accès refusé : rôle '${req.user.role}' non autorisé.`,
        });
    }

    // Si l'utilisateur a le rôle requis, passer au middleware/contrôleur suivant
    next();
  };
};

module.exports = authorize;
