// frontend/src/App.jsx
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";
// //import DentalAppointmentPage from "./pages/ChoixDeRdv";
// import ChoixDeRdv from "./pages/ChoixDeRDV";
// import FormulaireDeReservation from "./components/FormulaireDeReservation";
// import Essai from "./components/Essai";

// function App() {
//   return (
//     <>
//       <Navbar /> {/* La barre de navigation s'affichera sur toutes les pages */}{" "}
//       {/* Un conteneur pour le contenu des pages */}
//       <Routes>
//         <Route path="/" element={<Essai />} />
//         <Route path="/ChoixDeRdv" element={<ChoixDeRdv />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route
//           path="/FormulaireDeReservation"
//           element={<FormulaireDeReservation />}
//         />
//         {/* Plus tard, d'autres routes comme /dashboard, /patients, etc. */}
//       </Routes>
//     </>
//   );
// }

// export default App;

// frontend/src/App.jsx
// import React from "react";
// import { Routes, Route, useLocation } from "react-router-dom"; // Importez useLocation
// import Navbar from "./components/Navbar";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";
// import ChoixDeRdv from "./pages/ChoixDeRDV";
// import FormulaireDeReservation from "./components/FormulaireDeReservation";
// import Essai from "./components/Essai";

// function App() {
//   // 1. Utilisez le hook useLocation pour obtenir l'objet de localisation
//   const location = useLocation();

//   // 2. Définissez la liste des chemins où la barre de navigation doit être masquée
//   const noNavbarPaths = ["/login", "/register", "/forgot-password"];

//   // 3. Vérifiez si le chemin actuel est dans cette liste
//   // `noNavbarPaths.includes(location.pathname)` renvoie `true` si le chemin est à masquer, et `false` sinon.
//   const showNavbar = !noNavbarPaths.includes(location.pathname);

//   return (
//     <>
//       {/* 4. Affichez la barre de navigation de manière conditionnelle */}
//       {showNavbar && <Navbar />}

//       <Routes>
//         <Route path="/" element={<Essai />} />
//         <Route path="/ChoixDeRdv" element={<ChoixDeRdv />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route
//           path="/FormulaireDeReservation"
//           element={<FormulaireDeReservation />}
//         />
//       </Routes>
//     </>
//   );
// }

// export default App;

// frontend/src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"; // Assurez-vous que le chemin est correct
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ChoixDeRdv from "./pages/ChoixDeRDV";
import FormulaireDeReservation from "./components/FormulaireDeReservation";
import Essai from "./components/Essai";

function App() {
  const location = useLocation();

  return (
    <>
      {/* C'est ici que l'information est passée */}
      <Navbar currentPage={location.pathname} />

      <Routes>
        <Route path="/" element={<Essai />} />
        <Route path="/ChoixDeRdv" element={<ChoixDeRdv />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/FormulaireDeReservation"
          element={<FormulaireDeReservation />}
        />
      </Routes>
    </>
  );
}

export default App;
