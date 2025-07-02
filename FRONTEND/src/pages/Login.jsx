//

"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  LogIn,
  Stethoscope,
  Mail,
  Lock,
  UserCheck,
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

    // Simulation d'une requête API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Données de connexion:", formData);
      // Ici vous ajouteriez votre logique de connexion
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setErrors({ general: "Erreur de connexion. Veuillez réessayer." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header avec logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Agenda Dentaire
          </h1>
          <p className="text-slate-600">Accédez à votre espace professionnel</p>
        </div>
        {/* soratra connection */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center text-slate-900 flex items-center justify-center gap-2">
              <LogIn className="h-6 w-6 text-blue-600" />
              Connexion
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Connectez-vous à votre compte professionnel
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Message d'erreur général */}
              {errors.general && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {errors.general}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email professionnel
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 ${
                      errors.email
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-slate-300 focus-visible:ring-blue-500"
                    }`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium"
                >
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 ${
                      errors.password
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-slate-300 focus-visible:ring-blue-500"
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
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm text-slate-600 cursor-pointer"
                  >
                    Se souvenir de moi
                  </Label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Bouton de connexion */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 shadow-lg transition-all duration-200"
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

              {/* Séparateur */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Ou</span>
                </div>
              </div>

              {/* Connexion rapide (optionnel) */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors bg-transparent"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Connexion avec badge professionnel
              </Button>

              {/* Lien vers inscription */}
              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Vous n'avez pas encore de compte ?{" "}
                  <a
                    href="/register"
                    className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Créer un compte
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>Connexion sécurisée • Données protégées</p>
          <div className="flex justify-center items-center gap-4 mt-2">
            <a
              href="/privacy"
              className="hover:text-slate-700 transition-colors"
            >
              Confidentialité
            </a>
            <span>•</span>
            <a
              href="/support"
              className="hover:text-slate-700 transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
