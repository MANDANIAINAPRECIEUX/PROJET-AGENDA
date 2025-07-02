

// "use client";

// import { useState } from "react";
// import {
//   Eye,
//   EyeOff,
//   UserPlus,
//   Stethoscope,
//   Mail,
//   Lock,
//   User,
//   Phone,
//   MapPin,
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
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

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

//     if (!formData.firstName.trim()) {
//       newErrors.firstName = "Le prénom est requis";
//     }

//     if (!formData.lastName.trim()) {
//       newErrors.lastName = "Le nom est requis";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "L'email est requis";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Format d'email invalide";
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = "Le téléphone est requis";
//     }

//     if (!formData.password) {
//       newErrors.password = "Le mot de passe est requis";
//     } else if (formData.password.length < 8) {
//       newErrors.password =
//         "Le mot de passe doit contenir au moins 8 caractères";
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

//     // Simulation d'une requête API
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       console.log("Données d'inscription:", formData);
//       // Ici vous ajouteriez votre logique d'inscription
//     } catch (error) {
//       console.error("Erreur lors de l'inscription:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Header avec logo */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
//               <Stethoscope className="h-8 w-8 text-white" />
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-slate-900 mb-2">
//             Agenda Dentaire
//           </h1>
//           <p className="text-slate-600">Créez votre compte professionnel</p>
//         </div>

//         <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
//           <CardHeader className="space-y-1 pb-4">
//             <CardTitle className="text-2xl font-bold text-center text-slate-900 flex items-center justify-center gap-2">
//               <UserPlus className="h-6 w-6 text-blue-600" />
//               Inscription
//             </CardTitle>
//             <CardDescription className="text-center text-slate-600">
//               Rejoignez notre plateforme de gestion dentaire
//             </CardDescription>
//           </CardHeader>

//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Nom et Prénom */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="firstName"
//                     className="text-slate-700 font-medium"
//                   >
//                     Prénom *
//                   </Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                     <Input
//                       id="firstName"
//                       name="firstName"
//                       type="text"
//                       placeholder="Votre prénom"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       className={`pl-10 ${
//                         errors.firstName
//                           ? "border-red-500 focus-visible:ring-red-500"
//                           : "border-slate-300 focus-visible:ring-blue-500"
//                       }`}
//                     />
//                   </div>
//                   {errors.firstName && (
//                     <p className="text-sm text-red-600">{errors.firstName}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="lastName"
//                     className="text-slate-700 font-medium"
//                   >
//                     Nom *
//                   </Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                     <Input
//                       id="lastName"
//                       name="lastName"
//                       type="text"
//                       placeholder="Votre nom"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       className={`pl-10 ${
//                         errors.lastName
//                           ? "border-red-500 focus-visible:ring-red-500"
//                           : "border-slate-300 focus-visible:ring-blue-500"
//                       }`}
//                     />
//                   </div>
//                   {errors.lastName && (
//                     <p className="text-sm text-red-600">{errors.lastName}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-slate-700 font-medium">
//                   Email professionnel *
//                 </Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="votre.email@exemple.com"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className={`pl-10 ${
//                       errors.email
//                         ? "border-red-500 focus-visible:ring-red-500"
//                         : "border-slate-300 focus-visible:ring-blue-500"
//                     }`}
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-sm text-red-600">{errors.email}</p>
//                 )}
//               </div>

//               {/* Téléphone */}
//               <div className="space-y-2">
//                 <Label htmlFor="phone" className="text-slate-700 font-medium">
//                   Téléphone *
//                 </Label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                   <Input
//                     id="phone"
//                     name="phone"
//                     type="tel"
//                     placeholder="01 23 45 67 89"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     className={`pl-10 ${
//                       errors.phone
//                         ? "border-red-500 focus-visible:ring-red-500"
//                         : "border-slate-300 focus-visible:ring-blue-500"
//                     }`}
//                   />
//                 </div>
//                 {errors.phone && (
//                   <p className="text-sm text-red-600">{errors.phone}</p>
//                 )}
//               </div>

