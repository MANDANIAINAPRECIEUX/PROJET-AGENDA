// Exemple simple de récupération de l'ID patient et du nom patient
// À utiliser comme référence dans FormulaireDeReservation.jsx

import { useState, useEffect } from "react";

export default function ExempleRecuperationPatient() {
  const [patientInfo, setPatientInfo] = useState({
    id: "",
    nom: "",
    email: "",
    telephone: "",
    age: ""
  });

  useEffect(() => {
    // Méthode 1: Récupération directe depuis localStorage
    const recupererDonneesPatient = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const patient = JSON.parse(userData);
          
          // Extraction des informations
          const patientId = patient.id || patient._id || `ID-${patient.nom}-${patient.prenom}`;
          const nomComplet = `${patient.prenom} ${patient.nom}`;
          
          setPatientInfo({
            id: patientId,
            nom: nomComplet,
            email: patient.email || "",
            telephone: patient.telephone || "",
            age: patient.age || ""
          });
          
          console.log("ID Patient:", patientId);
          console.log("Nom Patient:", nomComplet);
          
          return {
            id: patientId,
            nom: nomComplet,
            email: patient.email,
            telephone: patient.telephone,
            age: patient.age
          };
        }
      } catch (error) {
        console.error("Erreur récupération patient:", error);
      }
      return null;
    };

    recupererDonneesPatient();
  }, []);

  return (
    <div>
      <h2>Informations Patient</h2>
      <p><strong>ID Patient:</strong> {patientInfo.id}</p>
      <p><strong>Nom Patient:</strong> {patientInfo.nom}</p>
      <p><strong>Email:</strong> {patientInfo.email}</p>
      <p><strong>Téléphone:</strong> {patientInfo.telephone}</p>
      <p><strong>Âge:</strong> {patientInfo.age}</p>
    </div>
  );
}

// Fonction utilitaire réutilisable
export const getPatientInfo = () => {
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      const patient = JSON.parse(userData);
      return {
        id: patient.id || patient._id || `ID-${patient.nom}-${patient.prenom}`,
        nom: `${patient.prenom} ${patient.nom}`,
        email: patient.email || "",
        telephone: patient.telephone || "",
        age: patient.age || ""
      };
    }
  } catch (error) {
    console.error("Erreur récupération patient:", error);
  }
  return null;
};