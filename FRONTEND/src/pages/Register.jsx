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
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Overlay effects matching the colorful gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-blue-500/20"></div>
      
      {/* Floating elements matching the colorful scheme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-blue-300/10 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-indigo-300/10 rounded-full blur-xl animate-float"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
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
            Créez votre compte patient
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-white/80">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Plateforme sécurisée</span>
            <Heart className="h-4 w-4 text-pink-300" />
          </div>
        </div>

        {/* Enhanced Card with glass morphism matching the gradient */}
        <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden animate-fade-in-up animation-delay-200">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent"></div>
          
          <CardHeader className="space-y-1 pb-6 pt-8 relative">
            <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              Inscription Patient
              <Sparkles className="h-5 w-5 text-pink-300 opacity-70" />
            </CardTitle>
            <CardDescription className="text-center text-white/80 text-base">
              Rejoignez notre plateforme de soins dentaires
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pb-8 relative">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Enhanced error message */}
              {registrationMessage && (
                <div className={`p-4 text-sm ${isSuccess ? 'text-green-100 bg-green-500/20 border border-green-400/30' : 'text-red-100 bg-red-500/20 border border-red-400/30'} rounded-xl backdrop-blur-sm animate-shake`}>
                  <div className="flex items-center gap-2">
                    {isSuccess ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    )}
                    {registrationMessage}
                  </div>
                </div>
              )}

              {/* Enhanced Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="prenom" className="text-white font-medium text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Prénom *
                    {isFieldValid("prenom") && (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    )}
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 transition-colors group-focus-within:text-white" />
                      <Input
                        id="prenom"
                        name="prenom"
                        type="text"
                        placeholder="Votre prénom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        className={`pl-12 pr-4 py-3 h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/15 focus:border-white/40 focus:ring-0 focus:ring-offset-0 hover:bg-white/15 ${
                          errors.prenom
                            ? "border-red-400/50 bg-red-500/10"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                  {errors.prenom && (
                    <p className="text-sm text-red-300 flex items-center gap-2 animate-fade-in">
                      <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                      {errors.prenom}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="nom" className="text-white font-medium text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nom *
                    {isFieldValid("nom") && (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    )}
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 transition-colors group-focus-within:text-white" />
                      <Input
                        id="nom"
                        name="nom"
                        type="text"
                        placeholder="Votre nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        className={`pl-12 pr-4 py-3 h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/15 focus:border-white/40 focus:ring-0 focus:ring-offset-0 hover:bg-white/15 ${
                          errors.nom
                            ? "border-red-400/50 bg-red-500/10"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                  {errors.nom && (
                    <p className="text-sm text-red-300 flex items-center gap-2 animate-fade-in">
                      <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                      {errors.nom}
                    </p>
                  )}
                </div>
              </div>

              {/* Enhanced Email Input */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-medium text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Adresse email *
                  {isFieldValid("email") && (
                    <CheckCircle className="h-3 w-3 text-green-400" />
                  )}
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
                        errors.email
                          ? "border-red-400/50 bg-red-500/10"
                          : ""
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

              {/* Enhanced Phone and Age Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="telephone" className="text-white font-medium text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone *
                    {isFieldValid("telephone") && (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    )}
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 transition-colors group-focus-within:text-white" />
                      <Input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        placeholder="01 23 45 67 89"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className={`pl-12 pr-4 py-3 h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/15 focus:border-white/40 focus:ring-0 focus:ring-offset-0 hover:bg-white/15 ${
                          errors.telephone
                            ? "border-red-400/50 bg-red-500/10"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                  {errors.telephone && (
                    <p className="text-sm text-red-300 flex items-center gap-2 animate-fade-in">
                      <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                      {errors.telephone}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="age" className="text-white font-medium text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Âge *
                    {isFieldValid("age") && (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    )}
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 transition-colors group-focus-within:text-white" />
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="Votre âge"
                        min="16"
                        max="120"
                        value={formData.age}
                        onChange={handleInputChange}
                        className={`pl-12 pr-4 py-3 h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/15 focus:border-white/40 focus:ring-0 focus:ring-offset-0 hover:bg-white/15 ${
                          errors.age
                            ? "border-red-400/50 bg-red-500/10"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                  {errors.age && (
                    <p className="text-sm text-red-300 flex items-center gap-2 animate-fade-in">
                      <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                      {errors.age}
                    </p>
                  )}
                </div>
              </div>

              {/* Enhanced Password Input */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-white font-medium text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Mot de passe *
                  {isFieldValid("password") && (
                    <CheckCircle className="h-3 w-3 text-green-400" />
                  )}
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 transition-colors group-focus-within:text-white" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 caractères"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-12 pr-12 py-3 h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/15 focus:border-white/40 focus:ring-0 focus:ring-offset-0 hover:bg-white/15 ${
                        errors.password
                          ? "border-red-400/50 bg-red-500/10"
                          : ""
                      }`}
                      autoComplete="new-password"
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

              {/* Enhanced Confirm Password Input */}
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-white font-medium text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Confirmer le mot de passe *
                  {isFieldValid("confirmPassword") && (
                    <CheckCircle className="h-3 w-3 text-green-400" />
                  )}
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 transition-colors group-focus-within:text-white" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmez votre mot de passe"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-12 pr-12 py-3 h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/15 focus:border-white/40 focus:ring-0 focus:ring-offset-0 hover:bg-white/15 ${
                        errors.confirmPassword
                          ? "border-red-400/50 bg-red-500/10"
                          : ""
                      }`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-300 flex items-center gap-2 animate-fade-in">
                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                    {errors.confirmPassword}
                  </p>
                )}
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
                    Création en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-3 relative z-10">
                    <UserPlus className="h-5 w-5" />
                    Créer mon compte patient
                    <Sparkles className="h-4 w-4 opacity-70" />
                  </div>
                )}
              </Button>

              {/* Enhanced Information */}
              <div className="flex items-center justify-center gap-2 text-sm text-white/70 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
                <Shield className="h-4 w-4 text-white" />
                <span className="font-medium">
                  Vos données médicales sont sécurisées et confidentielles
                </span>
                <Heart className="h-4 w-4 text-pink-300" />
              </div>

              {/* Enhanced Registration Link */}
              <div className="text-center pt-6 border-t border-white/20">
                <p className="text-sm text-white/80">
                  Vous avez déjà un compte ?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-pink-200 hover:text-white transition-colors hover:underline"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Enhanced Footer */}
        <div className="text-center mt-8 text-white/80 animate-fade-in-up animation-delay-400">
          <div className="flex justify-center items-center gap-2 mb-3">
            <Shield className="h-4 w-4" />
            <p className="text-sm font-medium">Plateforme sécurisée • Données protégées</p>
            <Heart className="h-4 w-4 text-pink-300" />
          </div>
          <div className="flex justify-center items-center gap-6 mt-3">
            <Link
              to="/privacy"
              className="text-sm hover:text-white transition-colors hover:underline"
            >
              Confidentialité
            </Link>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <Link
              to="/support"
              className="text-sm hover:text-white transition-colors hover:underline"
            >
              Support
            </Link>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <Link
              to="/terms"
              className="text-sm hover:text-white transition-colors hover:underline"
            >
              Conditions
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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
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