//               {/* Adresse */}
//               <div className="space-y-2">
//                 <Label htmlFor="address" className="text-slate-700 font-medium">
//                   Adresse du cabinet
//                 </Label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                   <Input
//                     id="address"
//                     name="address"
//                     type="text"
//                     placeholder="Adresse de votre cabinet"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     className="pl-10 border-slate-300 focus-visible:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               {/* Mot de passe */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="password"
//                   className="text-slate-700 font-medium"
//                 >
//                   Mot de passe *
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Minimum 8 caractères"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className={`pl-10 pr-10 ${
//                       errors.password
//                         ? "border-red-500 focus-visible:ring-red-500"
//                         : "border-slate-300 focus-visible:ring-blue-500"
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4" />
//                     ) : (
//                       <Eye className="h-4 w-4" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-sm text-red-600">{errors.password}</p>
//                 )}
//               </div>

//               {/* Confirmation mot de passe */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="confirmPassword"
//                   className="text-slate-700 font-medium"
//                 >
//                   Confirmer le mot de passe *
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                   <Input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder="Confirmez votre mot de passe"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     className={`pl-10 pr-10 ${
//                       errors.confirmPassword
//                         ? "border-red-500 focus-visible:ring-red-500"
//                         : "border-slate-300 focus-visible:ring-blue-500"
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="h-4 w-4" />
//                     ) : (
//                       <Eye className="h-4 w-4" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="text-sm text-red-600">
//                     {errors.confirmPassword}
//                   </p>
//                 )}
//               </div>

//               {/* Bouton d'inscription */}
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 shadow-lg transition-all duration-200"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//                     Création en cours...
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <UserPlus className="h-4 w-4" />
//                     Créer mon compte
//                   </div>
//                 )}
//               </Button>

//               {/* Lien vers connexion */}
//               <div className="text-center pt-4 border-t border-slate-200">
//                 <p className="text-sm text-slate-600">
//                   Vous avez déjà un compte ?{" "}
//                   <a
//                     href="/login"
//                     className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
//                   >
//                     Se connecter
//                   </a>
//                 </p>
//               </div>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Footer */}
//         <div className="text-center mt-8 text-sm text-slate-500">
//           <p>En créant un compte, vous acceptez nos conditions d'utilisation</p>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client"

// import { useState } from "react"
// import { Eye, EyeOff, LogIn, Stethoscope, Mail, Lock, Shield, User, Crown } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// export default function Login() {
//   const [showPassword, setShowPassword] = useState(false)
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     role: "patient", // Rôle par défaut selon votre schéma
//     rememberMe: false,
//   })
//   const [errors, setErrors] = useState({})
//   const [isLoading, setIsLoading] = useState(false)

//   // Options de rôles selon votre schéma
//   const roleOptions = [
//     {
//       value: "patient",
//       label: "Patient",
//       icon: User,
//       description: "Accès patient",
//       color: "from-green-600 to-green-700",
//     },
//     {
//       value: "dentiste",
//       label: "Dentiste",
//       icon: Stethoscope,
//       description: "Espace professionnel",
//       color: "from-blue-600 to-blue-700",
//     },
//     {
//       value: "admin",
//       label: "Administrateur",
//       icon: Crown,
//       description: "Administration",
//       color: "from-purple-600 to-purple-700",
//     },
//   ]

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }))
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }))
//     }
//   }

//   const validateForm = () => {
//     const newErrors = {}

//     // Validation email selon votre schéma Mongoose
//     if (!formData.email.trim()) {
//       newErrors.email = "Veuillez ajouter une adresse email"
//     } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
//       newErrors.email = "Veuillez ajouter une adresse email valide"
//     }

//     // Validation mot de passe selon votre schéma
//     if (!formData.password) {
//       newErrors.password = "Veuillez ajouter un mot de passe"
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
//     }

//     // Validation du rôle
//     if (!["admin", "dentiste", "patient"].includes(formData.role)) {
//       newErrors.role = "Veuillez sélectionner un rôle valide"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       return
//     }

//     setIsLoading(true)

//     try {
//       // Simulation d'une requête API - remplacez par votre logique de connexion
//       await new Promise((resolve) => setTimeout(resolve, 1500))

//       // Préparer les données pour l'API (email en minuscules selon votre schéma)
//       const loginData = {
//         ...formData,
//         email: formData.email.toLowerCase().trim(),
//       }

//       console.log("Données de connexion:", loginData)

//       // Ici vous feriez votre appel API
//       // const response = await fetch('/api/auth/login', {
//       //   method: 'POST',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify(loginData)
//       // })

//       // Redirection selon le rôle après connexion réussie
//       switch (formData.role) {
//         case "admin":
//           // window.location.href = "/admin/dashboard"
//           console.log("Redirection vers admin dashboard")
//           break
//         case "dentiste":
//           // window.location.href = "/dentiste/dashboard"
//           console.log("Redirection vers dentiste dashboard")
//           break
//         case "patient":
//           // window.location.href = "/patient/dashboard"
//           console.log("Redirection vers patient dashboard")
//           break
//         default:
//           console.log("Rôle non reconnu")
//       }
//     } catch (error) {
//       console.error("Erreur lors de la connexion:", error)
//       setErrors({ general: "Erreur de connexion. Veuillez réessayer." })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const selectedRole = roleOptions.find((role) => role.value === formData.role)

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Header avec logo */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div
//               className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${selectedRole.color} shadow-lg transition-all duration-300`}
//             >
//               <selectedRole.icon className="h-8 w-8 text-white" />
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-slate-900 mb-2">Agenda Dentaire</h1>
//           <p className="text-slate-600">Accédez à votre espace {selectedRole.label.toLowerCase()}</p>
//         </div>

