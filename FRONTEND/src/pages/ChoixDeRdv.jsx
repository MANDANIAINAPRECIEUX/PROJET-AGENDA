"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { setDates } from "../features/DateRendezVousSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function ChoixDeRdv() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointments, setAppointments] = useState([]); // Données fictives, à remplacer par une API
  const [heuresBloquees, setHeuresBloquees] = useState([]);
  // Heures de travail du cabinet (créneaux d'1 heure)
  const workingHours = [
    // Matin: 8h-12h
    { hour: 8, minute: 0, available: true },
    { hour: 9, minute: 0, available: true },
    { hour: 10, minute: 0, available: true },
    { hour: 11, minute: 0, available: true },
    // Après-midi: 14h-17h
    { hour: 14, minute: 0, available: true },
    { hour: 15, minute: 0, available: true },
    { hour: 16, minute: 0, available: true },
  ];

  // Jours fériés (exemple)
  const holidays = [
    "2024-01-01",
    "2024-05-01",
    "2024-07-14",
    "2024-08-15",
    "2024-11-01",
    "2024-11-11",
    "2024-12-25",
  ];

  // Fonction pour obtenir les jours du mois
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek =
      firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Ajustement pour commencer la semaine par lundi

    const days = [];

    // Jours vides au début
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };
  const [rendezVousList, setRendezVousList] = useState([]);
  //appel API pour recuperer les données du backend
  useEffect(() => {
    const fetchRendezVous = async () => {
      try {
        const token = localStorage.getItem("userToken"); // récupère le token s'il existe
        const res = await axios.get("/api/rendezvous", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setRendezVousList(res.data);
        console.log("📅 Rendez-vous récupérés :", res.data);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des rendez-vous :", error);
      }
    };

    fetchRendezVous();
  }, []);

  // Vérifie si un créneau est disponible pour une date donnée
  const isTimeSlotAvailable2 = (hour, dateHeure) => {
    if (!rendezVousList || !dateHeure) return true;

    // Formate la date au même format que dans la base ("DD/MM/YYYY")
    const selectedDateFormatted = dateHeure
      .toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replaceAll("-", "/");

    // Filtre les rendez-vous du même jour
    const rendezVousDuJour = rendezVousList.filter(
      (rdv) => rdv.dateHeure === selectedDateFormatted
    );

    // Extrait les heures déjà prises pour ce jour
    const heuresPrises = rendezVousDuJour.map((rdv) =>
      parseInt(rdv.dureeMinutes.replace(":00", ""), 10)
    );

    // Vérifie si l'heure actuelle est déjà prise pour cette date
    const estPris = heuresPrises.includes(hour);

    return !estPris; // true = disponible, false = pris
  };

  // Vérifier si une date est disponible
  const isDateAvailable = (date) => {
    const dayOfWeek = date.getDay();
    const dateString = date.toISOString().split("T")[0];

    // Dimanche = 0, donc pas disponible
    if (dayOfWeek === 0) return false;

    // Jours fériés
    if (holidays.includes(dateString)) return false;

    // Dates passées
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;

    // Vérifier si tous les créneaux sont pris
    const dayAppointments = appointments.filter(
      (apt) => apt.date === dateString
    );
    return dayAppointments.length < workingHours.length;
  };

  // const isTimeSlotAvailable = (date, hour, minute) => {
  //   const dateString = date.toISOString().split("T")[0];
  //   const timeString = `${hour.toString().padStart(2, "0")}:${minute
  //     .toString()
  //     .padStart(2, "0")}`;

  //   // 🧱 Vérifie si cette heure est dans les heures bloquées du localStorage
  //   if (heuresBloquees.includes(`${dateString}-${timeString}`)) {
  //     return false;
  //   }

  //   return !appointments.some(
  //     (apt) => apt.date === dateString && apt.time === timeString
  //   );
  // };

  const isTimeSlotAvailable = (date, hour, minute) => {
    if (!rendezVousList) return true;

    // Formater la date dans le même format que celui de la BDD ("DD/MM/YYYY")
    const dateString = date
      .toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replaceAll("-", "/");

    const timeString = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    // Vérifie si un rendez-vous existe à cette date et heure
    const estPris = rendezVousList.some(
      (rdv) =>
        rdv.dateHeure === dateString &&
        rdv.dureeMinutes === timeString &&
        rdv.statut !== "cancelled" // on libère les heures annulées
    );

    return !estPris; // true = dispo, false = occupé
  };

  // Gérer la sélection de date
  const handleDateClick = (date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
      console.log("date selectionnée: ", date);
    }
  };

  const [dateFormatted, setdateRDV] = useState("");
  const [time, setheureRDV] = useState("");

  const blocage = () => {
    useEffect(() => {
      // 🔁 Au montage du composant, lire le localStorage une fois
      const stored = localStorage.getItem("heuresBloquees");
      if (stored) {
        setHeuresBloquees(JSON.parse(stored));
      }
    }, []);

    // ✅ Quand tu veux bloquer une nouvelle heure :
    const bloquerHeure = (heureLocal) => {
      const updated = [...heuresBloquees];
      if (!updated.includes(heureLocal)) {
        updated.push(heureLocal);
        setHeuresBloquees(updated);
        localStorage.setItem("heuresBloquees", JSON.stringify(updated));
      }
    };
  };

  // Gérer la sélection d'heure
  // const handleTimeClick = (hour, minute) => {
  //   if (selectedDate && isTimeSlotAvailable(selectedDate, hour, minute)) {
  //     const timeString = `${hour.toString().padStart(2, "0")}:${minute
  //       .toString()
  //       .padStart(2, "0")}`;
  //     setSelectedTime(timeString);
  //     // ty zany le données complet annl rendez vous: heure s dates
  //     const appointmentData = {
  //       date: selectedDate.toISOString().split("T")[0],
  //       time: timeString,
  //       dateFormatted: selectedDate.toLocaleDateString("fr-FR"),
  //     };
  //     dispatch(
  //       setDates({
  //         dateFormatted: appointmentData.dateFormatted,
  //         time: appointmentData.time,
  //       })
  //     );

  //     localStorage.setItem("appointmentData", JSON.stringify(appointmentData));
  //     navigate("/FormulaireDeReservation");
  //     console.log("données anl rdv heure s date: ", appointmentData);
  //   }
  // };

  const handleTimeClick = (hour, minute) => {
    if (selectedDate && isTimeSlotAvailable(selectedDate, hour, minute)) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      setSelectedTime(timeString);

      const dateString = selectedDate.toISOString().split("T")[0];

      // 💾 Enregistrer dans le localStorage (heures bloquées)
      const stored = JSON.parse(localStorage.getItem("heuresBloquees")) || [];
      const key = `${dateString}-${timeString}`;
      if (!stored.includes(key)) {
        stored.push(key);
        localStorage.setItem("heuresBloquees", JSON.stringify(stored));
        setHeuresBloquees([...stored]);
      }

      // 🗓️ Sauvegarde complète pour FormulaireDeReservation
      const appointmentData = {
        date: dateString,
        time: timeString,
        dateFormatted: selectedDate.toLocaleDateString("fr-FR"),
      };
      dispatch(
        setDates({
          dateFormatted: appointmentData.dateFormatted,
          time: appointmentData.time,
        })
      );

      localStorage.setItem("appointmentData", JSON.stringify(appointmentData));
      navigate("/FormulaireDeReservation");

      console.log("🕒 Données du RDV :", appointmentData);
    }
  };

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 flex flex-col items-center justify-center py-20">
      {/* En-tête */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Prenez rendez-vous
        </h1>
        <p className="text-base md:text-lg text-white/90">
          Sélectionnez une date disponible dans notre calendrier, puis
          choisissez l'heure qui vous convient le mieux pour votre consultation.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Calendrier */}
        <Card className="shadow-lg border-2 border-white/20 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-blue-800">
              <Calendar className="h-6 w-6 text-blue-600" />
              Disponibilités
            </CardTitle>
            <CardDescription>
              Cliquez sur une date pour voir les créneaux
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Navigation du mois */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1
                    )
                  )
                }
              >
                <ChevronLeft className="h-5 w-5 text-gray-700 hover:text-blue-600" />
              </Button>
              <h3 className="text-xl font-bold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1
                    )
                  )
                }
              >
                <ChevronRight className="h-5 w-5 text-gray-700 hover:text-blue-600" />
              </Button>
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((day) => (
                //les jours de la semaine
                <div
                  key={day}
                  className="text-center text-sm font-medium text-blue-500 p-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentDate).map((date, index) => (
                <div key={index} className="aspect-square">
                  {date ? (
                    <Button
                      variant={
                        selectedDate?.toDateString() === date.toDateString()
                          ? "default"
                          : "ghost"
                      }
                      className={`w-full h-full text-sm font-semibold rounded-full p-0
                        ${
                          isDateAvailable(date)
                            ? "hover:bg-blue-100 border-2 border-transparent text-gray-800 hover:text-blue-600"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100"
                        }
                        ${
                          selectedDate?.toDateString() ===
                            date.toDateString() &&
                          "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      onClick={() => handleDateClick(date)}
                      disabled={!isDateAvailable(date)}
                    >
                      {date.getDate()}
                    </Button>
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
              ))}
            </div>

            {/* Légende */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 rounded-full border-2 border-blue-300" />
                <span>Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded-full" />
                <span>Indisponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full" />
                <span>Sélectionnée</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Créneaux horaires */}
        <Card className="shadow-lg border-2 border-white/20 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-blue-800">
              <Clock className="h-6 w-6 text-blue-600" />
              Créneaux horaires
            </CardTitle>
            <CardDescription>
              {selectedDate
                ? `Créneaux disponibles le ${selectedDate.toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}`
                : "Sélectionnez une date pour voir les créneaux disponibles"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="grid grid-cols-2 gap-4">
                {/* Matin */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Matin (8h - 12h)
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {workingHours
                      .filter((slot) => slot.hour < 12)
                      .map((slot, index) => {
                        const isAvailable = isTimeSlotAvailable(
                          selectedDate,
                          slot.hour,
                          slot.minute
                        );
                        const timeString = `${slot.hour
                          .toString()
                          .padStart(2, "0")}:${slot.minute
                          .toString()
                          .padStart(2, "0")}`;
                        const isSelected = selectedTime === timeString;

                        return (
                          <Button
                            key={index}
                            variant={isAvailable ? "outline" : "secondary"}
                            className={`rounded-full
                              ${
                                isSelected
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : isAvailable
                                  ? "border-blue-200 text-blue-600 hover:bg-blue-100"
                                  : "bg-red-100 text-red-600 cursor-not-allowed hover:bg-red-100"
                              }`}
                            onClick={() =>
                              handleTimeClick(slot.hour, slot.minute)
                            }
                            disabled={!isAvailable}
                          >
                            {timeString}
                          </Button>
                        );
                      })}
                  </div>
                </div>

                {/* Après-midi */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Après-midi (14h - 17h)
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {workingHours
                      .filter((slot) => slot.hour >= 14)
                      .map((slot, index) => {
                        const isAvailable = isTimeSlotAvailable2(
                          slot.hour,
                          selectedDate
                        );

                        const timeString = `${slot.hour
                          .toString()
                          .padStart(2, "0")}:${slot.minute
                          .toString()
                          .padStart(2, "0")}`;
                        const isSelected = selectedTime === timeString;

                        return (
                          <Button
                            key={index}
                            variant={isAvailable ? "outline" : "secondary"}
                            className={`rounded-full
                              ${
                                isSelected
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : isAvailable
                                  ? "border-blue-200 text-blue-600 hover:bg-blue-100"
                                  : "bg-red-100 text-red-600 cursor-not-allowed hover:bg-red-100"
                              }`}
                            onClick={() =>
                              handleTimeClick(slot.hour, slot.minute)
                            }
                            disabled={!isAvailable}
                          >
                            {timeString}
                          </Button>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-lg p-6">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-base font-medium">
                  Sélectionnez une date pour voir les créneaux
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
