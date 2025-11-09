// TableauDeBordDentiste.jsx
// Tableau de bord moderne pour un cabinet dentaire
// Style : dégradés bleus-violets-roses + effet verre dépoli + ombres douces

import React, { useState, useMemo } from "react";
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

export default function TableauDeBordDentiste({ initialData }) {
  // --- 1️⃣ Données de démonstration ---
  // Si le composant ne reçoit pas de données en props, on génère des données fictives
  const demoData = initialData || generateDemoData();
  const DonnéesAAffiches = useSelector((state) => state.RDV);
  const appointmentData =
    JSON.parse(localStorage.getItem("appointmentData")) || {};
  const patientData = JSON.parse(localStorage.getItem("trucPatient")) || {};

  const DonneeTotal = {
    ...appointmentData,
    ...patientData,
  };
  console.log("données à afficher: ", DonneeTotal);

  // --- 2️⃣ États principaux du composant ---
  const [selectedDate, setSelectedDate] = useState(new Date()); // date sélectionnée
  const [view, setView] = useState("day"); // mode de vue : 'day' ou 'week'

  // --- 3️⃣ Calculs liés aux dates ---
  const weekStart = useMemo(() => startOfWeek(selectedDate), [selectedDate]); // début de la semaine courante
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]); // liste des 7 jours de la semaine

  // --- 4️⃣ Filtrage des rendez-vous ---
  const appointmentsThisWeek = demoData.filter((r) =>
    isSameWeek(new Date(r.date), weekStart)
  );
  const appointmentsToday = demoData.filter((r) =>
    isSameDay(new Date(r.date), selectedDate)
  );

  // --- 5️⃣ Statistiques globales ---
  // Calcule le nombre de patients traités, en attente, et le total hebdomadaire
  const stats = useMemo(() => {
    const treatedToday = appointmentsToday.filter(
      (r) => r.status === "done"
    ).length;
    const waitingToday = appointmentsToday.filter(
      (r) => r.status === "pending"
    ).length;
    const weekTotal = appointmentsThisWeek.length;
    return { treatedToday, waitingToday, weekTotal };
  }, [appointmentsToday, appointmentsThisWeek]);

  // --- 6️⃣ Données pour le graphique hebdomadaire ---
  const chartData = weekDays.map((d) => ({
    day: formatShortDay(d),
    treated: demoData.filter(
      (r) => isSameDay(new Date(r.date), d) && r.status === "done"
    ).length,
  }));

  // --- 7️⃣ Navigation entre semaines ---
  const prevWeek = () => setSelectedDate(addDays(weekStart, -7));
  const nextWeek = () => setSelectedDate(addDays(weekStart, 7));
  const gotoToday = () => setSelectedDate(new Date());

  // --- 8️⃣ Interface utilisateur ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8 font-inter">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-3xl font-extrabold text-blue-800 drop-shadow-sm">
            Tableau de bord — Cabinet dentaire
          </h1>
          <p className="text-sm text-blue-600 mt-1">
            {view === "day" ? "Vue journalière" : "Vue hebdomadaire"} •{" "}
            {formatDate(selectedDate)}
          </p>
        </div>

        {/* Bouton "Aujourd’hui" et profil du dentiste */}
        <div className="flex items-center gap-3">
          <button
            onClick={gotoToday}
            className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur-md shadow hover:bg-white/90 transition text-blue-700"
          >
            Aujourd’hui
          </button>
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md rounded-xl px-3 py-2 shadow">
            <Calendar className="text-blue-600 w-5 h-5" />
            <div>
              <p className="font-medium text-slate-700 text-sm">
                Dr. Andriamatoa
              </p>
              <p className="text-xs text-slate-400">Dentiste</p>
            </div>
          </div>
        </div>
      </header>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 🟦 SECTION GAUCHE : STATISTIQUES + NAVIGATION SEMAINE */}
        <section className="space-y-6">
          {/* Carte Statistiques rapides */}
          <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-xl">
            <h3 className="text-sm font-semibold text-slate-600 mb-4">
              Statistiques rapides
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <StatCard
                title="Patients"
                value={appointmentsToday.length}
                color="blue"
              />
              <StatCard
                title="À valider"
                value={stats.waitingToday}
                color="purple"
              />
              <StatCard
                title="Traités"
                value={stats.treatedToday}
                color="pink"
              />
            </div>
          </div>

          {/* Semaine et graphique hebdo */}
          <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-xl">
            {/* Navigation entre semaines */}
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-blue-700">Semaine en cours</h4>
              <div className="flex gap-2">
                <button
                  onClick={prevWeek}
                  className="p-2 rounded-full hover:bg-blue-50"
                >
                  <ChevronLeft className="text-blue-700" />
                </button>
                <button
                  onClick={nextWeek}
                  className="p-2 rounded-full hover:bg-blue-50"
                >
                  <ChevronRight className="text-blue-700" />
                </button>
              </div>
            </div>

            {/* Liste des jours de la semaine */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(d)}
                  className={`rounded-xl p-3 text-xs font-medium shadow-sm transition 
                    ${
                      isSameDay(d, selectedDate)
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-white/70 text-slate-700 hover:bg-blue-50"
                    }`}
                >
                  <div>{formatShortDay(d)}</div>
                  <div className="text-[10px]">{formatDayNumber(d)}</div>
                </button>
              ))}
            </div>

            {/* Graphique des patients traités */}
            <div className="mt-4">
              <h5 className="text-sm text-blue-600 mb-2">
                Activité hebdomadaire
              </h5>
              <div style={{ width: "100%", height: 120 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip />
                    <Bar
                      dataKey="treated"
                      fill="#6366F1"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* 🟪 SECTION DROITE : LISTE DES RENDEZ-VOUS DU JOUR */}
        <section className="lg:col-span-2">
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            {/* En-tête de la table */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-slate-800">
                Rendez-vous du {formatDate(selectedDate)}
              </h3>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow hover:opacity-90 transition">
                + Nouveau RDV
              </button>
            </div>

            {/* Table ou message si vide */}
            {appointmentsToday.length === 0 ? (
              <p className="text-center text-slate-500 italic py-6">
                Aucun rendez-vous prévu pour aujourd’hui.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-gradient-to-r from-blue-50 to-purple-50 text-slate-600">
                    <tr>
                      <th className="p-3">Heure</th>
                      <th className="p-3">Patient</th>
                      <th className="p-3">Motif</th>
                      <th className="p-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentsToday.map((r) => (
                      <tr key={r.id} className="hover:bg-blue-50/40 transition">
                        <td className="p-3">{formatTime(new Date(r.date))}</td>
                        <td className="p-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-purple-600">
                            <User className="w-4 h-4" />
                          </div>
                          <span>{r.patient}</span>
                        </td>
                        <td className="p-3">{r.reason}</td>
                        <td className="p-3">
                          <StatusBadge status={r.status} />
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
    done: "bg-emerald-100 text-emerald-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <select
      value={status}
      onChange={(e) => onChange && onChange(e.target.value)} // 🔁 si une fonction de changement est passée
      className={`px-2 py-1 rounded-full text-xs font-medium border-none cursor-pointer focus:ring-2 focus:ring-blue-400 transition 
        ${styles[status] || "bg-slate-100 text-slate-600"}`}
    >
      <option value="pending">🕓 En attente</option>
      <option value="done">✅ Validé</option>
      <option value="cancelled">❌ Annulé</option>
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
