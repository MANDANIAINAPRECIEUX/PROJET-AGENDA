"use client";

import { useState, useEffect } from "react";

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
import douleurdentaire from "../assets/images/douleurdentaire.JPG";
import sensibilité from "../assets/images/sensibilité.JPG";
import mobilité from "../assets/images/mobilité.JPG";
import gonflement from "../assets/images/gonflement.png";
import a from "../assets/images/a.jpg";
import carie from "../assets/images/carie.JPG";
import fracture from "../assets/images/fracture.JPG";
import { DiagrammeDentaire } from "../components/DiagrammeDentaire";
import { emojiOptions } from "./EmojiOption";
import { allTeethData } from "./AllTeethData";
import axios from "axios";

import { useContext } from "react";
import { ColorContext } from "../context/color-context";
import { useReservation } from "../hooks/useReservation";
import { getPatientDataFromStorage } from "../hooks/useReservation";

const modernStyles = `
  .ultra-modern-bg {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%);
    min-height: 100vh;
  }
  
  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04);
    border-radius: 24px;
  }
  
  .glass-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(30px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    border-radius: 20px;
  }
  
  .section-divider {
    background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%);
    height: 1px;
    margin: 2rem 0;
  }
  
  .modern-input {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(59, 130, 246, 0.1);
    border-radius: 16px;
    padding: 16px 20px;
    font-size: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }
  
  .modern-input:focus {
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    background: rgba(255, 255, 255, 1);
  }
  
  .modern-textarea {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(59, 130, 246, 0.1);
    border-radius: 16px;
    padding: 16px 20px;
    font-size: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    resize: none;
  }
  
  .modern-textarea:focus {
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    background: rgba(255, 255, 255, 1);
  }
  
  .modern-slider::-webkit-slider-thumb {
    appearance: none;
    height: 28px;
    width: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    cursor: pointer;
    border: 4px solid white;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
    transition: all 0.3s ease;
  }
  
  .modern-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 24px rgba(59, 130, 246, 0.6);
  }
  
  .modern-slider::-moz-range-thumb {
    height: 28px;
    width: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    cursor: pointer;
    border: 4px solid white;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  }
  
  .symptom-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(15px);
    border: 2px solid rgba(59, 130, 246, 0.1);
    border-radius: 20px;
    padding: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }
  
  .symptom-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.3);
  }
  
  .symptom-card.selected {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.2) 100%);
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.25);
  }
  
  .tooth {
    cursor: pointer;
    transition: none;
    filter: drop-shadow(0 2px 8px rgba(30, 64, 175, 0.15));
    transform-origin: center;
  }
  
  .tooth:hover {
    filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3));
  }
  
  .tooth.selected {
    filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 25px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 35px rgba(59, 130, 246, 0.4));
  }
  
  .tooth-number {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 10px;
    fill: #1e293b;
    text-anchor: middle;
    dominant-baseline: central;
    pointer-events: none;
    transition: none;
  }
  
  .tooth.selected .tooth-number {
    fill: white;
    font-size: 11px;
    font-weight: 800;
  }
  
  .quadrant-label {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 12px;
    fill: #4338ca;
    text-anchor: middle;
  }
  
  .diagram-container {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(59, 130, 246, 0.1);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  }
  
  .modern-button {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border: none;
    border-radius: 16px;
    padding: 16px 32px;
    color: white;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  }
  
  .modern-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
  }
  
  .modern-button-outline {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(59, 130, 246, 0.2);
    border-radius: 16px;
    padding: 16px 32px;
    color: #3b82f6;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }
  
  .modern-button-outline:hover {
    background: rgba(59, 130, 246, 0.05);
    border-color: rgba(59, 130, 246, 0.4);
    transform: translateY(-2px);
  }
  
  .floating-header {
    position: sticky;
    top: 20px;
    z-index: 50;
  }
  
  .section-title {
    background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }
  
  .subsection-title {
    background: linear-gradient(135deg, #475569 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
`;
 const typesSymptomes = [
    {
      name: "Douleur",
      icon: <img src={douleurdentaire} alt="Douleur" className="w-8 h-8" />,
    },
    {
      name: "Sensibilité",
      icon: <img src={sensibilité} alt="Sensibilité" className="w-8 h-8" />,
    },
    {
      name: "Mobilité",
      icon: <img src={mobilité} alt="Mobilité" className="w-8 h-8" />,
    },
    {
      name: "Gonflement",
      icon: <img src={gonflement} alt="Mobilité" className="w-8 h-8" />,
    },
    {
      name: "Saignement",
      icon: <img src={a} alt="Mobilité" className="w-8 h-8" />,
    },
    {
      name: "Carie",
      icon: <img src={carie} alt="Mobilité" className="w-8 h-8" />,
    },
    {
      name: "Fracture",
      icon: <img src={fracture} alt="fracture" className="w-8 h-8" />,
    },
    { name: "Autre", icon: "💙" },
  ];