//         <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
//           <CardHeader className="space-y-1 pb-4">
//             <CardTitle className="text-2xl font-bold text-center text-slate-900 flex items-center justify-center gap-2">
//               <LogIn className="h-6 w-6 text-blue-600" />
//               Connexion
//             </CardTitle>
//             <CardDescription className="text-center text-slate-600">
//               Connectez-vous à votre compte {selectedRole.label.toLowerCase()}
//             </CardDescription>
//           </CardHeader>

//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Message d'erreur général */}
//               {errors.general && (
//                 <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
//                   {errors.general}
//                 </div>
//               )}

//               {/* Sélection du rôle */}
//               <div className="space-y-2">
//                 <Label className="text-slate-700 font-medium">Type de compte</Label>
//                 <div className="grid grid-cols-3 gap-2">
//                   {roleOptions.map((role) => {
//                     const IconComponent = role.icon
//                     return (
//                       <button
//                         key={role.value}
//                         type="button"
//                         onClick={() => setFormData((prev) => ({ ...prev, role: role.value }))}
//                         className={`p-3 rounded-lg border-2 transition-all duration-200 ${
//                           formData.role === role.value
//                             ? `border-blue-500 bg-blue-50 shadow-md`
//                             : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
//                         }`}
//                       >
//                         <div className="flex flex-col items-center space-y-1">
//                           <div
//                             className={`p-2 rounded-full bg-gradient-to-br ${role.color} ${
//                               formData.role === role.value ? "shadow-lg" : "opacity-70"
//                             }`}
//                           >
//                             <IconComponent className="h-4 w-4 text-white" />
//                           </div>
//                           <span
//                             className={`text-xs font-medium ${
//                               formData.role === role.value ? "text-blue-700" : "text-slate-600"
//                             }`}
//                           >
//                             {role.label}
//                           </span>
//                         </div>
//                       </button>
//                     )
//                   })}
//                 </div>
//                 {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-slate-700 font-medium">
//                   Adresse email
//                 </Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="votre.email@exemple.com"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className={`pl-10 ${
//                       errors.email
//                         ? "border-red-500 focus-visible:ring-red-500"
//                         : "border-slate-300 focus-visible:ring-blue-500"
//                     }`}
//                     autoComplete="email"
//                   />
//                 </div>
//                 {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
//               </div>

