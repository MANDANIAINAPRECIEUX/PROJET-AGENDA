"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Eye,
  EyeOff,
  LogIn,
  Stethoscope,
  Mail,
  Lock,
  UserCheck,
  Shield,
  Heart,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Login() {
  const [showScanner, setShowScanner] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Réinitialiser les erreurs générales avant la nouvelle tentative

    // Simulation d'une requête API
    try {
      const response = await axios.post("/api/auth/login", {
        // L'URL de votre API de connexion
        email: formData.email,
        password: formData.password,
      });

      console.log("Connexion réussie:", response.data);

      // Stocker le token et les informations utilisateur (par exemple, dans le localStorage)
      localStorage.setItem("userToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data)); // Stockez les infos utilisateur

      // Rediriger l'utilisateur vers la page de prise de rendez-vous ou le tableau de bord
      // Remplacez '/appointments' par le chemin de votre page de rendez-vous
      navigate("/ChoixDeRdv"); // <-- Utilisez navigate('/votre-chemin') pour la navigation React Router

      // Ici vous ajouteriez votre logique de connexion
    } catch (error) {
      console.error(
        "Erreur lors de la connexion:",
        error.response?.data?.message || error.message
      );
      setErrors({
        general:
          error.response?.data?.message ||
          "Erreur de connexion. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!showScanner) return;

    const div = document.getElementById("qr-reader");
    if (!div) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        console.log("QR Code détecté :", decodedText);

        try {
          const res = await axios.post("/api/dentistes/verifier-qr", {
            qrData: decodedText,
          });

          if (res.data.ok === true) {
            if (res.data.isAdmin === true) {
              window.location.href = "/CreateDentiste";
            } else {
              window.location.href = "/TableauDeBordDentiste";
            }
          } else {
            alert("QR Code invalide !");
          }
        } catch (err) {
          console.error(err);
        }

        scanner.clear();
      },
      (err) => console.warn("scan error :", err)
    );

    return () => scanner.clear();
  }, [showScanner]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Overlay effects that match the original gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-blue-500/20"></div>

      {/* Floating elements matching the original color scheme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-blue-300/10 rounded-full blur-2xl animate-float-slow"></div>
      </div>

      <div className="w-full pt-20 max-w-md relative z-10">
        {/* Enhanced Header with logo matching the gradient */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                <Stethoscope className="h-10 w-10 text-white" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20"></div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
            Agenda Dentaire
          </h1>
          <p className="text-white/90 text-lg font-medium drop-shadow">
            Accédez à notre page
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-white/80">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Connexion sécurisée</span>
          </div>
        </div>

        {/* Enhanced Card with glass morphism matching the gradient */}
        <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden animate-fade-in-up animation-delay-200">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent"></div>

          <CardHeader className="relative space-y-1 pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <LogIn className="h-6 w-6 text-white" />
              </div>
              Connexion
            </CardTitle>
            <CardDescription className="text-center text-white/80 text-base">
              Connectez-vous à votre compte
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Enhanced error message */}
              {errors.general && (
                <div className="p-4 text-sm text-red-100 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm animate-shake">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    {errors.general}
                  </div>
                </div>
              )}

              {/* Enhanced Email Input */}
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-white font-medium text-sm flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email professionnel
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 transition-colors group-focus-within:text-white" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-12 pr-4 py-3 h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/15 focus:border-white/40 focus:ring-0 focus:ring-offset-0 hover:bg-white/15 ${
                        errors.email ? "border-red-400/50 bg-red-500/10" : ""
                      }`}
                      autoComplete="email"
                    />
                  </div>
                </div>
                {errors.email && (
                  <p className="text-sm text-red-300 flex items-center gap-2 animate-fade-in">
                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Enhanced Password Input */}
              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-white font-medium text-sm flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Mot de passe
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 transition-colors group-focus-within:text-white" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-12 pr-12 py-3 h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/15 focus:border-white/40 focus:ring-0 focus:ring-offset-0 hover:bg-white/15 ${
                        errors.password ? "border-red-400/50 bg-red-500/10" : ""
                      }`}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-300 flex items-center gap-2 animate-fade-in">
                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Enhanced Options */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-500 bg-white/20 border-white/30 rounded focus:ring-purple-500 focus:ring-2 backdrop-blur-sm"
                    />
                  </div>
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm text-white/90 cursor-pointer hover:text-white transition-colors"
                  >
                    Se souvenir de moi
                  </Label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-sm text-pink-200 hover:text-white transition-colors font-medium hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Enhanced Submit Button matching the gradient */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 hover:from-pink-600 hover:via-purple-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isLoading ? (
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-3 relative z-10">
                    <LogIn className="h-5 w-5" />
                    Se connecter
                    <Sparkles className="h-4 w-4 opacity-70" />
                  </div>
                )}
              </Button>

              {/* Enhanced Separator */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/10 backdrop-blur-sm px-4 py-1 text-white/70 rounded-full border border-white/20">
                    Ou
                  </span>
                </div>
              </div>

              {/* Enhanced Alternative Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-white/30 text-white hover:bg-white/10 transition-all duration-300 bg-white/5 backdrop-blur-sm rounded-xl hover:border-white/50 group relative overflow-hidden"
                onClick={() => setShowScanner(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <UserCheck className="h-5 w-5 mr-3 relative z-10" />
                <span className="relative z-10">
                  Connexion avec badge professionnel
                </span>
              </Button>
              {showScanner && (
                <div
                  id="qr-reader"
                  className="mt-6 p-4 rounded-xl bg-white shadow-lg"
                ></div>
              )}

              {/* Enhanced Registration Link */}
              <div className="text-center pt-6 border-t border-white/20">
                <p className="text-sm text-white/80">
                  Vous n'avez pas encore de compte ?{" "}
                  <a
                    href="/register"
                    className="font-semibold text-pink-200 hover:text-white transition-colors hover:underline"
                  >
                    Créer un compte
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Enhanced Footer */}
        <div className="text-center mt-8 text-white/80 animate-fade-in-up animation-delay-400">
          <div className="flex justify-center items-center gap-2 mb-3">
            <Shield className="h-4 w-4" />
            <p className="text-sm font-medium">
              Connexion sécurisée • Données protégées
            </p>
            <Heart className="h-4 w-4 text-pink-300" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(3deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-2deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(1deg);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
