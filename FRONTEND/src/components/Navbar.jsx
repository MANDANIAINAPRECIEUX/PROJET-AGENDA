// frontend/src/components/Navbar.jsx
"use client";

import {
  Menu,
  Stethoscope,
  HelpCircle,
  CalendarPlus,
  LogOut,
} from "lucide-react"; // Importez l'icône d'aide
import { Link } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Le composant Navbar reçoit la prop "currentPage"
export default function Navbar({ currentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleLogout = () => {
    // plus tard tu mettras removeToken(), clearUser(), etc.

    window.location.href = "/login";
  };

  // Définissons les différents ensembles de boutons pour le bureau et le mobile
  let desktopButtons;
  let mobileButtons;
  let mobileAuthButtons;
  let mobileMainLinks;

  // LOGIQUE CONDITIONNELLE pour les différents chemins d'URL
  if (
    currentPage === "/choixDeRdv" ||
    currentPage === "/TableauDeBordPatient"
  ) {
    // Cas où l'utilisateur est sur la page de choix de RDV
    desktopButtons = (
      <>
        <Link to="/TableauDeBordPatient" onClick={() => setIsOpen(false)}>
          <Button
            variant="secondary"
            className="w-full flex items-center gap-2 bg-white/60 
               text-blue-700 hover:bg-white/80 shadow-sm 
               rounded-xl backdrop-blur-sm"
          >
            Historique
          </Button>
        </Link>

        <Link to="/choixDeRdv" onClick={() => setIsOpen(false)}>
          <Button
            variant="secondary"
            className="w-full flex items-center gap-2 bg-white/60 
               text-blue-700 hover:bg-white/80 shadow-sm 
               rounded-xl backdrop-blur-sm"
          >
            <CalendarPlus className="w-5 h-5" />
            Nouveau Rendez - Vous
          </Button>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-2 px-4 py-1 rounded-xl font-semibold
            bg-white/60 
               text-blue-700 hover:bg-white/80 shadow-sm 
               rounded-xl backdrop-blur-sm "
        >
          <LogOut className="w-5 h-5" />
          Quitter
        </button>
      </>
    );

    // Pour le menu mobile, nous allons modifier les liens principaux et les liens d'auth
    mobileMainLinks = (
      <>
        <Link to="/TableauDeBordPatient" onClick={() => setIsOpen(false)}>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Historique
          </Button>
        </Link>
        <Link to="/choixDeRdv" onClick={() => setIsOpen(false)}>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Nouveau Rendez - Vous
          </Button>
        </Link>
      </>
    );
    // Masquer les boutons de connexion/inscription sur mobile
    mobileAuthButtons = null;
  } else if (currentPage === "/forgot-password") {
    // Cas où l'utilisateur est sur la page de mot de passe oublié
    desktopButtons = (
      <>
        <Link to="/login">
          <Button
            variant="outline"
            className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-all duration-300 ease-in-out hover:scale-105"
          >
            Connexion
          </Button>
        </Link>
        <Link to="/register">
          <Button className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-all duration-300 ease-in-out hover:scale-105">
            S'inscrire
          </Button>
        </Link>
        {/* Le petit bouton-icone d'aide */}
        <Button variant="ghost" size="icon" className="text-gray-800 ml-2">
          <HelpCircle className="h-6 w-6" />
        </Button>
      </>
    );

    // Pour le mobile, on peut aussi ajouter l'icône d'aide
    mobileMainLinks = null; // Pas de liens principaux

    mobileAuthButtons = (
      <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200">
        <Link to="/login" onClick={() => setIsOpen(false)}>
          <Button
            variant="outline"
            className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
          >
            Connexion
          </Button>
        </Link>
        <Link to="/register" onClick={() => setIsOpen(false)}>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            S'inscrire
          </Button>
        </Link>
       <div className="pt-4 border-t border-white/30 mt-3">
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

      </div>
    );
  } else {
    // Cas par défaut (toutes les autres pages)
    desktopButtons = (
      <>
        <div className="ml-6 flex items-center space-x-3">
          <Link to="/login">
            <Button
              variant="outline"
              className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-all duration-300 ease-in-out hover:scale-105"
            >
              Connexion
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-all duration-300 ease-in-out hover:scale-105">
              S'inscrire
            </Button>
          </Link>
        </div>
      </>
    );

    // Boutons de navigation mobile par défaut
    mobileMainLinks = (
      <div className="flex flex-col space-y-3 p-4 rounded-xl bg-gradient-to-br from-pink-300 via-purple-500 to-blue-500 shadow-xl">
        <Link to="/services" onClick={() => setIsOpen(false)}>
          <Button
            variant="ghost"
            className="w-full justify-start text-white/90 hover:text-white hover:bg-white/20"
          >
            CONNEXION
          </Button>
        </Link>

        <Link to="/about" onClick={() => setIsOpen(false)}>
          <Button
            variant="ghost"
            className="w-full justify-start text-white/90 hover:text-white hover:bg-white/20"
          >
            S'INSCRIRE
          </Button>
        </Link>

        <Link to="/contact" onClick={() => setIsOpen(false)}>
          <Button
            variant="ghost"
            className="w-full justify-start text-white/90 hover:text-white hover:bg-white/20"
          >
            À propos
          </Button>
        </Link>
      </div>
    );
    // Boutons d'authentification mobile par défaut
    // mobileAuthButtons = (
    //   <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200">
    //     <Link to="/login" onClick={() => setIsOpen(false)}>
    //       <Button
    //         variant="outline"
    //         className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
    //       >
    //         Connexion
    //       </Button>
    //     </Link>
    //     <Link to="/register" onClick={() => setIsOpen(false)}>
    //       <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
    //         S'inscrire
    //       </Button>
    //     </Link>
    //   </div>
    // );
  }

  return (
    <nav className=" absolute top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/20">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          {/* Le logo ne change pas, donc il est affiché de manière statique */}
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg ">
              <Stethoscope className="h-10 w-10 text-white" />
            </div>
            <Link
              to="/"
              className="text-3xl font-extrabold text-white transition-colors hover:text-blue-300 tracking-tight"
            >
              Agenda Dentaire
            </Link>
          </div>

          {/* navigation desktop - Utilisation des boutons conditionnels */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <div className="ml-6 flex items-center space-x-3">
              {desktopButtons}
            </div>
          </div>

          {/* boutton pour le mobile - Utilisation des boutons conditionnels */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-700">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="h-screen w-[300px] sm:w-[400px] overflow-y-auto"
              >
                <div className="flex flex-col  px-6 bg-gradient-to-br from-pink-300 via-purple-500 to-blue-500 ">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-2 pb-4  ">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                      <Stethoscope className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white text-slate-900">
                      Agenda Dentaire
                    </span>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col space-y-2">
                    {mobileMainLinks}
                  </div>

                  {/* Mobile Auth Buttons */}
                  <div className="flex flex-col space-y-3 pt-4 ">
                    {mobileAuthButtons}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
