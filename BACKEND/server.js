// backend/server.js
const express = require("express");
const dotenv = require("dotenv").config(); // Charge les variables du .env au démarrage
const connectDB = require("./config/db"); // Importe la fonction de connexion à la DB
const cors = require("cors"); // Importe le middleware CORS
const { errorHandler } = require("./middlewares/errorHandler"); // Importe le middleware de gestion des erreurs

const patientRoutes = require("./routes/patientRoutes");
const dentisteRoutes = require("./routes/dentisteRoutes");
const rendezVousRoutes = require("./routes/rendezVousRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const soinsRoutes = require("./routes/soinsRoutes");
const symptomeRoutes = require("./routes/symptomeRoutes");
const dentRoutes = require("./routes/dentRoutes");
const confirmationRoutes = require("./routes/confirmationRoutes");

const app = express();
const PORT = process.env.PORT || 5000; // Utilise le port du .env ou 5000 par défaut

// Connect to MongoDB
connectDB();

// Middlewares pour parser le corps des requêtes (JSON et URL-encodé) et gérer CORS
app.use(express.json()); // Permet de parser le corps des requêtes au format JSON
app.use(express.urlencoded({ extended: false })); // Permet de parser les données d'URL encodées
app.use(cors()); // Active le partage de ressources entre origines (CORS) pour permettre au frontend de communiquer

// Route de test simple pour vérifier que le serveur démarre et répond
app.get("/", (req, res) => {
  res.status(200).send("API is running..."); // Envoyer une réponse 200 OK
});

// Les routes de l'API seront ajoutées ici plus tard (ex: app.use('/api/patients', require('./routes/patientRoutes'));)
app.use("/api/patients", patientRoutes);
app.use("/api/dentistes", dentisteRoutes);
app.use("/api/rendezvous", rendezVousRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/soins", soinsRoutes);
app.use("/api/symptomes", symptomeRoutes);
app.use("/api/dents", dentRoutes);
app.use("/api/confirmations", confirmationRoutes);
// Middleware de gestion des erreurs. Il doit être placé après toutes les routes
// pour pouvoir intercepter les erreurs qui pourraient survenir dans les routes.
app.use(errorHandler);

// Démarrage du serveur Express
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
