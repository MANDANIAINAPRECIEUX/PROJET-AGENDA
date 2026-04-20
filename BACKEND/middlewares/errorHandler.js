// backend/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Détermine le code de statut : si la réponse est déjà 200, alors c'est une erreur serveur (500), sinon, garde le code défini
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Renvoie une réponse JSON avec le message d'erreur et la stack trace (en mode dev)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errorHandler };
