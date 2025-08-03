// FRONTEND/src/lib/hooks/usePatientData.js
import { useState, useEffect } from 'react';
import { patientService } from '../api';

/**
 * Hook personnalisé pour récupérer et gérer les données patient
 * Combine les données du localStorage et de l'API pour avoir les informations complètes
 */
export const usePatientData = () => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les données utilisateur depuis localStorage
  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération des données du localStorage:", error);
      return null;
    }
  };

  // Fonction pour récupérer les données complètes du patient
  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupérer les données de base depuis localStorage
      const userData = getUserFromStorage();
      
      if (!userData || !userData.email) {
        throw new Error("Aucune donnée utilisateur trouvée dans localStorage");
      }

      // Essayer de récupérer les données complètes depuis l'API
      try {
        const apiPatientData = await patientService.getPatientByEmail(userData.email);
        
        if (apiPatientData) {
          // Combiner les données API avec les données localStorage
          const completePatientData = {
            ...userData, // Données de base (ID utilisateur, token, etc.)
            ...apiPatientData, // Données complètes du patient (nom, prénom, etc.)
            userId: userData._id, // Conserver l'ID utilisateur séparément
          };
          
          console.log("Données patient complètes récupérées:", completePatientData);
          setPatientData(completePatientData);
        } else {
          // Si pas de données API, utiliser localStorage comme fallback
          console.log("Aucune donnée patient trouvée dans l'API, utilisation du localStorage");
          setPatientData(userData);
        }
      } catch (apiError) {
        console.warn("Erreur API, utilisation des données localStorage:", apiError.message);
        // En cas d'erreur API, utiliser les données localStorage
        setPatientData(userData);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données patient:", error);
      setError(error.message);
      setPatientData(null);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchPatientData();
  }, []);

  // Fonction pour rafraîchir les données
  const refreshPatientData = () => {
    fetchPatientData();
  };

  // Fonction utilitaire pour générer un ID patient
  const generatePatientId = (patientData) => {
    if (!patientData) return "";

    // Utiliser l'ID du patient s'il existe
    if (patientData._id) return patientData._id;
    if (patientData.id) return patientData.id;

    // Générer un ID basé sur le nom et prénom
    if (patientData.nom && patientData.prenom) {
      return `ID-${patientData.nom.toUpperCase()}-${patientData.prenom.toUpperCase()}`;
    }

    // ID par défaut
    return `ID-PATIENT-${Date.now()}`;
  };

  // Fonction utilitaire pour obtenir le nom complet
  const getFullName = (patientData) => {
    if (!patientData) return "Non renseigné";
    
    if (patientData.nom && patientData.prenom) {
      return `${patientData.prenom} ${patientData.nom}`;
    }
    
    return "Non renseigné";
  };

  return {
    patientData,
    loading,
    error,
    refreshPatientData,
    generatePatientId,
    getFullName,
    // Propriétés utilitaires dérivées
    patientId: generatePatientId(patientData),
    fullName: getFullName(patientData),
    hasCompleteData: patientData && patientData.nom && patientData.prenom,
  };
};