// Composant du diagramme dentaire

export default function FormulaireDeReservation() {
  const navigate = useNavigate();
  const {theme, setTheme} = useContext(ColorContext)
  const {isLoading: isLoadingPatientData, patientData} = useReservation()
  
  const [appointmentData, setAppointmentData] = useState(null);
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    // Champs pour la dent
    patient: "",
    nomDent: "",
    typeDent: "",
    secteurDentaire: "",
    numero: "",
    // Champs pour les symptômes
    typesSymptomes: [],
    niveauSymptome: 0, // Mis à 0 par défaut pour correspondre à "AUCUNE"
    description: "",
  });

 

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    console.log("ty le token", token);
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

      console.log("Rendez-vous créé :", rendezVousRes.data);
    } catch (error) {
      console.error("❌ Erreur :", error);
      alert(`Erreur : ${error.message}`);
    }
  };

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
          nomDent: updatedSelectedTeeth.map((t) => t.name).join(", "),
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
      <div className="ultra-modern-bg">
        <div className="max-w-6xl mx-auto p-6 lg:p-12">
          {/* [En-tête et titre] */}

          <form onSubmit={handleSubmit} className="space-y-16">
            {/* Section Identification Patient - AMÉLIORÉE */}
            <div className="glass-panel p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h2 className="subsection-title">Identification Patient</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="patient"
                    className="text-slate-700 font-semibold text-lg mb-3 block"
                  >
                    Identifiant Patient *
                  </Label>
                  <Input
                    id="patient"
                    placeholder="ID-XXXX-XXXX"
                    value={idPatient}
                    onChange={handleInputChange}
                    className="modern-input"
                    readOnly={!!patientData} // Lecture seule si les données patient sont disponibles
                    required
                  />
                </div>

                {/* Affichage du nom complet du patient */}
                {patientData && (patientData.nom || patientData.prenom) && (
                  <div>
                    <Label className="text-slate-700 font-semibold text-lg mb-3 block">
                      Nom du Patient
                    </Label>
                    <div className="modern-input bg-gray-50 flex items-center">
                      <User className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-slate-800 font-medium">
                        {patientData.prenom || ""} {patientData.nom || ""}
                      </span>
                    </div>
                  </div>
                )}
                {/* Indicateur de chargement */}
                {isLoadingPatientData && (
                  <div>
                    <Label className="text-slate-700 font-semibold text-lg mb-3 block">
                      Nom du Patient
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
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-blue-800 font-semibold mb-2">
                          Informations Patient
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {patientData.email && (
                            <div>
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
                            <div>
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
                            <div>
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
            <div className="glass-panel p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h2 className="subsection-title">Sélection Dentaire</h2>
              </div>

              <DiagrammeDentaire
                selectedTeeth={selectedTeeth}
                onToothSelect={handleToothSelect}
              />
            </div>

            <div className="section-divider"></div>

            {/* Section Symptomatologie */}
            <div className="glass-panel p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <h2 className="subsection-title">Symptomatologie Clinique</h2>
              </div>

              <div className="space-y-12">
                {/* Types de symptômes */}
                <div>
                  <Label className="text-slate-700 font-semibold text-lg mb-6 block">
                    Manifestations cliniques * (sélection multiple)
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
                    Intensité symptomatique *
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
                                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform ${
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
                                  size={32}
                                  className={
                                    isSelected ? "text-white" : item.color
                                  }
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
                        className={`text-xl px-8 py-4 ${
                          formData.niveauSymptome === 0
                            ? "bg-gradient-to-r from-blue-100 to-blue-300"
                            : formData.niveauSymptome === 1
                            ? "bg-gradient-to-r from-blue-200 to-blue-400"
                            : formData.niveauSymptome === 2
                            ? "bg-gradient-to-r from-blue-300 to-blue-500"
                            : formData.niveauSymptome === 3
                            ? "bg-gradient-to-r from-blue-400 to-blue-600"
                            : "bg-gradient-to-r from-blue-500 to-blue-700"
                        } text-white shadow-xl rounded-full`}
                      >
                        Intensité:&nbsp;
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
    </>
  );
}
