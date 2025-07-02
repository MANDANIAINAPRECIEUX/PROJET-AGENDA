"use client";

import { Menu, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <Link
              to="/"
              className="text-xl font-bold text-slate-900 transition-colors hover:text-blue-600"
            >
              Agenda Dentaire
            </Link>
          </div>

          {/* navigation desktop */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link to="/services">
              <Button
                variant="ghost"
                className="text-slate-700 hover:text-blue-600 hover:bg-blue-50"
              >
                Services
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="ghost"
                className="text-slate-700 hover:text-blue-600 hover:bg-blue-50"
              >
                À propos
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="ghost"
                className="text-slate-700 hover:text-blue-600 hover:bg-blue-50"
              >
                Contact
              </Button>
            </Link>

            <div className="ml-6 flex items-center space-x-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                >
                  Connexion
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                  S'inscrire
                </Button>
              </Link>
            </div>
          </div>

          {/* boutton pour le mobile*/}
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

                  {/* Mobile Auth Buttons */}
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
