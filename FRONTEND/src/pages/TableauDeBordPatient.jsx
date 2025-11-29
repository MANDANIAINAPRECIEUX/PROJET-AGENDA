import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";

export default function TableauDeBordPatient() {
  const [rdvList, setRdvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [listeDentsPatients, setListeDentsPatients] = useState([]);

  // Patient depuis le localStorage
  const userLocal = JSON.parse(localStorage.getItem("user"));
  const patientId = userLocal?._id; // une seule source de vérité

  /* --------------------------------------------------------
   🔵 Chargement des RDV + Dents du patient
-------------------------------------------------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("userToken");

        if (!token) {
          console.log("Aucun token trouvé");
          setLoading(false);
          return;
        }

        // 1) Charger les RDV
        const rdvResponse = await axios.get(
          `/api/rendezvous/patient/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setRdvList(rdvResponse.data);

        console.log("RDV du patient :", rdvList);
        console.log("RDV du patient :", rdvResponse.data);

        if (!rdvResponse.data.length) return;

        // 2) Récupérer l'ID du patient dans le RDV
        const firstPatientId = rdvResponse.data[0].patient._id;

        // 3) Charger les dents
        const dentResponse = await axios.get(
          `/api/dents/patient/${firstPatientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setListeDentsPatients(dentResponse.data);
        console.log("📌 Dents du patient :", dentResponse.data);
        const a = dentResponse.data;
      } catch (err) {
        console.log("Erreur dans loadData :", err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) loadData();
  }, [patientId]);

  const historique = useMemo(() => {
    if (!rdvList.length && !listeDentsPatients.length) return [];

    const normalize = (date) => new Date(date).toISOString().split("T")[0];

    const events = [];

    // ➤ RDV
    rdvList.forEach((rdv) => {
      events.push({
        type: "RDV",
        createdAt: normalize(rdv.createdAt),
        dateRDV: rdv.dateHeure,
        statut: rdv.statut,
        dentiste: rdv.dentiste,
        patientId: rdv.patient._id,
      });
    });

    // ➤ Dents
    listeDentsPatients.forEach((dent) => {
      events.push({
        type: "Dent",
        createdAt: normalize(dent.createdAt),
        numero: dent.numero,
        typeDent: dent.typeDent,
        secteur: dent.secteurDentaire,
        patientId: dent.patient,
      });
    });

    // ➤ Regrouper par createdAt
    const grouped = {};

    events.forEach((e) => {
      const key = `${e.createdAt}_${e.patientId}`;

      if (!grouped[key]) {
        grouped[key] = {
          date: e.createdAt,
          patientId: e.patientId,
          rdv: [],
          dents: [],
        };
      }

      if (e.type === "RDV") grouped[key].rdv.push(e);
      if (e.type === "Dent") grouped[key].dents.push(e);
    });

    // ➤ Chaque dent doit devenir UNE ligne
    const final = [];

    Object.values(grouped).forEach((g) => {
      if (g.dents.length > 0) {
        g.dents.forEach((d) => {
          final.push({
            date: g.date,
            numero: d.numero,
            typeDent: d.typeDent,
            secteur: d.secteur,
            dentiste: g.rdv[0]?.dentiste || null,
            statut: g.rdv[0]?.statut || null,
          });
        });
      }
    });

    return final.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [rdvList, listeDentsPatients]);

  /* --------------------------------------------------------
  
   📊 STATISTIQUES
-------------------------------------------------------- */
  const total = rdvList.length;
  const validated = rdvList.filter((r) => r.statut === "Validé").length;
  const cancelled = rdvList.filter((r) => r.statut === "Annulé").length;

  // Motif le plus fréquent
  const reasonCount = {};
  rdvList.forEach((r) => {
    reasonCount[r.motif] = (reasonCount[r.motif] || 0) + 1;
  });

  // RDV par mois
  const monthlyStats = {};

  rdvList.forEach((r) => {
    if (!r.dateHeure) return;

    // Format attendu : "DD/MM/YYYY HH:mm"
    const parts = r.dateHeure.split(/[/ :]/);
    if (parts.length < 3) return;

    const [day, month, year] = parts;

    // Construire une date valide JS : YYYY-MM-DD
    const jsDate = new Date(`${year}-${month}-${day}`);

    if (!isNaN(jsDate)) {
      const m = jsDate.getMonth() + 1; // mois numérique 1–12
      const y = jsDate.getFullYear(); // année

      const key = `${m}-${y}`; // ex: "1-2026"

      monthlyStats[key] = (monthlyStats[key] || 0) + 1;
    }
  });

  // Tableau final pour Recharts
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

  const monthlyData = Object.keys(monthlyStats).map((key) => {
    const [m, y] = key.split("-").map(Number);

    return {
      monthYear: `${monthNames[m - 1]} ${y}`, // ex: "Janvier 2026"
      count: monthlyStats[key],
    };
  });

  console.log("📊 monthlyData =", monthlyData);

  // Pie Chart

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 min-h-screen">
      {/* ---- Header ---- */}

      {/* ---- Header ---- */}
      <div className="flex justify-center py-20">

          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-xl whitespace-nowrap">
            Historique de vos consultations
          </h1>
      
      </div>

      {/* ---- Stat Cards ---- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Total des rendez-vous"
          value={total}
          titleColor="text-blue-600"
        />
        <StatCard
          title="rendez-vous Validés"
          value={validated}
          titleColor="text-pink-900"
        />
        <StatCard
          title="rendez-vous Annulés"
          value={cancelled}
          titleColor="text-purple-600"
        />
      </div>

      {/* ---- Graphiques ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12   ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-2xl p-6"
        >
          <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-md">
            📊 Rendez - vous par mois
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="monthYear" stroke="#ffffffff" />
              <YAxis allowDecimals={false} stroke="#fff" />

              <Bar dataKey="count" fill="#ffffff" opacity={0.9}>
                <LabelList
                  dataKey="count"
                  content={(props) =>
                    (() => {
                      const { x, y, width, value } = props;
                      const cx = x + width / 2;
                      const cy = y ;

                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={14} fill="purple" />
                          <text
                            x={cx}
                            y={cy}
                            fill="white"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={18}
                            fontWeight="bold"
                          >
                            {value}
                          </text>
                        </g>
                      );
                    })()
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ---- Historique RDV ---- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-2xl p-6"
      >
        <h2 className="text-2xl font-semibold text-white mb-5 drop-shadow-md">
          🗂 Historique des rendez-vous
        </h2>

        <div className="overflow-x-auto rounded-xl border border-white/40 backdrop-blur-lg">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-white/20">
              <tr className="border-b border-white/20">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Heure</th>
                <th className="p-4 font-semibold">Dentiste</th>
                <th className="p-4 font-semibold">Statut</th>
              </tr>
            </thead>

            <tbody className="">
              {rdvList.length > 0 ? (
                rdvList.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/10 hover:bg-white/10 transition text-center"
                  >
                    <td className="p-4">{item.dateHeure}</td>
                    <td className="p-4">{item.dureeMinutes}</td>

                    <td className="p-4">
                      {item.dentiste?.nom
                        ? `${item.dentiste.nom} ${item.dentiste.prenom || ""}`
                        : "—"}
                    </td>

                    <td className="p-4">
                      {item.statut ? (
                        <span
                          className={`inline-block w-24 text-center px-3 py-1 text-l font-bold shadow-md
      ${
        item.statut === "Validé"
          ? "bg-blue-500/90 text-white"
          : item.statut === "Annulé"
          ? "bg-purple-500/90 text-white"
          : "bg-gray-500/80 text-white"
      }`}
                        >
                          {item.statut}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-white/80 italic tracking-wide"
                  >
                    Aucun rendez-vous trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

/* ---- Composant Statistique ---- */
function StatCard({ title, value, titleColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04 }}
      className="
        relative
        bg-white/50 
        backdrop-blur-xl
        border border-white/20 
        rounded-3xl 
        p-6
        shadow-[0_8px_30px_rgba(255,255,255,0.35)] 
        transition
        hover:border-blue-400/40
        hover:shadow-[0_8px_40px_rgba(255,255,255,0.85)]
        text-center
      "
    >
      {/* Lueur subtile */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <h3
        className={`text-sm font-semibold tracking-wide uppercase ${titleColor}`}
      >
        {title}
      </h3>

      <p className="mt-3 text-4xl font-extrabold text-white tracking-tight drop-shadow">
        {value}
      </p>
    </motion.div>
  );
}
