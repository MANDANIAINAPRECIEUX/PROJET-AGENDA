// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Page d'accueil temporaire
function Home() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Bienvenue sur la Page d'Accueil !</h2>
      <p>Utilisez la barre de navigation pour explorer.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar /> {/* La barre de navigation s'affichera sur toutes les pages */}
      <div className="container">
        {" "}
        {/* Un conteneur pour le contenu des pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Plus tard, d'autres routes comme /dashboard, /patients, etc. */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
