import { useState, useEffect } from "react";
import axios from "axios";
import DownloadBadge from "../components/DownloadBadge";
import {LogOut} from "lucide-react";
export default function AdminPage() {
  const handleLogout = () => {
    // plus tard tu mettras removeToken(), clearUser(), etc.

    window.location.href = "/login";
  };
  // ------------------ STATES ------------------
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    specialite: "",
    telephone: "",
    email: "",
    isAdmin: false,
  });

  const [dentistes, setDentistes] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    patientsParDentiste: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [badgeURL, setBadgeURL] = useState("");
  const [editDentiste, setEditDentiste] = useState(null);

  // ------------------ BACKGROUND ------------------
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background =
      "linear-gradient(to bottom right, #ec4899, #a855f7, #93c5fd)";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.fontFamily = "Poppins, sans-serif";

    return () => {
      document.body.style.background = "";
    };
  }, []);

  // ------------------ LOAD DATA ON START ------------------
  useEffect(() => {
    fetchDentistes();
    fetchStats();
  }, []);

  const fetchDentistes = async () => {
    const token = localStorage.getItem("userToken");

    const res = await axios.get("/api/dentistes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setDentistes(res.data);
  };

  const fetchStats = async () => {
    try {
      console.log("📊 [fetchStats] Chargement des statistiques...");

      const token = localStorage.getItem("userToken");

      if (!token) {
        console.warn("⛔ Aucun token trouvé — utilisateur non authentifié");
        return;
      }

      const res = await axios.get("/api/rendezvous/count-by-dentiste", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📥 Réponse stats reçue :", res.data);

      if (!res.data) {
        console.warn("⚠️ Aucun data reçu de l'API /count-by-dentiste");
        setStats([]);
        return;
      }

      setStats(res.data);
    } catch (error) {
      console.error("❌ Erreur lors du fetchStats :", error);

      if (error.response) {
        console.error("🔍 ERREUR BACKEND :", error.response.data);
        console.error("📌 Code HTTP :", error.response.status);
      } else if (error.request) {
        console.error(
          "📡 Requête envoyée mais aucune réponse :",
          error.request
        );
      } else {
        console.error("⚙️ Erreur Axios :", error.message);
      }

      setStats([]); // Pour éviter les crashs
    }
  };

  // ------------------ FORM HANDLERS ------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post("/api/dentistes/ajouter", form);
      setMessage("Dentiste créé avec succès !");
      setBadgeURL(res.data.badgeURL);

      window.open(`http://localhost:5000${res.data.badgeURL}`, "_blank");

      fetchDentistes();
      fetchStats();
    } catch (error) {
      setMessage("Erreur lors de la création du dentiste.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (dentiste) => {
    setEditDentiste(dentiste);
    setForm(dentiste);
  };

  const handleUpdate = async () => {
    if (!editDentiste) return;

    await axios.put(`/api/dentistes/${editDentiste._id}`, form);
    setEditDentiste(null);

    setForm({
      nom: "",
      prenom: "",
      specialite: "",
      telephone: "",
      email: "",
      isAdmin: false,
    });

    fetchDentistes();
    fetchStats();
  };

  // ------------------ UI ------------------
  return (
    <>
      <header
        className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center 
                     bg-white/10 backdrop-blur-xl border border-white/20 
                     rounded-2xl px-6 py-5 shadow-[0_8px_30px_rgb(255,255,255,0.25)] my-10 ml-20"
      >
        {/* TITRE À GAUCHE */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-white drop-shadow">
            gestion des rendez - vous
          </h1>
        </div>

        {/* BOUTONS À DROITE */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          {/* Bouton Retour */}
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2 rounded-xl bg-white/60 text-purple-700 
               backdrop-blur-md shadow hover:bg-white/90 transition"
          >
            Retour
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 justify-start 
               px-4 py-2 rounded-lg font-medium
               bg-white/20 text-white backdrop-blur-sm
               hover:bg-white/30 transition border border-white/40"
          >
            <LogOut className="w-5 h-5" />
            Quitter
          </button>
        </div>
      </header>
      <div style={styles.pageWrapper}>
        {/* STATS */}
        <div style={styles.statsSection}>
          <div style={styles.glassCard}>
            <h2 style={styles.sectionTitle}>📊 Statistiques générales</h2>
            <p style={styles.statItem}>
              Dentistes inscrits : <strong>{dentistes.length}</strong>
            </p>
            <p style={styles.statItem}>
              Total patients : <strong>{stats.totalPatients}</strong>
            </p>
            <h3 style={styles.subSectionTitle}>Patients par dentiste :</h3>
            {console.log("📊 stats :", stats)}
            {console.log(
              "📊 stats.patientsParDentiste :",
              stats?.patientsParDentiste
            )}
            {stats && Array.isArray(stats.patientsParDentiste) ? (
              stats.patientsParDentiste.length > 0 ? (
                <>
                  {console.log(
                    "📌 Nombre d’éléments dans patientsParDentiste :",
                    stats.patientsParDentiste.length
                  )}
                  {stats.patientsParDentiste.map((d, index) => {
                    console.log(`➡️ Élément ${index} :`, d);
                    return (
                      <p
                        key={d.dentisteId || d._id || index}
                        style={styles.statItemSmall}
                      >
                        {d.nom} {d.prenom} → {d.totalPatients} patients
                      </p>
                    );
                  })}
                </>
              ) : (
                <>
                  {console.log("⚠️ patientsParDentiste est vide → []")}
                  <p style={{ color: "white", fontStyle: "italic" }}>
                    Aucun patient enregistré pour le moment.
                  </p>
                </>
              )
            ) : (
              <>
                {console.log(
                  "⛔ stats.patientsParDentiste est undefined ou invalide :",
                  stats
                )}
                <p style={{ color: "white", fontStyle: "italic" }}>
                  Chargement des statistiques...
                </p>
              </>
            )}
          </div>
        </div>
        {/* FORMULAIRE */}
        <div style={styles.formSection}>
          <div style={styles.glassCard}>
            <h2 style={styles.sectionTitle}>
              {editDentiste ? "Modifier un dentiste" : "Ajouter un dentiste"}
            </h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <FormInput
                name="nom"
                label="Nom"
                value={form.nom}
                onChange={handleChange}
              />
              <FormInput
                name="prenom"
                label="Prénom"
                value={form.prenom}
                onChange={handleChange}
              />
              <FormInput
                name="specialite"
                label="Spécialité"
                value={form.specialite}
                onChange={handleChange}
              />
              <FormInput
                name="telephone"
                label="Téléphone"
                value={form.telephone}
                onChange={handleChange}
              />
              <FormInput
                name="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={form.isAdmin}
                  onChange={handleChange}
                />
                Administrateur ?
              </label>
              {!editDentiste ? (
                <button type="submit" style={styles.button}>
                  Créer
                </button>
              ) : (
                <button
                  type="button"
                  style={styles.button}
                  onClick={handleUpdate}
                >
                  Enregistrer les modifications
                </button>
              )}
            </form>
            {message && <p style={styles.message}>{message}</p>}
          </div>
        </div>
        {/* LISTE DES DENTISTES */}
        <div style={styles.listSection}>
          <h2 style={styles.sectionTitle}>👨‍⚕️ Liste des dentistes</h2>
          {dentistes.map((d) => (
            <div key={d._id} style={styles.dentisteCard}>
              {/* Infos dentiste */}
              <div>
                <p style={styles.dentisteName}>
                  {d.nom} {d.prenom}
                </p>
                <p>Email : {d.email}</p>
                <p>Téléphone : {d.telephone}</p>
                <p>Spécialité : {d.specialite}</p>
                <p>
                  ID Pro : <strong>{d.proId}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ------------------ INPUT COMPONENT ------------------
function FormInput({ label, name, value, onChange, type = "text" }) {
  return (
    <>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={styles.input}
        required
      />
    </>
  );
}

/* ----------------------------------------------------------------
 STYLES
---------------------------------------------------------------- */
const styles = {
  pageWrapper: {
    maxWidth: "1050px",
    margin: "40px auto",
    padding: "20px",
  },

  mainTitle: {
    color: "white",
    fontSize: "38px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "40px",
  },

  /* GLASS CONTAINER */
  glassCard: {
    background: "rgba(255, 255, 255, 0.22)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "16px",
    padding: "25px",
    marginBottom: "40px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.20)",
    animation: "fadeIn 0.6s ease-out",
  },

  sectionTitle: {
    color: "#fff",
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
  },

  subSectionTitle: {
    color: "#f0f0f0",
    fontSize: "18px",
    marginTop: "10px",
    fontWeight: "600",
  },

  statItem: {
    fontSize: "16px",
    color: "#fff",
    margin: "5px 0",
  },

  statItemSmall: {
    fontSize: "15px",
    color: "#f2f2f2",
    marginLeft: "10px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  label: {
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.5)",
    background: "rgba(255,255,255,0.6)",
    fontSize: "15px",
  },

  checkboxLabel: {
    color: "white",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  button: {
    padding: "14px",
    borderRadius: "10px",
    background: "#0d47a1",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
    transition: "0.3s",
  },

  listSection: {
    marginTop: "40px",
  },

  dentisteCard: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "14px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid rgba(255,255,255,0.3)",
  },

  dentisteName: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#fff",
  },

  editButton: {
    background: "rgba(255,255,255,0.3)",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "white",
    border: "1px solid rgba(255,255,255,0.4)",
  },

  message: {
    marginTop: "15px",
    fontSize: "17px",
    color: "#ffffff",
    textAlign: "center",
  },
};
