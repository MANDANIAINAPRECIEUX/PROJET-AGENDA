//

"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  CheckCircle,
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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
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
    // Clear global message on input change
    setLoginMessage("");
    setIsSuccess(false);
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
    setLoginMessage("");
    setIsSuccess(false);

    try {
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Connexion réussie:", response.data);

      // Stocker le token et les informations utilisateur
      localStorage.setItem("userToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      setLoginMessage("Connexion réussie ! Redirection...");
      setIsSuccess(true);

      // Rediriger l'utilisateur vers la page de prise de rendez-vous
      setTimeout(() => {
        navigate("/ChoixDeRdv");
      }, 1500);
    } catch (error) {
      console.error(
        "Erreur lors de la connexion:",
        error.response?.data?.message || error.message
      );
      setLoginMessage(
        error.response?.data?.message ||
          "Erreur de connexion. Veuillez réessayer."
      );
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour vérifier si un champ est valide
  const isFieldValid = (fieldName) => {
    return formData[fieldName] && !errors[fieldName];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header avec logo amélioré */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-700 shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                <Stethoscope className="h-8 w-8 text-white" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20"></div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Agenda Dentaire
          </h1>
          <p className="text-slate-600 font-medium">
            Accédez à votre espace professionnel
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-slate-500">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm">Connexion sécurisée</span>
          </div>
        </div>

        {/* Card avec design épuré */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm transform transition-all duration-300 hover:shadow-3xl">
          <CardHeader className="space-y-1 pb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-slate-900 flex items-center justify-center gap-2">
              <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-full">
                <LogIn className="h-5 w-5 text-white" />
              </div>
              Connexion
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Connectez-vous à votre compte professionnel
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Message de succès ou d'erreur global */}
              {loginMessage && (
                <div
                  className={`p-3 rounded-lg text-center text-sm font-medium transition-all duration-300 ${
                    isSuccess
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isSuccess ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                    {loginMessage}
                  </div>
                </div>
              )}

              {/* Email Input amélioré */}
              <div className="space-y-2">
                <Label 
                  htmlFor="email" 
                  className="text-slate-700 font-medium flex items-center gap-1"
                >
                  Email professionnel *
                  {isFieldValid("email") && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 h-11 transition-all duration-200 ${
                      errors.email
                        ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                        : isFieldValid("email")
                        ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
                        : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
                    }`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 animate-pulse flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input amélioré */}
              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className="text-slate-700 font-medium flex items-center gap-1"
                >
                  Mot de passe *
                  {isFieldValid("password") && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 h-11 transition-all duration-200 ${
                      errors.password
                        ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                        : isFieldValid("password")
                        ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
                        : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
                    }`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 animate-pulse flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Options améliorées */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 bg-white border-slate-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    Se souvenir de moi
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700 transition-colors font-medium hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Submit Button amélioré */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Se connecter
                  </div>
                )}
              </Button>

              {/* Separator */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 py-1 text-slate-500 rounded-full border border-slate-200">
                    Ou
                  </span>
                </div>
              </div>

              {/* Alternative Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-green-200 text-green-700 hover:bg-green-50 transition-all duration-300 bg-white rounded-lg hover:border-green-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-50/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <UserCheck className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">Connexion avec badge professionnel</span>
              </Button>

              {/* Information sécurité */}
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 bg-green-50 p-3 rounded-lg border border-green-200">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Connexion sécurisée • Données protégées</span>
                <Heart className="h-4 w-4 text-green-500" />
              </div>

              {/* Registration Link */}
              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Vous n'avez pas encore de compte ?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-green-600 hover:text-green-700 transition-colors hover:underline"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer amélioré */}
        <div className="text-center mt-8 text-sm text-slate-500 space-y-2">
          <p className="font-medium">Plateforme sécurisée de gestion dentaire</p>
          <div className="flex justify-center items-center gap-4">
            <Link
              to="/privacy"
              className="hover:text-slate-700 transition-colors hover:underline"
            >
              Confidentialité
            </Link>
            <span>•</span>
            <Link
              to="/support"
              className="hover:text-slate-700 transition-colors hover:underline"
            >
              Support
            </Link>
            <span>•</span>
            <Link
              to="/terms"
              className="hover:text-slate-700 transition-colors hover:underline"
            >
              Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
