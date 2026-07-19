// frontend/src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"; // Assurez-vous que le chemin est correct
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ChoixDeRdv from "./pages/ChoixDeRdv";
import FormulaireDeReservation from "./components/FormulaireDeReservation";
import Essai from "./components/Essai";
import TableauDeBordDentiste from "./pages/TableauDeBordDentiste";
import TableauDeBordPatient from "./pages/TableauDeBordPatient";
import ResetPassword from "./pages/ResetPassword";
import CreateDentiste from "./pages/CreateDentiste";
import Footer from "./pages/Footer";
function App() {
  const location = useLocation();
  const NoNavbarPaths = [
    "/FormulaireDeReservation",
    "/TableauDeBordDentiste",
    "/CreateDentiste",
  ];
  const showNavbar = !NoNavbarPaths.includes(location.pathname);

  return (
    <>
      {/* C'est ici que l'information est passée */}
      {showNavbar && <Navbar currentPage={location.pathname} />}

      <Routes>
        <Route path="/" element={<Essai />} />
        <Route path="/ChoixDeRdv" element={<ChoixDeRdv />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/FormulaireDeReservation"
          element={<FormulaireDeReservation />}
        />
        <Route path="/CreateDentiste" element={<CreateDentiste />} />
        <Route
          path="/TableauDeBordDentiste"
          element={<TableauDeBordDentiste />}
        />
        <Route
          path="/TableauDeBordPatient"
          element={<TableauDeBordPatient />}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