//               {/* Mot de passe */}
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-slate-700 font-medium">
//                   Mot de passe
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Minimum 6 caractères"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className={`pl-10 pr-10 ${
//                       errors.password
//                         ? "border-red-500 focus-visible:ring-red-500"
//                         : "border-slate-300 focus-visible:ring-blue-500"
//                     }`}
//                     autoComplete="current-password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//                 {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
//               </div>

//               {/* Options */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <input
//                     id="rememberMe"
//                     name="rememberMe"
//                     type="checkbox"
//                     checked={formData.rememberMe}
//                     onChange={handleInputChange}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
//                   />
//                   <Label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer">
//                     Se souvenir de moi
//                   </Label>
//                 </div>
//                 <a
//                   href="/forgot-password"
//                   className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
//                 >
//                   Mot de passe oublié ?
//                 </a>
//               </div>

//               {/* Bouton de connexion */}
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`w-full bg-gradient-to-r ${selectedRole.color} hover:opacity-90 text-white font-medium py-2.5 shadow-lg transition-all duration-200`}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//                     Connexion en cours...
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <LogIn className="h-4 w-4" />
//                     Se connecter en tant que {selectedRole.label}
//                   </div>
//                 )}
//               </Button>

//               {/* Séparateur */}
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t border-slate-200" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-white px-2 text-slate-500">Ou</span>
//                 </div>
//               </div>

//               {/* Connexion rapide pour professionnels */}
//               {(formData.role === "dentiste" || formData.role === "admin") && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors bg-transparent"
//                 >
//                   <Shield className="h-4 w-4 mr-2" />
//                   Connexion avec certificat professionnel
//                 </Button>
//               )}

