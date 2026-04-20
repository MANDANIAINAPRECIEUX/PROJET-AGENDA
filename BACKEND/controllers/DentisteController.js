const Dentiste = require("../models/Dentiste"); // Importer le modèle Dentiste (notez le 'e')
const asyncHandler = require("express-async-handler"); // Pour gérer les erreurs asynchrones
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Générer un ID unique du type : DNT-2025-AB12CD
function generateProfessionalId() {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const year = new Date().getFullYear();
  return `DNT-${year}-${rand}`;
}

// Générer un badge PDF
async function generateBadgePDF(dentiste) {
  const doc = new PDFDocument();
  const badgePath = path.join(
    __dirname,
    "..",
    "badges",
    `${dentiste.professionalId}.pdf`
  );

  const stream = fs.createWriteStream(badgePath);
  doc.pipe(stream);

  doc.fontSize(22).text("BADGE PROFESSIONNEL", { align: "center" });
  doc.moveDown();
  doc.fontSize(16).text(`Nom : ${dentiste.nom}`);
  doc.text(`Prénom : ${dentiste.prenom}`);
  doc.text(`Spécialité : ${dentiste.specialite}`);
  doc.text(`Professional ID : ${dentiste.professionalId}`);

  doc.moveDown();

  // QR Code image
  if (dentiste.qrCode) {
    doc.image(Buffer.from(dentiste.qrCode.split(",")[1], "base64"), {
      fit: [150, 150],
      align: "center",
    });
  }

  doc.end();

  return badgePath;
}

// @desc    Obtenir tous les dentistes
// @route   GET /api/dentistes
// @access  Public (pour l'instant)
const getDentistes = asyncHandler(async (req, res) => {
  const dentistes = await Dentiste.find({});
  res.status(200).json(dentistes);
});

// @desc    Obtenir un dentiste par ID
// @route   GET /api/dentistes/:id
// @access  Public
const getDentisteById = asyncHandler(async (req, res) => {
  const dentiste = await Dentiste.findById(req.params.id);

  if (dentiste) {
    res.status(200).json(dentiste);
  } else {
    res.status(404);
    throw new Error("Dentiste non trouvé");
  }
});

// @desc    Créer un nouveau dentiste
// @route   POST /api/dentistes
// @access  Public
const createDentiste = asyncHandler(async (req, res) => {
  const { nom, prenom, email, telephone, specialite, isAdmin } = req.body;

  if (!nom || !prenom || !email) {
    res.status(400);
    throw new Error("Champs obligatoires manquants");
  }

  const existing = await Dentiste.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("Email déjà utilisé");
  }

  // Générer l’ID pro
  const professionalId = generateProfessionalId();

  // Génération QR : il contient l’ID pro
  const qrCode = await QRCode.toDataURL(professionalId);

  // Créer le dentiste en base
  const dentiste = await Dentiste.create({
    nom,
    prenom,
    email,
    telephone,
    specialite,
    isAdmin,
    professionalId,
    qrCode,
  });

  // Générer le badge PDF
  const badgePdfUrl = await generateBadgePDF(dentiste);

  dentiste.badgePdfUrl = badgePdfUrl;
  await dentiste.save();

  res.status(201).json(dentiste);
});

// @desc    Mettre à jour un dentiste
// @route   PUT /api/dentistes/:id
// @access  Public
const updateDentiste = asyncHandler(async (req, res) => {
  const { nom, prenom, email, telephone, specialite, isAdmin } = req.body;

  const dentiste = await Dentiste.findById(req.params.id);

  if (dentiste) {
    dentiste.nom = nom !== undefined ? nom : dentiste.nom;
    dentiste.prenom = prenom !== undefined ? prenom : dentiste.prenom;
    dentiste.email = email !== undefined ? email : dentiste.email;
    dentiste.telephone =
      telephone !== undefined ? telephone : dentiste.telephone;
    dentiste.specialite =
      specialite !== undefined ? specialite : dentiste.specialite;
    dentiste.isAdmin = isAdmin !== undefined ? isAdmin : dentiste.isAdmin;

    const updatedDentiste = await dentiste.save();
    res.status(200).json(updatedDentiste);
  } else {
    res.status(404);
    throw new Error("Dentiste non trouvé");
  }
});

// @desc    Supprimer un dentiste
// @route   DELETE /api/dentistes/:id
// @access  Public
const deleteDentiste = asyncHandler(async (req, res) => {
  const dentiste = await Dentiste.findById(req.params.id);

  if (dentiste) {
    await Dentiste.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Dentiste supprimé avec succès" });
  } else {
    res.status(404);
    throw new Error("Dentiste non trouvé");
  }
});

