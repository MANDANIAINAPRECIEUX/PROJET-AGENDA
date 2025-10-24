import {useEffect, useState, useTransition} from 'react'

export const getPatientDataFromStorage = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedData = JSON.parse(userData);
        console.log("Données patient récupérées:", parsedData);

        // Si les données contiennent déjà nom et prénom, les utiliser
        if (parsedData.nom && parsedData.prenom) {
          return parsedData;
        } else {
          if (parsedData.email) {
            return parsedData;
          }
        }

        // Sinon, essayer de récupérer les données complètes depuis l'API
        // Cette logique sera implémentée plus tard si nécessaire
        return parsedData;
      }
      return null;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données patient:",
        error
      );
      return null;
    }
  };

export const useReservation = () => {
    const [isLoading, startTransition] = useTransition()
    const [patientData, setPatientData] = useState(null)
    useEffect(() => {
      
        const localPatient = getPatientDataFromStorage();
        if (!localPatient?.email) return;
    
        const email = localPatient.email;
        const token = localStorage.getItem("userToken");
        if (!token) return;
    
        // recuperation anl nom s prenom
        const fetchPatientByEmail = async () => {
          try {
            const response = await fetch(
              `/api/auth/users/email/${encodeURIComponent(email)}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("situation anle valin fetch: ", response);
            if (response.ok) {
              const data = await response.json();
              console.log("contenu anle data :", data);
              setPatientData(data);
            } else {
              console.warn("Impossible de récupérer le patient depuis l'API");
            }
          } catch (error) {
            console.error("Erreur récupération patient:", error);
          } 
        };
    
        startTransition(() => {
            fetchPatientByEmail();
        })
    }, []);

    return {isLoading, patientData}



}