// TableauDeBordDentiste.jsx
// Tableau de bord moderne pour un cabinet dentaire
// Style : dégradés bleus-violets-roses + effet verre dépoli + ombres douces

import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function TableauDeBordDentiste({ initialData }) {
  // --- 1️⃣ Données de démonstration ---
  // Si le composant ne reçoit pas de données en props, on génère des données fictives
  const [selectedDate, setSelectedDate] = useState(new Date()); // date sélectionnée
  const demoData = initialData || generateDemoData();
  const DonnéesAAffiches = useSelector((state) => state.RDV);
  const appointmentData =
    JSON.parse(localStorage.getItem("appointmentData")) || {};
  const patientData = JSON.parse(localStorage.getItem("trucPatient")) || {};

  const [dentsList, setDentsList] = useState([]);

  const DonneeTotal = {
    ...appointmentData,
    ...patientData,
  };
  console.log("données à afficher: ", DonneeTotal);

  // donnees du bdd
  const [ListeDonneeBdd, setlisteDonneeBdd] = useState([]);
  //contenu bdd rendez vous
  useEffect(() => {
    const FetchDonneeBdd = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get("/api/rendezvous", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setlisteDonneeBdd(res.data);
        console.log("📅 Rendez-vous récupérés :", res.data);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des rendez-vous :", error);
      }
    };
    FetchDonneeBdd();
  }, []);

  // mise à jour status???

  const updateStatut = async (rdvId, newStatus, patientEmail) => {
    try {
      const token = localStorage.getItem("userToken");

      // 🔹 Étape 1 : mise à jour du statut dans la BDD
      await axios.put(
        `/api/rendezvous/${rdvId}`,
        { statut: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 🔁 Recharger la liste à jour
      const res = await axios.get("/api/rendezvous", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setlisteDonneeBdd(res.data);

      console.log(`✅ Statut mis à jour pour ${rdvId} → ${newStatus}`);

      // 🔹 Étape 2 : si le statut devient "Validé", envoi d’un mail au patient
      if (newStatus === "Validé" && patientEmail) {
        await axios.post(
          "/api/email/confirmation",
          {
            email: patientEmail,
            sujet: "Confirmation de votre rendez-vous",
            message: `Bonjour, votre rendez-vous a été validé par votre dentiste. Merci et à bientôt.`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("📩 Email envoyé à :", patientEmail);
      }

      // =====================================================
      // ✉️ ÉTAPE 3 : Email si le statut devient "Annulé"
      // =====================================================
      if (newStatus === "Annulé" && patientEmail) {
        await axios.post(
          "/api/email/confirmation",
          {
            email: patientEmail,
            sujet: "Annulation de votre rendez-vous",
            message: `Bonjour, votre rendez-vous a été annulé par le cabinet. Veuillez nous contacter pour un nouveau créneau. Merci.`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("📩 Email envoyé (ANNULÉ) à :", patientEmail);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du statut :", error);
    }
  };

  //merde  dents

  useEffect(() => {
    const listerToutesLesDents = async () => {
      const token = localStorage.getItem("userToken");

      try {
        const response = await axios.get("/api/dents", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setDentsList(response.data);
        console.log("🦷 Toutes les dents :", response.data);
        console.log(
          "%c✅ Dents listées avec succès !",
          "color: green; background: #eaffea; font-weight: bold;"
        );
      } catch (error) {
        console.error(
          "%c❌ Erreur lors du chargement des dents :",
          "color: red; font-weight: bold;",
          error
        );
      }
    };

    // Appel de la fonction
    listerToutesLesDents();
  }, []);

  // ✅ 1️⃣ Filtrer les rendez-vous du jour
  const appointmentsToday = useMemo(() => {
    if (!ListeDonneeBdd.length) return [];
    const todayStr = selectedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return ListeDonneeBdd.filter((rdv) => rdv.dateHeure === todayStr);
  }, [ListeDonneeBdd, selectedDate]);

  // ✅ 2️⃣ Fusionner rendez-vous + dents par patient
  const mergedAppointments = useMemo(() => {
    if (!appointmentsToday.length || !dentsList.length) return [];

    console.log(
      "🔍 Vérification IDs :",
      appointmentsToday.map((r) => ({
        rdvPatient: r.patient?._id || r.patient,
      })),
      dentsList.map((d) => ({
        dentPatient: d.patient,
      }))
    );

    const result = appointmentsToday.map((rdv) => {
      const rdvPatientId =
        typeof rdv.patient === "object" ? rdv.patient?._id : rdv.patient;

      const dent = dentsList.find(
        (d) => d.patient?.toString() === rdvPatientId?.toString()
      );

      return {
        ...rdv,
        typeDent: dent?.typeDent || "—",
        numeroDent: dent?.numero || "—",
      };
    });

    console.log("🧩 Résultat fusion :", result);
    return result;
  }, [appointmentsToday, dentsList]);

  const [view, setView] = useState("day"); // mode de vue : 'day' ou 'week'

  // --- 3️⃣ Calculs liés aux dates ---
  const weekStart = useMemo(() => startOfWeek(selectedDate), [selectedDate]); // début de la semaine courante
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]); // liste des 7 jours de la semaine

  // --- 4️⃣ Filtrage des rendez-vous ---
  const appointmentsThisWeek = demoData.filter((r) =>
    isSameWeek(new Date(r.date), weekStart)
  );

  // --- 5️⃣ Statistiques globales ---
  // Calcule le nombre de patients traités, en attente, et le total hebdomadaire
  const stats = useMemo(() => {
    const treatedToday = appointmentsToday.filter(
      (r) => r.statut === "Validé"
    ).length;
    const waitingToday = appointmentsToday.filter(
      (r) => r.statut === "Annulé"
    ).length;
    const weekTotal = appointmentsThisWeek.length;
    return { treatedToday, waitingToday, weekTotal };
  }, [appointmentsToday, appointmentsThisWeek]);

  //verification

  useEffect(() => {
    console.log("🦷 Vérification — DentsList :", dentsList);
    console.log("📅 Vérification — ListeDonneeBdd :", ListeDonneeBdd);
  }, [dentsList, ListeDonneeBdd]);
  // --- 6️⃣ Données pour le graphique hebdomadaire ---

  const chartData = weekDays.map((d) => ({
    day: formatShortDay(d),

    treated: ListeDonneeBdd.filter((r) => {
      // convertir dd/mm/yyyy → Date JS
      const [dayStr, monthStr, yearStr] = r.dateHeure.split("/");
      const dateObj = new Date(`${yearStr}-${monthStr}-${dayStr}`);

      return isSameDay(dateObj, d) && r.statut === "Validé";
    }).length,
  }));

  const LeDentiste = ListeDonneeBdd[0]?.dentiste;

  // --- 7️⃣ Navigation entre semaines ---
  const prevWeek = () => setSelectedDate(addDays(weekStart, -7));
  const nextWeek = () => setSelectedDate(addDays(weekStart, 7));
  const gotoToday = () => setSelectedDate(new Date());

  // --- 8️⃣ Interface utilisateur ---

  // const mergedAppointments = useMemo(() => {
  //   if (!appointmentsToday.length || !dentsList.length) return [];

  //   return appointmentsToday.map((rdv) => {
  //     const rdvPatientId =
  //       typeof rdv.patient === "object" ? rdv.patient?._id : rdv.patient;

  //     // 🔎 Toutes les dents pour ce patient ET créées le même jour
  //     const dentsAssociees = dentsList.filter((d) => {
  //       const dentCreated = new Date(d.createdAt).toLocaleDateString("fr-FR");
  //       return (
  //         d.patient?.toString() === rdvPatientId?.toString() &&
  //         dentCreated === rdv.dateHeure
  //       );
  //     });

  //     // 🔎 1 dent principale (si tu veux afficher juste une)
  //     const dent = dentsAssociees[0] || null;

  //     return {
  //       ...rdv,

  //       // 🦷 Liste complète des dents pour ce RDV
  //       dentsAssociees,

  //       // 🦷 Dent principale (optionnel)
  //       typeDent: dent?.typeDent || "—",
  //       numeroDent: dent?.numero || "—",
  //     };
  //   });
  // }, [appointmentsToday, dentsList]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 flex flex-col items-center py-6 px-4">
      {/* --- HEADER --- */}
      <header
        className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center 
                     bg-white/10 backdrop-blur-xl border border-white/20 
                     rounded-2xl px-6 py-5 shadow-[0_8px_30px_rgb(255,255,255,0.25)] mb-10"
      >
        {/* TITRE À GAUCHE */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-white drop-shadow">
            gestion des rendez - vous
          </h1>
          <p className="text-sm text-white/80 mt-1">
            {view === "day" ? "Vue journalière" : "Vue hebdomadaire"} •{" "}
            {formatDate(selectedDate)}
          </p>
        </div>

        {/* BOUTONS À DROITE */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button
            onClick={gotoToday}
            className="px-5 py-2 rounded-xl bg-white/80 text-blue-700 
                   backdrop-blur-md shadow hover:bg-white transition"
          >
            Aujourd’hui
          </button>
          {/* Bouton Retour */}
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2 rounded-xl bg-white/60 text-purple-700 
               backdrop-blur-md shadow hover:bg-white/90 transition"
          >
            Retour
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLONNE GAUCHE --- */}
        <section className="space-y-6">
          {/* STATISTIQUES RAPIDES */}
          <div
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 
                      rounded-2xl shadow-[0_8px_30px_rgb(255,255,255,0.25)]"
          >
            <h3 className="text-sm font-semibold text-white/90 mb-4">
              Statistiques rapides
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <StatCard
                title="Patients"
                value={appointmentsToday.length}
                color="blue"
              />
              <StatCard
                title="Validés"
                value={stats.treatedToday}
                color="purple"
              />
              <StatCard
                title="Annulés"
                value={stats.waitingToday}
                color="pink"
              />
            </div>
          </div>

          {/* SEMAINE + GRAPHIQUE */}
          <div
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 
                      rounded-2xl shadow-[0_8px_30px_rgb(255,255,255,0.25)]"
          >
            {/* Titres + navigation */}
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-white">Semaine en cours</h4>
              <div className="flex gap-2">
                <button
                  onClick={prevWeek}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <ChevronLeft className="text-white" />
                </button>
                <button
                  onClick={nextWeek}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <ChevronRight className="text-white" />
                </button>
              </div>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(d)}
                  className={`rounded-xl p-2.5 text-xs font-medium 
                shadow-sm transition backdrop-blur 
                ${
                  isSameDay(d, selectedDate)
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-white/30 text-white hover:bg-white/40"
                }`}
                >
                  <div>{formatShortDay(d)}</div>
                  <div className="text-[10px]">{formatDayNumber(d)}</div>
                </button>
              ))}
            </div>

            {/* Graphique */}
            <div className="mt-5">
              <h5 className="text-sm text-white/90 mb-2">
                Activité hebdomadaire
              </h5>
              <div className="w-full h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      stroke="#fff"
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "blue",
                        borderRadius: 8,
                      }}
                      labelStyle={{ color: "#fff" }}
                      itemStyle={{ color: "#ffffff" }}
                    />
                    <Bar
                      dataKey="treated"
                      fill="#ffffff"
                      opacity={0.9}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              ;
            </div>
          </div>
        </section>

        {/* --- COLONNE DROITE --- */}
        <section className="lg:col-span-2">
          <div
            className="bg-white/10 backdrop-blur-xl border border-white/40 p-6 
                      rounded-2xl shadow-[0_8px_30px_rgb(255,255,255,0.5)]"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-white">
                Rendez-vous du {formatDate(selectedDate)}
              </h3>
            </div>

            {mergedAppointments.length === 0 ? (
              <p className="text-center text-white/80 italic py-6">
                Aucun rendez-vous prévu pour aujourd’hui.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-white/90">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="p-3">Heure</th>
                      <th className="p-3">Patient</th>
                      <th className="p-3">Dent</th>
                      <th className="p-3">Statut</th>
                    </tr>
                  </thead>

                  <tbody>
                    {mergedAppointments.map((r) => (
                      <tr key={r._id} className="hover:bg-white/10 transition">
                        {/* Heure */}
                        <td className="p-3">{r.dureeMinutes || "—"}</td>

                        {/* Patient */}
                        <td className="p-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          {r.patient
                            ? `${r.patient.nom} ${r.patient.prenom}`
                            : "Inconnu"}
                        </td>

                        {/* Dent */}
                        <td className="p-3">
                          {r.typeDent && r.numeroDent
                            ? `${r.typeDent} ${r.numeroDent}`
                            : "—"}
                        </td>

                        {/* Statut */}
                        <td className="p-3">
                          <StatusBadge
                            status={r.statut}
                            onChange={(newStatus) =>
                              updateStatut(r._id, newStatus, r.patient?.email)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// --- Sous-composant pour afficher une statistique (Patients, Traités, etc.) ---
const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "from-blue-100 to-blue-50 text-blue-700",
    purple: "from-purple-100 to-purple-50 text-purple-700",
    pink: "from-pink-100 to-pink-50 text-pink-700",
  };
  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${colors[color]} shadow p-3 text-center backdrop-blur-md`}
    >
      <div className="text-xs font-medium">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
};

// --- Badge coloré pour indiquer le statut du rendez-vous ---
const StatusBadge = ({ status, onChange }) => {
  const styles = {
    Validé: "bg-blue-500/90 text-white",
    "En attente": "bg-gray-500/80 text-white",
    Annulé: "bg-purple-500/90 text-white",
  };

  return (
    <select
      value={status || "En attente"} // valeur par défaut
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`px-2 py-1  text-l font-medium border-none cursor-pointer focus:ring-2 focus:ring-blue-400 transition 
        ${styles[status] || "bg-slate-100 text-slate-600"}`}
    >
      <option value="En attente"> En attente</option>
      <option value="Validé"> Validé</option>
      <option value="Annulé"> Annulé</option>
    </select>
  );
};

// --- Fonctions utilitaires pour la gestion des dates ---
// Elles servent à calculer les jours de la semaine, comparer les dates, etc.
function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}
function getWeekDays(start) {
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isSameWeek(a, start) {
  const end = addDays(start, 7);
  return a >= start && a < end;
}
function formatDate(d) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
function formatShortDay(d) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}
function formatDayNumber(d) {
  return d.getDate();
}
function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// --- Génération de données fictives (pour démo locale) ---
function generateDemoData() {
  const base = new Date();
  const start = startOfWeek(base);
  const items = [];
  const reasons = [
    "Consultation",
    "Détartrage",
    "Soins",
    "Extraction",
    "Contrôle",
  ];
  for (let i = 0; i < 20; i++) {
    const day = addDays(start, Math.floor(i / 3));
    const hour = 9 + (i % 6);
    const date = new Date(day);
    date.setHours(hour, 0, 0, 0);
    items.push({
      id: i,
      patient: `Patient ${i + 1}`,
      date: date.toISOString(),
      reason: reasons[i % reasons.length],
      status: i % 3 === 0 ? "done" : i % 3 === 1 ? "pending" : "cancelled",
    });
  }
  return items;
}
