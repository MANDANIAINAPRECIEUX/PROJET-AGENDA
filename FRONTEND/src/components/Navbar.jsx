// frontend/src/components/Navbar.jsx
"use client";

import { Menu, Stethoscope, HelpCircle } from "lucide-react"; // Importez l'icône d'aide
import { Link } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Le composant Navbar reçoit la prop "currentPage"
export default function Navbar({ currentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  // Définissons les différents ensembles de boutons pour le bureau et le mobile
  let desktopButtons;
  let mobileButtons;
  let mobileAuthButtons;
  let mobileMainLinks;

  // LOGIQUE CONDITIONNELLE pour les différents chemins d'URL
  if (currentPage === "/ChoixDeRdv") {
    // Cas où l'utilisateur est sur la page de choix de RDV
    desktopButtons = (
      <>
        <Link to="/historique">
          <Button
            variant="ghost"
            className="text-white hover:text-blue-300 hover:bg-white/10"
          >
            Historique
          </Button>
        </Link>
        <Link to="/nouveau-rdv">
          <Button className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-all duration-300 ease-in-out hover:scale-105">
            Nouveau RDV
          </Button>
        </Link>
      </>
    );

    // Pour le menu mobile, nous allons modifier les liens principaux et les liens d'auth
    mobileMainLinks = (
      <>
        <Link to="/historique" onClick={() => setIsOpen(false)}>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Historique
          </Button>
        </Link>
        <Link to="/nouveau-rdv" onClick={() => setIsOpen(false)}>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Nouveau RDV
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
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50"
        >
          <HelpCircle className="h-5 w-5 mr-2" />
          Besoin d'aide ?
        </Button>
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
      <div className="flex flex-col space-y-2">
        <Link to="/services" onClick={() => setIsOpen(false)}>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Services
          </Button>
        </Link>
        <Link to="/about" onClick={() => setIsOpen(false)}>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50"
          >
            À propos
          </Button>
        </Link>
        <Link to="/contact" onClick={() => setIsOpen(false)}>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Contact
          </Button>
        </Link>
      </div>
    );
    // Boutons d'authentification mobile par défaut
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
      </div>
    );
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
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-2 pb-4 border-b border-slate-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                      <Stethoscope className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-900">
                      Agenda Dentaire
                    </span>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col space-y-2">
                    {mobileMainLinks}
                  </div>

                  {/* Mobile Auth Buttons */}
                  <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200">
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
