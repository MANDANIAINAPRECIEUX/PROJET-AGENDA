// frontend/src/pages/Register.jsx
import React, { useState } from "react"; // Assurez-vous que React est importé
import { useNavigate, Link } from "react-router-dom"; // Importez useNavigate et Link
import axios from "axios"; // Importez Axios
import {
  Eye,
  EyeOff,
  UserPlus,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  Stethoscope,
  Heart,
  Sparkles,
} from "lucide-react";

// Assurez-vous que ces chemins d'importation sont corrects pour votre projet React
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

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // --- DÉCLARATIONS MANQUANTES AJOUTÉES ICI ---
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  // ------------------------------------------

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // Clear global message on input change
    setRegistrationMessage("");
    setIsSuccess(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    // Validation email selon votre schéma Mongoose
    if (!formData.email.trim()) {
      newErrors.email = "Veuillez ajouter une adresse email";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      newErrors.email = "Veuillez ajouter une adresse email valide";
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis";
    }

    // Validation de l'âge
    if (!formData.age.trim()) {
      newErrors.age = "L'âge est requis";
    } else {
      const age = Number.parseInt(formData.age);
      if (isNaN(age) || age < 16 || age > 120) {
        // Correction min age à 16 pour correspondre à la validation frontend
        newErrors.age = "L'âge doit être entre 16 et 120 ans";
      }
    }

    // Validation mot de passe selon votre schéma
    if (!formData.password) {
      newErrors.password = "Veuillez ajouter un mot de passe";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
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
    setRegistrationMessage(""); // Réinitialise le message
    setIsSuccess(false);

    try {
      // Données pour userSchema (patient)
      const registrationData = {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: "patient",
        // Données supplémentaires du patient
        prenom: formData.prenom.trim(),
        nom: formData.nom.trim(),
        telephone: formData.telephone.trim(),
        age: Number.parseInt(formData.age),
      };

      console.log("Données d'inscription patient envoyées:", registrationData);
      const response = await axios.post(
        "/api/auth/register", // TRÈS IMPORTANT : Vérifiez que cette URL est correcte !
        registrationData
      );

      setRegistrationMessage(
        response.data.message || "Inscription réussie ! Redirection..."
      );
      setIsSuccess(true);

      // Optionnel: Réinitialiser le formulaire après succès
      setFormData({
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        age: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});

      // Redirection après un court délai pour que l'utilisateur voie le message
      setTimeout(() => {
        navigate("/login"); // Redirige vers la page de connexion en utilisant React Router DOM
      }, 2000); // Redirige après 2 secondes
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      let errorMessage = "Échec de l'inscription. Veuillez réessayer.";

      if (error.response) {
        // Le serveur a répondu avec un statut d'erreur (ex: 400, 401, 500)
        errorMessage = error.response.data.message || errorMessage;
        console.error("Détails de l'erreur du backend:", error.response.data);
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue (ex: serveur injoignable)
        errorMessage = "Aucune réponse du serveur. Vérifiez votre connexion.";
      } else {
        // Autre chose s'est produite lors de la configuration de la requête
        errorMessage = "Erreur inattendue lors de l'envoi de la requête.";
      }

      setRegistrationMessage(errorMessage);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Éléments décoratifs flottants */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-teal-200/10 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-green-300/10 rounded-full blur-xl animate-float"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header avec logo amélioré */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-700 shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-3xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20"></div>
                <Stethoscope className="h-10 w-10 text-white relative z-10" />
                <div className="absolute inset-2 rounded-full border border-white/30"></div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent drop-shadow-sm">
            Agenda Dentaire
          </h1>
          <p className="text-slate-600 font-medium text-lg">Créez votre compte patient</p>
          <div className="flex items-center justify-center gap-2 mt-3 text-slate-500">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm">Plateforme sécurisée</span>
            <Heart className="h-4 w-4 text-green-500" />
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl transform transition-all duration-300 hover:shadow-3xl border border-white/20 overflow-hidden animate-fade-in-up animation-delay-200">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none"></div>
          
          <CardHeader className="space-y-1 pb-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-t-lg relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-transparent"></div>
            <CardTitle className="text-2xl font-bold text-center text-slate-900 flex items-center justify-center gap-3 relative z-10">
              <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              Inscription Patient
              <Sparkles className="h-5 w-5 text-green-500 opacity-70" />
            </CardTitle>
            <CardDescription className="text-center text-slate-600 relative z-10 text-base">
              Rejoignez notre plateforme de soins dentaires
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 relative">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Message de succès ou d'erreur global amélioré */}
              {registrationMessage && (
                <div
                  className={`p-4 rounded-xl text-center text-sm font-medium transition-all duration-300 animate-fade-in ${
                    isSuccess
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 shadow-sm"
                      : "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isSuccess ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                    {registrationMessage}
                  </div>
                </div>
              )}

              {/* Nom et Prénom améliorés */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="prenom"
                    className="text-slate-700 font-medium flex items-center gap-1"
                  >
                    Prénom *
                    {isFieldValid("prenom") && (
                      <CheckCircle className="h-3 w-3 text-green-500 animate-pulse" />
                    )}
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors z-10" />
                    <Input
                      id="prenom"
                      name="prenom"
                      type="text"
                      placeholder="Votre prénom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 transition-all duration-200 relative ${
                        errors.prenom
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                          : isFieldValid("prenom")
                          ? "border-green-500 focus-visible:ring-green-500 bg-green-50 shadow-sm"
                          : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400 hover:shadow-sm"
                      }`}
                    />
                  </div>
                  {errors.prenom && (
                    <p className="text-sm text-red-600 animate-pulse flex items-center gap-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      {errors.prenom}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="nom"
                    className="text-slate-700 font-medium flex items-center gap-1"
                  >
                    Nom *
                    {isFieldValid("nom") && (
                      <CheckCircle className="h-3 w-3 text-green-500 animate-pulse" />
                    )}
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors z-10" />
                    <Input
                      id="nom"
                      name="nom"
                      type="text"
                      placeholder="Votre nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 transition-all duration-200 relative ${
                        errors.nom
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                          : isFieldValid("nom")
                          ? "border-green-500 focus-visible:ring-green-500 bg-green-50 shadow-sm"
                          : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400 hover:shadow-sm"
                      }`}
                    />
                  </div>
                  {errors.nom && (
                    <p className="text-sm text-red-600 animate-pulse flex items-center gap-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      {errors.nom}
                    </p>
                  )}
                </div>
              </div>

              {/* Email amélioré */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-slate-700 font-medium flex items-center gap-1"
                >
                  Adresse email *
                  {isFieldValid("email") && (
                    <CheckCircle className="h-3 w-3 text-green-500 animate-pulse" />
                  )}
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors z-10" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 h-11 transition-all duration-200 relative ${
                      errors.email
                        ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                        : isFieldValid("email")
                        ? "border-green-500 focus-visible:ring-green-500 bg-green-50 shadow-sm"
                        : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400 hover:shadow-sm"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 animate-pulse flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Téléphone et Âge améliorés */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="telephone"
                    className="text-slate-700 font-medium flex items-center gap-1"
                  >
                    Téléphone *
                    {isFieldValid("telephone") && (
                      <CheckCircle className="h-3 w-3 text-green-500 animate-pulse" />
                    )}
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors z-10" />
                    <Input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      placeholder="01 23 45 67 89"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 transition-all duration-200 relative ${
                        errors.telephone
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                          : isFieldValid("telephone")
                          ? "border-green-500 focus-visible:ring-green-500 bg-green-50 shadow-sm"
                          : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400 hover:shadow-sm"
                      }`}
                    />
                  </div>
                  {errors.telephone && (
                    <p className="text-sm text-red-600 animate-pulse flex items-center gap-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      {errors.telephone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="age"
                    className="text-slate-700 font-medium flex items-center gap-1"
                  >
                    Âge *
                    {isFieldValid("age") && (
                      <CheckCircle className="h-3 w-3 text-green-500 animate-pulse" />
                    )}
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors z-10" />
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Votre âge"
                      min="16"
                      max="120"
                      value={formData.age}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 transition-all duration-200 relative ${
                        errors.age
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                          : isFieldValid("age")
                          ? "border-green-500 focus-visible:ring-green-500 bg-green-50 shadow-sm"
                          : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400 hover:shadow-sm"
                      }`}
                    />
                  </div>
                  {errors.age && (
                    <p className="text-sm text-red-600 animate-pulse flex items-center gap-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      {errors.age}
                    </p>
                  )}
                </div>
              </div>

              {/* Mot de passe amélioré */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium flex items-center gap-1"
                >
                  Mot de passe *
                  {isFieldValid("password") && (
                    <CheckCircle className="h-3 w-3 text-green-500 animate-pulse" />
                  )}
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors z-10" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 caractères"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 h-11 transition-all duration-200 relative ${
                      errors.password
                        ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                        : isFieldValid("password")
                        ? "border-green-500 focus-visible:ring-green-500 bg-green-50 shadow-sm"
                        : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400 hover:shadow-sm"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors z-10 p-1 rounded-lg hover:bg-slate-100"
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

              {/* Confirmation mot de passe améliorée */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-slate-700 font-medium flex items-center gap-1"
                >
                  Confirmer le mot de passe *
                  {isFieldValid("confirmPassword") && (
                    <CheckCircle className="h-3 w-3 text-green-500 animate-pulse" />
                  )}
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors z-10" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 h-11 transition-all duration-200 relative ${
                      errors.confirmPassword
                        ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                        : isFieldValid("confirmPassword")
                        ? "border-green-500 focus-visible:ring-green-500 bg-green-50 shadow-sm"
                        : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400 hover:shadow-sm"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors z-10 p-1 rounded-lg hover:bg-slate-100"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 animate-pulse flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Bouton amélioré */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isLoading ? (
                  <div className="flex items-center gap-2 relative z-10">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Création en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2 relative z-10">
                    <UserPlus className="h-4 w-4" />
                    Créer mon compte patient
                    <Sparkles className="h-4 w-4 opacity-70" />
                  </div>
                )}
              </Button>

              {/* Section sécurité améliorée */}
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 shadow-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium">
                  Vos données médicales sont sécurisées et confidentielles
                </span>
                <Heart className="h-4 w-4 text-green-500" />
              </div>

              {/* Lien connexion amélioré */}
              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Vous avez déjà un compte ?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-green-600 hover:text-green-700 transition-colors hover:underline"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer amélioré */}
        <div className="text-center mt-8 text-sm text-slate-500 space-y-3 animate-fade-in-up animation-delay-400">
          <p className="font-medium">En créant un compte, vous acceptez nos conditions d'utilisation</p>
          <div className="flex justify-center items-center gap-4">
            <Link
              to="/terms"
              className="hover:text-slate-700 transition-colors hover:underline"
            >
              Conditions
            </Link>
            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
            <Link
              to="/privacy"
              className="hover:text-slate-700 transition-colors hover:underline"
            >
              Confidentialité
            </Link>
            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
            <Link
              to="/support"
              className="hover:text-slate-700 transition-colors hover:underline"
            >
              Support
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
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
          from { opacity: 0; }
          to { opacity: 1; }
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