//               {/* Lien vers inscription */}
//               <div className="text-center pt-4 border-t border-slate-200">
//                 <p className="text-sm text-slate-600">
//                   Vous n'avez pas encore de compte ?{" "}
//                   <a href="/register" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
//                     Créer un compte
//                   </a>
//                 </p>
//               </div>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Footer */}
//         <div className="text-center mt-8 text-sm text-slate-500">
//           <p>Connexion sécurisée • Données protégées</p>
//           <div className="flex justify-center items-center gap-4 mt-2">
//             <a href="/privacy" className="hover:text-slate-700 transition-colors">
//               Confidentialité
//             </a>
//             <span>•</span>
//             <a href="/support" className="hover:text-slate-700 transition-colors">
//               Support
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import {
  Eye,
  EyeOff,
  UserPlus,
  Stethoscope,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis"
    }

    // Validation email selon votre schéma Mongoose
    if (!formData.email.trim()) {
      newErrors.email = "Veuillez ajouter une adresse email"
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = "Veuillez ajouter une adresse email valide"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis"
    }

    // Validation de l'âge
    if (!formData.age.trim()) {
      newErrors.age = "L'âge est requis"
    } else {
      const age = Number.parseInt(formData.age)
      if (isNaN(age) || age < 16 || age > 120) {
        newErrors.age = "L'âge doit être entre 16 et 120 ans"
      }
    }

    // Validation mot de passe selon votre schéma
    if (!formData.password) {
      newErrors.password = "Veuillez ajouter un mot de passe"
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Préparer les données pour l'API (email en minuscules selon votre schéma)
      const registrationData = {
        ...formData,
        email: formData.email.toLowerCase().trim(),
        age: Number.parseInt(formData.age),
      }

      console.log("Données d'inscription:", registrationData)
      // Ici vous ajouteriez votre logique d'inscription
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour vérifier si un champ est valide
  const isFieldValid = (fieldName) => {
    return formData[fieldName] && !errors[fieldName]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header avec logo animé */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <Stethoscope className="h-8 w-8 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Agenda Dentaire
          </h1>
          <p className="text-slate-600">Créez votre compte professionnel</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm transform transition-all duration-300 hover:shadow-3xl">
          <CardHeader className="space-y-1 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-slate-900 flex items-center justify-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              Inscription
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Rejoignez notre plateforme de gestion dentaire
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-700 font-medium flex items-center gap-1">
                    Prénom *{isFieldValid("firstName") && <CheckCircle className="h-3 w-3 text-green-500" />}
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Votre prénom"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 transition-all duration-200 ${
                        errors.firstName
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                          : isFieldValid("firstName")
                            ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
                            : "border-slate-300 focus-visible:ring-blue-500 hover:border-blue-400"
                      }`}
                    />
                  </div>
                  {errors.firstName && <p className="text-sm text-red-600 animate-pulse">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-700 font-medium flex items-center gap-1">
                    Nom *{isFieldValid("lastName") && <CheckCircle className="h-3 w-3 text-green-500" />}
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Votre nom"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 transition-all duration-200 ${
                        errors.lastName
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                          : isFieldValid("lastName")
                            ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
                            : "border-slate-300 focus-visible:ring-blue-500 hover:border-blue-400"
                      }`}
                    />
                  </div>
                  {errors.lastName && <p className="text-sm text-red-600 animate-pulse">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium flex items-center gap-1">
                  Email professionnel *{isFieldValid("email") && <CheckCircle className="h-3 w-3 text-green-500" />}
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
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
                          : "border-slate-300 focus-visible:ring-blue-500 hover:border-blue-400"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600 animate-pulse">{errors.email}</p>}
              </div>

              {/* Téléphone et Âge */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium flex items-center gap-1">
                    Téléphone *{isFieldValid("phone") && <CheckCircle className="h-3 w-3 text-green-500" />}
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="01 23 45 67 89"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 transition-all duration-200 ${
                        errors.phone
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                          : isFieldValid("phone")
                            ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
                            : "border-slate-300 focus-visible:ring-blue-500 hover:border-blue-400"
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-600 animate-pulse">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-slate-700 font-medium flex items-center gap-1">
                    Âge *{isFieldValid("age") && <CheckCircle className="h-3 w-3 text-green-500" />}
                  </Label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Votre âge"
                      min="16"
                      max="120"
                      value={formData.age}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 transition-all duration-200 ${
                        errors.age
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
                          : isFieldValid("age")
                            ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
                            : "border-slate-300 focus-visible:ring-blue-500 hover:border-blue-400"
                      }`}
                    />
                  </div>
                  {errors.age && <p className="text-sm text-red-600 animate-pulse">{errors.age}</p>}
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium flex items-center gap-1">
                  Mot de passe *{isFieldValid("password") && <CheckCircle className="h-3 w-3 text-green-500" />}
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
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
                          : "border-slate-300 focus-visible:ring-blue-500 hover:border-blue-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600 animate-pulse">{errors.password}</p>}
              </div>

              {/* Confirmation mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium flex items-center gap-1">
                  Confirmer le mot de passe *
                  {isFieldValid("confirmPassword") && <CheckCircle className="h-3 w-3 text-green-500" />}
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
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
                          : "border-slate-300 focus-visible:ring-blue-500 hover:border-blue-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 animate-pulse">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Bouton d'inscription */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Création en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Créer mon compte
                  </div>
                )}
              </Button>

              {/* Sécurité */}
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Vos données sont sécurisées et chiffrées</span>
              </div>

              {/* Lien vers connexion */}
              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Vous avez déjà un compte ?{" "}
                  <a
                    href="/login"
                    className="font-medium text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                  >
                    Se connecter
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer amélioré */}
        <div className="text-center mt-8 text-sm text-slate-500 space-y-2">
          <p>En créant un compte, vous acceptez nos conditions d'utilisation</p>
          <div className="flex justify-center items-center gap-4">
            <a href="/terms" className="hover:text-slate-700 transition-colors">
              Conditions
            </a>
            <span>•</span>
            <a href="/privacy" className="hover:text-slate-700 transition-colors">
              Confidentialité
            </a>
            <span>•</span>
            <a href="/support" className="hover:text-slate-700 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