// @desc    Télécharger le badge PDF d'un dentiste
// @route   GET /api/dentistes/:id/badge
// @access  Public
const getDentisteBadge = asyncHandler(async (req, res) => {
  // 🔍 Étape 1 : Vérification de l'ID reçu
  console.log("🔎 ID du dentiste reçu dans la requête:", req.params.id);

  const dentiste = await Dentiste.findById(req.params.id);

  if (!dentiste) {
    // ❌ Échec 1 : Dentiste non trouvé en DB
    console.error(
      `❌ Échec: Dentiste avec ID ${req.params.id} non trouvé en base de données.`
    );
    res.status(404);
    throw new Error("Dentiste non trouvé");
  }

  // ✅ Succès 1 : Dentiste trouvé
  console.log("✅ Succès: Dentiste trouvé. Pro ID:", dentiste.proId);

  if (!dentiste.badgePdfUrl) {
    // ❌ Échec 2 : URL manquante en DB
    console.error(
      `❌ Échec: Le champ badgePdfUrl est manquant pour le dentiste ${dentiste.proId}.`
    );
    res.status(404);
    throw new Error("Aucun badge associé à ce dentiste");
  }

  // ✅ Succès 2 : URL trouvée
  console.log("✅ Succès: URL de badge stockée:", dentiste.badgePdfUrl);

  // 🔍 Étape 3 : Construction et vérification du chemin absolu

  // Assurez-vous d'avoir 'path' importé: const path = require('path');
  const filePath = path.join(__dirname, "..", dentiste.badgePdfUrl);

  // 🔬 Vérifiez le chemin construit avant la vérification fs
  console.log("🔬 Chemin du fichier ABSOLU construit:", filePath);

  if (!fs.existsSync(filePath)) {
    // ❌ Échec 3 : Fichier non trouvé sur le disque
    console.error(
      `❌ Échec: Fichier non trouvé sur le serveur à l'emplacement: ${filePath}`
    );
    res.status(404);
    throw new Error("Badge non trouvé sur le serveur");
  }

  // ✅ Succès 3 : Fichier trouvé sur le disque
  console.log("✅ Succès: Fichier PDF trouvé sur le disque.");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="badge-${dentiste.proId}.pdf"`
  );

  const fileStream = fs.createReadStream(filePath);

  // 💡 Confirmation de l'envoi
  console.log(`📤 Envoi du fichier PDF pour ${dentiste.proId}.`);

  fileStream.pipe(res);
});

// const creerDentiste = async (req, res) => {
//   try {
//     const { nom, prenom, specialite, telephone, email, isAdmin } = req.body;

//     // Vérification doublons email
//     const existingEmail = await Dentiste.findOne({ email });
//     if (existingEmail) {
//       return res.status(400).json({ message: "Cet email existe déjà." });
//     }

//     // 1. Création du dentiste
//     const dentiste = await Dentiste.create({
//       nom,
//       prenom,
//       specialite,
//       telephone,
//       email,
//       isAdmin,
//     });

//     // 2. Génération du QR code
//     const qrCodeData = await QRCode.toDataURL(dentiste.proId);
//     dentiste.qrCode = qrCodeData;
//     await dentiste.save();

//     // 3. Génération du badge PDF
//     const badgePath = path.join(
//       __dirname,
//       "..",
//       "badges",
//       `${dentiste.proId}.pdf`
//     );

//     const doc = new PDFDocument({ size: "CARD", layout: "landscape" });
//     doc.pipe(fs.createWriteStream(badgePath));

//     doc.rect(0, 0, 350, 200).fill("#F0F4FF");

//     doc.fillColor("#000").fontSize(16).text("Badge Professionnel", 20, 15);
//     doc.fontSize(14).text(`${dentiste.prenom} ${dentiste.nom}`, 20, 60);
//     doc.fontSize(12).text(`Spécialité: ${dentiste.specialite}`, 20, 90);
//     doc.fontSize(12).text(`ID: ${dentiste.proId}`, 20, 120);
//     doc.image(qrCodeData, 240, 40, { width: 90, height: 90 });

//     doc.end();

//     res.status(201).json({
//       message: "Dentiste créé avec succès",
//       dentiste,
//       badgeURL: `/badges/${dentiste.proId}.pdf`,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Erreur lors de la création du dentiste" });
//   }
// };

const creerDentiste = async (req, res) => {
  try {
    console.log("📥 Requête reçue pour créer un dentiste");
    console.log("Données reçues :", req.body);

    const { nom, prenom, specialite, telephone, email, isAdmin } = req.body;

    // Vérification email
    console.log("🔍 Vérification doublon email :", email);
    const existingEmail = await Dentiste.findOne({ email });

    if (existingEmail) {
      console.log("❌ Email déjà utilisé :", email);
      return res.status(400).json({ message: "Cet email existe déjà." });
    }

    // 1. Création du dentiste
    console.log("🛠 Création du dentiste dans MongoDB…");
    const dentiste = await Dentiste.create({
      nom,
      prenom,
      specialite,
      telephone,
      email,
      isAdmin,
    });

    console.log("✅ Dentiste créé :", dentiste);

    // 2. Génération du QR code
    console.log(
      "🧾 Génération du QR Code pour ID :",
      dentiste.proId || dentiste._id
    );
    const uniqueId = dentiste.proId || dentiste._id.toString();
    const qrCodeData = await QRCode.toDataURL(uniqueId);

    dentiste.qrCode = qrCodeData;
    await dentiste.save();

    console.log("✅ QR Code ajouté au dentiste");

    // 3. Génération du badge PDF
    const badgePath = path.join(
      __dirname,
      "..",
      "badges",
      `${dentiste.proId}.pdf`
    );

    const qrPath = path.join(
      __dirname,
      "..",
      "badges",
      `${dentiste.proId}.png`
    );
    await QRCode.toFile(qrPath, uniqueId);

    const doc = new PDFDocument({
      size: [450, 300],
      layout: "landscape",
    });

    const writeStream = fs.createWriteStream(badgePath);
    doc.pipe(writeStream);

    const gradient = doc.linearGradient(0, 0, 550, 0);

    gradient.stop(0, "pink"); // rose
    gradient.stop(0.5, "purple"); // violet
    gradient.stop(1, "blue"); // bleu

    doc.rect(0, 0, 550, 400).fill(gradient);

    doc.fillColor("#FFFFFF").fontSize(22).text("Badge Professionnel", 20, 20);
    // Cadre autour du titre
    doc
      .lineWidth(2) // épaisseur du contour
      .strokeColor("#FFFFFF") // couleur du contour (bleu moderne)
      .rect(15, 12, 270, 35) // X, Y, largeur, hauteur du cadre
      .stroke(); // dessine seulement le contour

    // Texte dans le cadre

    // Style global
    doc.fontSize(12);

    // Lignes d'information
    const infos = [
      { label: "Nom :", value: dentiste.nom },
      { label: "Prénom :", value: dentiste.prenom },
      { label: "Spécialité :", value: dentiste.specialite },
      { label: "Votre ID Pro :", value: dentiste.proId },
    ];

    // Position de départ
    let xLabel = 20; // colonne de gauche (labels)
    let xValue = 100; // colonne de droite (valeurs)
    let y = 60; // position verticale initiale
    let lineHeight = 22; // espace entre lignes

    infos.forEach((item) => {
      // Label en noir
      doc.fillColor("#FFFFFF").text(item.label, xLabel, y);

      // Valeur en blanc
      doc.fillColor("#FFFFFF").text(item.value, xValue, y);

      y += lineHeight;
    });
    // Titre au-dessus du QR code
    doc
      .font("Helvetica-Bold") // Police en gras
      .fillColor("#FFFFFF") // Texte blanc
      .fontSize(14) // Taille du titre
      .text("Votre Code QR", 25, 150, {
        underline: true, // Soulignement
      });

    // QR code juste dessous
    doc.rect(20, 180, 80, 80).fill("#FFFFFF");
    doc.fillColor("#000");

    const qrBase64 = qrCodeData.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(qrBase64, "base64");

    doc.image(qrBuffer, 25, 185, {
      width: 70,
      height: 70,
    });

    doc.end();

    // Vérification écriture PDF
    writeStream.on("finish", () => {
      console.log("✅ Badge PDF généré :", badgePath);
    });
    dentiste.badgePdfUrl = `/badges/${dentiste.proId}.pdf`;
    await dentiste.save();

    writeStream.on("error", (err) => {
      console.log("❌ ERREUR lors de la génération du badge PDF :", err);
    });

    res.status(201).json({
      message: "Dentiste créé avec succès",
      dentiste,
      badgeURL: `/badges/${dentiste.proId}.pdf`,
    });

    console.log("📤 Réponse envoyée au frontend avec le badge URL");
  } catch (error) {
    console.error("🔥 ERREUR Backend :", error);
    res.status(500).json({ message: "Erreur lors de la création du dentiste" });
  }
};

const verifyDentiste = async (req, res) => {
  try {
    const { proId } = req.params;

    console.log("🔍 Vérification du QR ID :", proId);

    const dentiste = await Dentiste.findOne({ proId });

    if (!dentiste) {
      console.log("❌ Dentiste introuvable pour ID :", proId);
      return res.status(404).json({ message: "Badge invalide" });
    }

    console.log("✅ Dentiste trouvé :", dentiste);

    res.json({
      message: "Badge valide",
      dentiste,
    });
  } catch (error) {
    console.error("🔥 ERREUR vérification :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const verifierQR = async (req, res) => {
  try {
    const { qrData } = req.body;

    const dentiste = await Dentiste.findOne({
      proId: qrData,
    });

    if (!dentiste) {
      return res.status(404).json({ ok: false, message: "QR invalide" });
    }

    return res.json({
      ok: true,
       isAdmin: dentiste.isAdmin ,
      dentiste,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
};

module.exports = {
  getDentistes,
  getDentisteById,
  createDentiste,
  updateDentiste,
  deleteDentiste,
  getDentisteBadge,
  creerDentiste,
  verifyDentiste,
  verifierQR,
};
