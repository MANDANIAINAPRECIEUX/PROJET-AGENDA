"use client";

import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function ChoixDeRdv() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointments, setAppointments] = useState([]);

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
    const startingDayOfWeek = firstDay.getDay();

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

  const isTimeSlotAvailable = (date, hour, minute) => {
    const dateString = date.toISOString().split("T")[0];
    const timeString = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    return !appointments.some(
      (apt) => apt.date === dateString && apt.time === timeString
    );
  };

  // Gérer la sélection de date
  const handleDateClick = (date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  // Gérer la sélection d'heure
  const handleTimeClick = (hour, minute) => {
    if (selectedDate && isTimeSlotAvailable(selectedDate, hour, minute)) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      setSelectedTime(timeString);

      // Navigation automatique vers le formulaire
      const appointmentData = {
        date: selectedDate.toISOString().split("T")[0],
        time: timeString,
        dateFormatted: selectedDate.toLocaleDateString("fr-FR"),
      };
      localStorage.setItem("appointmentData", JSON.stringify(appointmentData));
      navigate("/FormulaireDeReservation");
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

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Cabinet Dentaire Dr. Martin
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Prenez rendez-vous facilement en ligne. Sélectionnez une date
            disponible dans notre calendrier, puis choisissez l'heure qui vous
            convient le mieux.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendrier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendrier des disponibilités
              </CardTitle>
              <CardDescription>
                Cliquez sur une date disponible pour voir les créneaux horaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Navigation du mois */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - 1
                      )
                    )
                  }
                >
                  ←
                </Button>
                <h3 className="text-lg font-semibold">
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </h3>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1
                      )
                    )
                  }
                >
                  →
                </Button>
              </div>

              {/* Grille du calendrier */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 p-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((date, index) => (
                  <div key={index} className="aspect-square">
                    {date ? (
                      <Button
                        variant={
                          selectedDate?.toDateString() === date.toDateString()
                            ? "default"
                            : "ghost"
                        }
                        className={`w-full h-full text-sm ${
                          isDateAvailable(date)
                            ? "hover:bg-blue-100 border-2 border-transparent hover:border-blue-300"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100"
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
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border-2 border-blue-300 rounded" />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded" />
                  <span>Non disponible</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Créneaux horaires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Créneaux horaires
              </CardTitle>
              <CardDescription>
                {selectedDate
                  ? `Créneaux disponibles le ${selectedDate.toLocaleDateString(
                      "fr-FR"
                    )}`
                  : "Sélectionnez une date pour voir les créneaux disponibles"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-4">
                  {/* Matin */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Matin (8h - 12h)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
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
                              variant={
                                isSelected
                                  ? "default"
                                  : isAvailable
                                  ? "outline"
                                  : "secondary"
                              }
                              className={`${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : isAvailable
                                  ? "hover:bg-blue-50 border-blue-200"
                                  : "bg-red-100 text-red-600 cursor-not-allowed"
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
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Après-midi (14h - 17h)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {workingHours
                        .filter((slot) => slot.hour >= 14)
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
                              variant={
                                isSelected
                                  ? "default"
                                  : isAvailable
                                  ? "outline"
                                  : "secondary"
                              }
                              className={`${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : isAvailable
                                  ? "hover:bg-blue-50 border-blue-200"
                                  : "bg-red-100 text-red-600 cursor-not-allowed"
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
                <div className="text-center text-gray-500 py-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Veuillez d'abord sélectionner une date dans le calendrier
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
