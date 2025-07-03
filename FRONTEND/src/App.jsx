// frontend/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import DentalAppointmentPage from "./pages/DentalAppointmentPage";

function App() {
  return (
    <>
      <Navbar /> {/* La barre de navigation s'affichera sur toutes les pages */}
      <div className="container">
        {" "}
        {/* Un conteneur pour le contenu des pages */}
        <Routes>
          <Route path="/" element={<DentalAppointmentPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Plus tard, d'autres routes comme /dashboard, /patients, etc. */}
        </Routes>
      </div>
    </>
  );
}

export default App;
