// "use client";

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import {
//   Eye,
//   EyeOff,
//   UserPlus,
//   User,
//   Mail,
//   Lock,
//   Phone,
//   Calendar,
//   Shield,
//   CheckCircle,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// export default function Register() {
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     prenom: "",
//     nom: "",
//     email: "",
//     telephone: "",
//     age: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [registrationMessage, setRegistrationMessage] = useState("");
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.prenom.trim()) {
//       newErrors.prenom = "Le prénom est requis";
//     }

//     if (!formData.nom.trim()) {
//       newErrors.nom = "Le nom est requis";
//     }

//     // Validation email selon votre schéma Mongoose
//     if (!formData.email.trim()) {
//       newErrors.email = "Veuillez ajouter une adresse email";
//     } else if (
//       !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
//     ) {
//       newErrors.email = "Veuillez ajouter une adresse email valide";
//     }

//     if (!formData.telephone.trim()) {
//       newErrors.telephone = "Le téléphone est requis";
//     }

//     // Validation de l'âge
//     if (!formData.age.trim()) {
//       newErrors.age = "L'âge est requis";
//     } else {
//       const age = Number.parseInt(formData.age);
//       if (isNaN(age) || age < 16 || age > 120) {
//         newErrors.age = "L'âge doit être entre 16 et 120 ans";
//       }
//     }

//     // Validation mot de passe selon votre schéma
//     if (!formData.password) {
//       newErrors.password = "Veuillez ajouter un mot de passe";
//     } else if (formData.password.length < 6) {
//       newErrors.password =
//         "Le mot de passe doit contenir au moins 6 caractères";
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Données pour userSchema (patient)
//       const registrationData = {
//         email: formData.email.toLowerCase().trim(),
//         password: formData.password,
//         role: "patient",
//         // Données supplémentaires du patient
//         prenom: formData.prenom.trim(),
//         nom: formData.nom.trim(),
//         telephone: formData.telephone.trim(),
//         age: Number.parseInt(formData.age),
//       };

//       console.log("Données d'inscription patient:", registrationData);
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/register", // TRÈS IMPORTANT : Vérifiez que cette URL est correcte !
//         registrationData
//       );

//       setRegistrationMessage(
//         response.data.message || "Inscription réussie ! Redirection..."
//       );
//       setIsSuccess(true);

//       // Optionnel: Réinitialiser le formulaire après succès
//       setFormData({
//         prenom: "",
//         nom: "",
//         email: "",
//         telephone: "",
//         age: "",
//         password: "",
//         confirmPassword: "",
//       });
//       setErrors({});

//       // Redirection après un court délai pour que l'utilisateur voie le message
//       setTimeout(() => {
//         navigate("/login"); // Redirige vers la page de connexion en utilisant React Router DOM
//       }, 2000); // Redirige après 2 secondes
//     } catch (error) {
//       console.error("Erreur lors de l'inscription:", error);
//       let errorMessage = "Échec de l'inscription. Veuillez réessayer.";

//       if (error.response) {
//         errorMessage = error.response.data.message || errorMessage;
//         console.error("Détails de l'erreur du backend:", error.response.data);
//       } else if (error.request) {
//         errorMessage = "Aucune réponse du serveur. Vérifiez votre connexion.";
//       } else {
//         errorMessage = "Erreur inattendue lors de l'envoi de la requête.";
//       }

//       setRegistrationMessage(errorMessage);
//       setIsSuccess(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fonction pour vérifier si un champ est valide
//   const isFieldValid = (fieldName) => {
//     return formData[fieldName] && !errors[fieldName];
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-white flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Header avec logo */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-700 shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
//               <User className="h-8 w-8 text-white animate-pulse" />
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-slate-900 mb-2 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
//             Agenda Dentaire
//           </h1>
//           <p className="text-slate-600">Créez votre compte patient</p>
//         </div>

//         <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm transform transition-all duration-300 hover:shadow-3xl">
//           <CardHeader className="space-y-1 pb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
//             <CardTitle className="text-2xl font-bold text-center text-slate-900 flex items-center justify-center gap-2">
//               <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-full">
//                 <UserPlus className="h-5 w-5 text-white" />
//               </div>
//               Inscription Patient
//             </CardTitle>
//             <CardDescription className="text-center text-slate-600">
//               Rejoignez notre plateforme de soins dentaires
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Nom et Prénom */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="prenom"
//                     className="text-slate-700 font-medium flex items-center gap-1"
//                   >
//                     Prénom *
//                     {isFieldValid("prenom") && (
//                       <CheckCircle className="h-3 w-3 text-green-500" />
//                     )}
//                   </Label>
//                   <div className="relative group">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
//                     <Input
//                       id="prenom"
//                       name="prenom"
//                       type="text"
//                       placeholder="Votre prénom"
//                       value={formData.prenom}
//                       onChange={handleInputChange}
//                       className={`pl-10 h-11 transition-all duration-200 ${
//                         errors.prenom
//                           ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
//                           : isFieldValid("prenom")
//                           ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
//                           : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
//                       }`}
//                     />
//                   </div>
//                   {errors.prenom && (
//                     <p className="text-sm text-red-600 animate-pulse">
//                       {errors.prenom}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="nom"
//                     className="text-slate-700 font-medium flex items-center gap-1"
//                   >
//                     Nom *
//                     {isFieldValid("nom") && (
//                       <CheckCircle className="h-3 w-3 text-green-500" />
//                     )}
//                   </Label>
//                   <div className="relative group">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
//                     <Input
//                       id="nom"
//                       name="nom"
//                       type="text"
//                       placeholder="Votre nom"
//                       value={formData.nom}
//                       onChange={handleInputChange}
//                       className={`pl-10 h-11 transition-all duration-200 ${
//                         errors.nom
//                           ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
//                           : isFieldValid("nom")
//                           ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
//                           : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
//                       }`}
//                     />
//                   </div>
//                   {errors.nom && (
//                     <p className="text-sm text-red-600 animate-pulse">
//                       {errors.nom}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="email"
//                   className="text-slate-700 font-medium flex items-center gap-1"
//                 >
//                   Adresse email *
//                   {isFieldValid("email") && (
//                     <CheckCircle className="h-3 w-3 text-green-500" />
//                   )}
//                 </Label>
//                 <div className="relative group">
//                   <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="votre.email@exemple.com"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className={`pl-10 h-11 transition-all duration-200 ${
//                       errors.email
//                         ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
//                         : isFieldValid("email")
//                         ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
//                         : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
//                     }`}
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-sm text-red-600 animate-pulse">
//                     {errors.email}
//                   </p>
//                 )}
//               </div>

//               {/* Téléphone et Âge */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="telephone"
//                     className="text-slate-700 font-medium flex items-center gap-1"
//                   >
//                     Téléphone *
//                     {isFieldValid("telephone") && (
//                       <CheckCircle className="h-3 w-3 text-green-500" />
//                     )}
//                   </Label>
//                   <div className="relative group">
//                     <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
//                     <Input
//                       id="telephone"
//                       name="telephone"
//                       type="tel"
//                       placeholder="01 23 45 67 89"
//                       value={formData.telephone}
//                       onChange={handleInputChange}
//                       className={`pl-10 h-11 transition-all duration-200 ${
//                         errors.telephone
//                           ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
//                           : isFieldValid("telephone")
//                           ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
//                           : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
//                       }`}
//                     />
//                   </div>
//                   {errors.telephone && (
//                     <p className="text-sm text-red-600 animate-pulse">
//                       {errors.telephone}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="age"
//                     className="text-slate-700 font-medium flex items-center gap-1"
//                   >
//                     Âge *
//                     {isFieldValid("age") && (
//                       <CheckCircle className="h-3 w-3 text-green-500" />
//                     )}
//                   </Label>
//                   <div className="relative group">
//                     <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
//                     <Input
//                       id="age"
//                       name="age"
//                       type="number"
//                       placeholder="Votre âge"
//                       min="12"
//                       max="120"
//                       value={formData.age}
//                       onChange={handleInputChange}
//                       className={`pl-10 h-11 transition-all duration-200 ${
//                         errors.age
//                           ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
//                           : isFieldValid("age")
//                           ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
//                           : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
//                       }`}
//                     />
//                   </div>
//                   {errors.age && (
//                     <p className="text-sm text-red-600 animate-pulse">
//                       {errors.age}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Mot de passe */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="password"
//                   className="text-slate-700 font-medium flex items-center gap-1"
//                 >
//                   Mot de passe *
//                   {isFieldValid("password") && (
//                     <CheckCircle className="h-3 w-3 text-green-500" />
//                   )}
//                 </Label>
//                 <div className="relative group">
//                   <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Minimum 6 caractères"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className={`pl-10 pr-10 h-11 transition-all duration-200 ${
//                       errors.password
//                         ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
//                         : isFieldValid("password")
//                         ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
//                         : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4" />
//                     ) : (
//                       <Eye className="h-4 w-4" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-sm text-red-600 animate-pulse">
//                     {errors.password}
//                   </p>
//                 )}
//               </div>

//               {/* Confirmation mot de passe */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="confirmPassword"
//                   className="text-slate-700 font-medium flex items-center gap-1"
//                 >
//                   Confirmer le mot de passe *
//                   {isFieldValid("confirmPassword") && (
//                     <CheckCircle className="h-3 w-3 text-green-500" />
//                   )}
//                 </Label>
//                 <div className="relative group">
//                   <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
//                   <Input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder="Confirmez votre mot de passe"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     className={`pl-10 pr-10 h-11 transition-all duration-200 ${
//                       errors.confirmPassword
//                         ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
//                         : isFieldValid("confirmPassword")
//                         ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
//                         : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="h-4 w-4" />
//                     ) : (
//                       <Eye className="h-4 w-4" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="text-sm text-red-600 animate-pulse">
//                     {errors.confirmPassword}
//                   </p>
//                 )}
//               </div>

//               {/* Bouton d'inscription */}
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//                     Création en cours...
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <UserPlus className="h-4 w-4" />
//                     Créer mon compte patient
//                   </div>
//                 )}
//               </Button>

//               {/* Information patient */}
//               <div className="flex items-center justify-center gap-2 text-sm text-slate-500 bg-green-50 p-3 rounded-lg border border-green-200">
//                 <Shield className="h-4 w-4 text-green-600" />
//                 <span>
//                   Vos données médicales sont sécurisées et confidentielles
//                 </span>
//               </div>

//               {/* Lien vers connexion */}
//               <div className="text-center pt-4 border-t border-slate-200">
//                 <p className="text-sm text-slate-600">
//                   Vous avez déjà un compte ?{" "}
//                   <Link
//                     to="/login"
//                     className="font-medium text-green-600 hover:text-green-700 transition-colors hover:underline"
//                   >
//                     Se connecter
//                   </Link>
//                 </p>
//               </div>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Footer */}
//         <div className="text-center mt-8 text-sm text-slate-500 space-y-2">
//           <p>En créant un compte, vous acceptez nos conditions d'utilisation</p>
//           <div className="flex justify-center items-center gap-4">
//             <Link
//               to="/terms"
//               className="hover:text-slate-700 transition-colors"
//             >
//               Conditions
//             </Link>
//             <span>•</span>
//             <Link
//               href="/privacy"
//               className="hover:text-slate-700 transition-colors"
//             >
//               Confidentialité
//             </Link>
//             <span>•</span>
//             <a
//               href="/support"
//               className="hover:text-slate-700 transition-colors"
//             >
//               Support
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
        "http://localhost:5000/api/auth/register", // TRÈS IMPORTANT : Vérifiez que cette URL est correcte !
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header avec logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-700 shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <User className="h-8 w-8 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Agenda Dentaire
          </h1>
          <p className="text-slate-600">Créez votre compte patient</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm transform transition-all duration-300 hover:shadow-3xl">
          <CardHeader className="space-y-1 pb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-slate-900 flex items-center justify-center gap-2">
              <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-full">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              Inscription Patient
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Rejoignez notre plateforme de soins dentaires
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Message de succès ou d'erreur global */}
              {registrationMessage && (
                <div
                  className={`p-3 rounded-md text-center text-sm font-medium ${
                    isSuccess
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  {registrationMessage}
                </div>
              )}

              {/* Nom et Prénom */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="prenom"
                    className="text-slate-700 font-medium flex items-center gap-1"
                  >
                    Prénom *
                    {isFieldValid("prenom") && (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="prenom"
                      name="prenom"
                      type="text"
                      placeholder="Votre prénom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 transition-all duration-200 ${
                        errors.prenom
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                          : isFieldValid("prenom")
                          ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
                          : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
                      }`}
                    />
                  </div>
                  {errors.prenom && (
                    <p className="text-sm text-red-600 animate-pulse">
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
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="nom"
                      name="nom"
                      type="text"
                      placeholder="Votre nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 transition-all duration-200 ${
                        errors.nom
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                          : isFieldValid("nom")
                          ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
                          : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
                      }`}
                    />
                  </div>
                  {errors.nom && (
                    <p className="text-sm text-red-600 animate-pulse">
                      {errors.nom}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-slate-700 font-medium flex items-center gap-1"
                >
                  Adresse email *
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
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 animate-pulse">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="telephone"
                    className="text-slate-700 font-medium flex items-center gap-1"
                  >
                    Téléphone *
                    {isFieldValid("telephone") && (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      placeholder="01 23 45 67 89"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 transition-all duration-200 ${
                        errors.telephone
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                          : isFieldValid("telephone")
                          ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
                          : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
                      }`}
                    />
                  </div>
                  {errors.telephone && (
                    <p className="text-sm text-red-600 animate-pulse">
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
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                  </Label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Votre âge"
                      min="16" // Correction ici pour correspondre à la validation du backend si elle était à 16
                      max="120"
                      value={formData.age}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 transition-all duration-200 ${
                        errors.age
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                          : isFieldValid("age")
                          ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
                          : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
                      }`}
                    />
                  </div>
                  {errors.age && (
                    <p className="text-sm text-red-600 animate-pulse">
                      {errors.age}
                    </p>
                  )}
                </div>
              </div>

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
                    placeholder="Minimum 6 caractères"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 h-11 transition-all duration-200 ${
                      errors.password
                        ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                        : isFieldValid("password")
                        ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
                        : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
                    }`}
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
                  <p className="text-sm text-red-600 animate-pulse">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-slate-700 font-medium flex items-center gap-1"
                >
                  Confirmer le mot de passe *
                  {isFieldValid("confirmPassword") && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 h-11 transition-all duration-200 ${
                      errors.confirmPassword
                        ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                        : isFieldValid("confirmPassword")
                        ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
                        : "border-slate-300 focus-visible:ring-green-500 hover:border-green-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 animate-pulse">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Création en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Créer mon compte patient
                  </div>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 bg-green-50 p-3 rounded-lg border border-green-200">
                <Shield className="h-4 w-4 text-green-600" />
                <span>
                  Vos données médicales sont sécurisées et confidentielles
                </span>
              </div>

              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Vous avez déjà un compte ?{" "}
                  <Link // Utilisation de Link de React Router DOM
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

        <div className="text-center mt-8 text-sm text-slate-500 space-y-2">
          <p>En créant un compte, vous acceptez nos conditions d'utilisation</p>
          <div className="flex justify-center items-center gap-4">
            <Link // Utilisation de Link de React Router DOM
              to="/terms"
              className="hover:text-slate-700 transition-colors"
            >
              Conditions
            </Link>
            <span>•</span>
            <Link // Utilisation de Link de React Router DOM
              to="/privacy"
              className="hover:text-slate-700 transition-colors"
            >
              Confidentialité
            </Link>
            <span>•</span>
            <Link // Utilisation de Link de React Router DOM
              to="/support"
              className="hover:text-slate-700 transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
