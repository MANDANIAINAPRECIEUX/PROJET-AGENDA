"use client";

import { useState, useEffect } from "react";
import { useRef } from "react";

import {
  User,
  ArrowLeft,
  Calendar,
  Clock,
  Stethoscope,
  Activity,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

import { DiagrammeDentaire } from "../components/DiagrammeDentaire";
import { emojiOptions } from "./EmojiOption";
import { allTeethData } from "./AllTeethData";
import axios from "axios";

import { useContext } from "react";
import { ColorContext } from "../context/color-context";
import { useReservation } from "../hooks/useReservation";
import { getPatientDataFromStorage } from "../hooks/useReservation";
import { typesSymptomes } from "./types/TypesSymptomes";
import { modernStyles } from "../styles/Styles";

export default function FormulaireDeReservation() {
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(ColorContext);
  const { isLoading: isLoadingPatientData, patientData } = useReservation();
  const [rendezVousCree, setRendezVousCree] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    // Champs pour la dent
    patient: "",

    typeDent: "",
    secteurDentaire: "",
    numero: "",
    // Champs pour les symptômes
    typesSymptomes: [],
    niveauSymptome: 0, // Mis à 0 par défaut pour correspondre à "AUCUNE"
    description: "",
  });
  const dentSectionRef = useRef(null);
  const symptomeSectionRef = useRef(null);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const showAlert = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  //enregistrement des donnes amzay
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ito lo zany an, ny contenu anl form complet", formData);
    console.log("ito ndray n typesymptome", formData.typesSymptomes);
    if (selectedTeeth.length === 0) {
      showAlert(
        "⚠️ Veuillez sélectionner au moins une dent avant de continuer."
      );
      // Fait défiler vers la section dents
      document
        .getElementById("section-dents")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (formData.typesSymptomes.length === 0) {
      showAlert(
        "⚠️ Veuillez sélectionner au moins une manifestation clinique avant de continuer."
      );
      document
        .getElementById("section-symptomes")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("❌ Veuillez vous reconnecter pour valider votre demande.");
      return;
    }

    let idPatientRecuperer = patientData?._id || patientData?.id;

    if (!idPatientRecuperer) {
      const localPatient = JSON.parse(localStorage.getItem("patient"));
      const idFromToken = localPatient?.id || localPatient?._id || null;
      if (!idFromToken) {
        alert(
          "❌ Impossible de récupérer l'ID patient. Veuillez vous reconnecter."
        );
        return;
      }
      idPatientRecuperer = idFromToken;
    }
    // refa tsisy nify selectionné
    if (!selectedTeeth || selectedTeeth.length === 0) {
      setShowModal(true);
      setModalMessage(
        "⚠️ Veuillez sélectionner au moins une dent avant de continuer."
      );
      return;
    }

    console.log("ty le token", token);

    //insertion an rdv vao2
    try {
      const rendezVousRes = await axios.post(
        "/api/rendezvous",
        {
          patient: idPatientRecuperer || 21, // récupéré du formulaire ou du token
          dentiste: "6862e8f446136d62ea73498a", // ID fixe du dentiste
          dateHeure: formData.dateHeure || new Date().toISOString(), // date choisie ou actuelle
          dureeMinutes: formData.dureeMinutes || 30, // par défaut 30 min
          motif: formData.motif || "Consultation dentaire",
          statut: "En attente",
          notes: formData.description || "Aucune note",
        },

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Rendez-vous enregistré avec succès !");
      console.log("Rendez-vous créé :", rendezVousRes.data);
      setRendezVousCree(rendezVousRes.data);
    } catch (error) {
      console.error("❌ Erreur :", error);
      alert(`Erreur : ${error.message}`);
    }

    // eti ndray mapiditra anl dents
    // Pour chaque dent sélectionnée :
    for (const teeth of selectedTeeth) {
      try {
        // 🎉 On utilise les données pré-calculées dans l'objet 'teeth'
        const secteurDentaire = teeth.secteur;
        const nomDent = teeth.name;

        // 🔍 Logs utiles
        console.log("🦷 Envoi de la dent :", teeth);
        console.log("   Patient ID :", patientData._id);
        console.log("   Nom de la dent :", nomDent); // Nouveau log
        console.log("   Type de dent :", teeth.type);
        console.log("   Secteur dentaire :", secteurDentaire);
        console.log("   Numéro :", teeth.number);

        // ✅ Requête API
        const dentRes = await axios.post(
          "/api/dents",
          {
            patient: patientData._id,
            nomDent, // Optionnel, si votre backend l'accepte
            typeDent: teeth.type,
            secteurDentaire, // Maintenant directement tiré de teeth.secteur
            numero: teeth.number,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ Dent créée avec succès :", dentRes.data);
      } catch (error) {
        // ... (Gestion des erreurs inchangée)
        console.error("❌ Erreur :", error);
        alert(
          `⚠️ Erreur lors de l'envoi : ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }

    alert(
      "🎉 Toutes les dents sélectionnées ont été enregistrées avec succès !"
    );

    // eto aon symptome makany am
    // insertion du nouveau symptome
    // try {
    //   const symptomesRes = await axios.post(
    //     "/api/symptomes",
    //     {
    //       rendezVous: rendezVousRes.data._id, // l'ID du rendez-vous créé
    //       typesSymptomes: formData.typesSymptomes, // tableau des symptômes sélectionnés
    //       niveauSymptome: formData.niveauSymptome, // intensité
    //       description: formData.description, // texte libre
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );

    //   return { symptomesRes };

    //   console.log("✅ Symptômes enregistrés :", symptomesRes.data);
    // } catch (error) {
    //   console.error(
    //     "❌ Erreur lors de l'enregistrement des symptômes :",
    //     error
    //   );
    //   alert(
    //     `⚠️ Erreur lors de l'enregistrement des symptômes : ${
    //       error.response?.data?.message || error.message
    //     }`
    //   );
    // }
  };

  useEffect(() => {
    const enregistrerSymptomes = async () => {
      if (!rendezVousCree) return;

      // sécurité : on attend que le rendez-vous existe
      const token = localStorage.getItem("userToken");
      const typeSymptomeString = formData.typesSymptomes.join(", ");

      console.log("rendezVousCree", rendezVousCree);
      console.log("rendezVousCree._id", rendezVousCree._id);
      console.log("typesSymptomes", typeSymptomeString);
      console.log("niveauSymptome", formData.niveauSymptome);
      console.log("description", formData.description);

      // rendezVous,    typeSymptome,    niveauSymptome,    description
      try {
        const symptomesRes = await axios.post(
          "/api/symptomes",
          {
            rendezVous: rendezVousCree._id, // on récupère l’ID du rendez-vous créé
            typeSymptome: typeSymptomeString,
            niveauSymptome: formData.niveauSymptome,
            description: formData.description,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("le valeur an rendezvouscree dia :", rendezVousCree);
        console.log("✅ Symptômes enregistrés :", symptomesRes.data);
        alert("🎉 Symptômes enregistrés avec succès !");
      } catch (error) {
        console.error("❌ Erreur enregistrement symptômes :", error);
        alert(
          `⚠️ Erreur lors de l'enregistrement des symptômes : ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    enregistrerSymptomes();
  }, [rendezVousCree]); // ✅ Se déclenche uniquement quand un nouveau rendez-vous est créé

  // Fonctions utilitaires pour les données patient depuis localstorage

  const generatePatientIdFromData = (userData) => {
    if (!userData) return "";

    // Essayer d'utiliser l'ID existant
    if (userData.id) return userData.id;
    if (userData._id) return userData._id;

    // Générer un ID basé sur le nom et prénom
    if (userData.nom && userData.prenom) {
      return `ID-${userData.nom.toUpperCase()}-${userData.prenom.toUpperCase()}`;
    }

    // ID par défaut
    return `ID-PATIENT-${Date.now()}`;
  };

  // Fonction pour récupérer les données complètes du patient depuis l'API

  // Charger les données du rendez-vous depuis localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("appointmentData");
    if (savedData) {
      setAppointmentData(JSON.parse(savedData));
    } else {
      navigate("/ChoixDeRdv");
    }

    // Récupération des données patient avec les fonctions utilitaires
    const userData = getPatientDataFromStorage();
    if (userData) {
      console.log("Données patient trouvées:", userData);
      console.log("Nom:", userData.nom);
      console.log("Prénom:", userData.prenom);

      // Si les données contiennent nom et prénom, les utiliser directement
      if (userData.nom && userData.prenom) {
        setPatientData(userData);
        setFormData((prev) => ({
          ...prev,
          patient: generatePatientIdFromData(userData),
        }));
      }
    } else {
      console.warn("Aucune donnée utilisateur trouvée dans localStorage");
    }
  }, [navigate]);

  // [Toutes les autres fonctions restent identiques]
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleToothSelect = (toothNumber) => {
    const tooth = allTeethData.find((t) => t.number === toothNumber);
    if (tooth) {
      setSelectedTeeth((prev) => {
        const isAlreadySelected = prev.some((t) => t.number === toothNumber);
        if (isAlreadySelected) {
          // Désélectionner la dent
          return prev.filter((t) => t.number !== toothNumber);
        } else {
          // Ajouter la dent à la sélection
          return [...prev, tooth];
        }
      });

      // Mettre à jour le formulaire avec la première dent sélectionnée
      // Cette logique peut être améliorée si tu veux que formData.numero/nomDent/etc.
      // reflète toutes les dents sélectionnées, pas seulement la première ou la dernière.
      // Pour l'instant, elle prend la première si déjà des sélectionnées, sinon la nouvelle.
      // Si tu veux toutes les afficher dans les champs textuels, il faudra ajuster.
      setFormData((prev) => {
        const updatedSelectedTeeth = selectedTeeth.some(
          (t) => t.number === toothNumber
        )
          ? selectedTeeth.filter((t) => t.number !== toothNumber)
          : [...selectedTeeth, tooth];

        return {
          ...prev,
          numero: updatedSelectedTeeth.map((t) => t.number).join(", "),
          // nomDent: updatedSelectedTeeth.map((t) => t.name).join(", "),
          typeDent: [...new Set(updatedSelectedTeeth.map((t) => t.type))].join(
            ", "
          ),
          secteurDentaire: [
            ...new Set(updatedSelectedTeeth.map((t) => t.secteur)),
          ].join(", "),
        };
      });
    }
  };

  const handleSymptomeToggle = (symptome) => {
    setFormData((prev) => ({
      ...prev,
      typesSymptomes: prev.typesSymptomes.includes(symptome)
        ? prev.typesSymptomes.filter((s) => s !== symptome)
        : [...prev.typesSymptomes, symptome],
    }));
  };

  const handleNiveauChange = (level, event) => {
    if (event) {
      event.preventDefault();
    }
    setFormData((prev) => ({
      ...prev,
      niveauSymptome: level,
    }));
  };

  const handleGoBack = () => {
    navigate("/ChoixDeRdv");
  };

  const localPatient = JSON.parse(localStorage.getItem("user"));
  const idPatient = localPatient?._id || localPatient?.id || "";
  // [Code de rendu JSX complet avec la nouvelle section patient]
  return (
    <>
      <style>{modernStyles}</style>
      <div className=" ultra-modern-bg bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600">
        {/* titre b voloany */}
        <div className="relative flex items-center justify-center py-14 px-6 ">
          <div className="backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-10 max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Confirmation de{" "}
              <span className=" drop-shadow-lg">votre Consultation</span>
            </h1>
            <p className="text-lg text-white/90 mt-4 max-w-2xl mx-auto">
              Merci de confirmer votre rendez-vous et de décrire vos symptômes.
              Ces informations aideront votre dentiste à mieux préparer votre
              consultation.
            </p>
          </div>
        </div>
        {/* faranle titre d fanomboanl informatiion */}

        <div className="max-w-6xl mx-auto p-6 lg:p-12">
          {/* [En-tête et titre] */}

          <form onSubmit={handleSubmit} className="space-y-16">
            {/* Section Identification Patient - AMÉLIORÉE */}
            <div className="glass-panel p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="items-center">
                  <span className="subsection-title">Vos Informations</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="patient"
                    className="text-blue-600 font-semibold mb-2 text-lg  block"
                  >
                    Votre Identifiant
                  </Label>

                  <div className="modern-input bg-gray-50 flex items-center">
                    <span
                      id="patient"
                      placeholder="ID-XXXX-XXXX"
                      readOnly={!!patientData} // Lecture seule si les données patient sont disponibles
                      required
                    >
                      {idPatient}
                    </span>
                  </div>
                </div>

                {/* Affichage du nom complet du patient */}
                {patientData && (patientData.nom || patientData.prenom) && (
                  <div>
                    <Label className="text-blue-500 font-semibold mb-2 text-lg block">
                      Votre Nom
                    </Label>
                    <div className="modern-input bg-gray-50 flex items-center">
                      <span>
                        {patientData.prenom || ""} {patientData.nom || ""}
                      </span>
                    </div>
                  </div>
                )}
                {/* Indicateur de chargement */}
                {isLoadingPatientData && (
                  <div>
                    <Label className="text-slate-700 font-semibold text-lg mb-3 block">
                      Votre Nom
                    </Label>
                    <div className="modern-input bg-gray-50 flex items-center">
                      <User className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-slate-600">
                        Chargement des données...
                      </span>
                    </div>
                  </div>
                )}

                {/* Informations supplémentaires du patient */}
                {patientData &&
                  (patientData.email ||
                    patientData.telephone ||
                    patientData.age) && (
                    <div className="md:col-span-2">
                      <div className="bg-blue-50 border bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {patientData.email && (
                            <div className=" flex items-center gap-x-2">
                              <span className="text-blue-600 font-medium">
                                Email:
                              </span>
                              <br />
                              <span className="text-slate-700">
                                {patientData.email}
                              </span>
                            </div>
                          )}
                          {patientData.telephone && (
                            <div className=" flex items-center gap-x-2">
                              <span className="text-blue-600 font-medium">
                                Téléphone:
                              </span>
                              <br />
                              <span className="text-slate-700">
                                {patientData.telephone}
                              </span>
                            </div>
                          )}
                          {patientData.age && (
                            <div className=" flex items-center gap-x-2">
                              <span className="text-blue-600 font-medium">
                                Âge:
                              </span>
                              <br />
                              <span className="text-slate-700">
                                {patientData.age} ans
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* [Reste du formulaire - sélection dentaire, symptômes, etc.] */}
            <div className="section-divider"></div>

            {/* Section Sélection Dentaire */}
            <div ref={dentSectionRef} className="glass-panel p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="subsection-title">Sélection Dentaire</span>
                </div>
              </div>

              <DiagrammeDentaire
                selectedTeeth={selectedTeeth}
                onToothSelect={handleToothSelect}
              />
            </div>

            <div className="section-divider"></div>

            {/* Section Symptomatologie */}
            <div ref={symptomeSectionRef} className="glass-panel p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="subsection-title">
                    Symptomatologie Clinique
                  </span>
                </div>
              </div>

              <div className="space-y-12">
                {/* Types de symptômes */}
                <div>
                  <Label className="text-slate-700 font-semibold text-lg mb-6 block">
                    Manifestations cliniques
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {typesSymptomes.map((symptome) => (
                      <div
                        key={symptome.name}
                        onClick={() => handleSymptomeToggle(symptome.name)}
                        className={`symptom-card ${
                          formData.typesSymptomes.includes(symptome.name)
                            ? "selected"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{symptome.icon}</div>
                          <div className="flex-1">
                            {/* Le cercle de sélection est maintenant intégré dans le flex-1 */}
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-3 ${
                                formData.typesSymptomes.includes(symptome.name)
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-slate-300"
                              }`}
                            >
                              {formData.typesSymptomes.includes(
                                symptome.name
                              ) && (
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="font-semibold text-slate-700 text-lg">
                              {symptome.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {formData.typesSymptomes.length === 0 && (
                    <p className="text-red-500 text-base flex items-center gap-2 mt-4">
                      <AlertCircle className="h-5 w-5" />
                      Veuillez sélectionner au moins une manifestation clinique
                    </p>
                  )}
                </div>

                {/* Intensité des symptômes */}
                <div>
                  <Label className="text-slate-700 font-semibold text-lg mb-6 block">
                    Intensité symptomatique
                  </Label>

                  <div className="glass-panel p-8 rounded-2xl bg-blue-50 shadow-md">
                    <div className="text-center mb-8">
                      <h4 className="text-2xl font-bold text-blue-800 mb-4">
                        Intensité de la Douleur
                      </h4>
                      <p className="text-blue-600">
                        Cliquez sur l'emoji qui correspond le mieux à votre
                        ressenti
                      </p>
                    </div>

                    <div className="relative">
                      {/* Barre de gradient bleue */}
                      <div className="absolute  bottom-1/2 left-0 w-full h-3 rounded-full bg-gradient-to-r from-blue-200 via-blue-400 to-blue-800 shadow-inner -translate-y-1/2 z-0" />

                      <div className="relative z-10 flex justify-between items-center mb-8">
                        {emojiOptions.map((item) => {
                          const Icon = item.icon;
                          const isSelected =
                            formData.niveauSymptome === item.level;

                          return (
                            <div
                              key={item.level}
                              className="flex flex-col items-center"
                            >
                              <button
                                type="button"
                                onClick={(e) =>
                                  handleNiveauChange(item.level, e)
                                }
                                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                                  isSelected
                                    ? `${item.bgColor} scale-125 shadow-lg ring-4 ring-blue-300`
                                    : `bg-white ${item.hoverBg} hover:scale-110 shadow-md`
                                } border-2 ${
                                  isSelected
                                    ? "border-blue-400"
                                    : "border-gray-200"
                                }`}
                              >
                                <Icon
                                  size={24} // taille de l’icône pour petits écrans
                                  className={`${
                                    isSelected ? "text-white" : item.color
                                  } sm:size-28 md:size-32`}
                                />
                              </button>

                              <div className="mt-3 text-center">
                                <div
                                  className={`text-xs font-bold uppercase tracking-wide ${
                                    isSelected ? item.color : "text-gray-400"
                                  }`}
                                >
                                  {item.label}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Badge de niveau sélectionné */}
                    <div className="text-center mt-6">
                      <Badge
                        className={`text-xl min-w-100 px-8 py-4 ${
                          formData.niveauSymptome === 0
                            ? "bg-gradient-to-r from-blue-400 to-purple-300"
                            : formData.niveauSymptome === 1
                            ? "bg-gradient-to-r from-blue-400 to-purple-400"
                            : formData.niveauSymptome === 2
                            ? "bg-gradient-to-r from-blue-400 to-purple-500"
                            : formData.niveauSymptome === 3
                            ? "bg-gradient-to-r from-blue-400 to-purple-700"
                            : "bg-gradient-to-r from-blue-400 to-purple-800"
                        } text-white shadow-xl `}
                      >
                        Intensité :&nbsp;
                        {formData.niveauSymptome === 0
                          ? "Aucune"
                          : formData.niveauSymptome === 1
                          ? "Légère"
                          : formData.niveauSymptome === 2
                          ? "Modérée"
                          : formData.niveauSymptome === 3
                          ? "Forte"
                          : "Insupportable"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="description"
                    className="text-slate-700 font-semibold text-lg mb-4 block"
                  >
                    Observations cliniques complémentaires
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez précisément les symptômes, leur évolution, les facteurs déclenchants, la durée, l'intensité..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="modern-textarea"
                  />
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <button
                type="button"
                onClick={handleGoBack}
                className="modern-button-outline flex-1 flex items-center justify-center gap-3"
              >
                <ArrowLeft className="h-5 w-5" />
                Retour
              </button>
              <button
                type="submit"
                className="modern-button flex-1 flex items-center justify-center gap-3"
              >
                <Stethoscope className="h-5 w-5" />
                Confirmer la consultation
              </button>
            </div>
          </form>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[8px] flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-11/12 text-center transform transition-all scale-105">
            <h2 className="text-blue-600 font-bold text-xl mb-3">
              ⚠️ Attention
            </h2>
            <p className="text-gray-700 text-lg mb-6">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
