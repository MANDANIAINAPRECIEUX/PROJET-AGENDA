"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft, Stethoscope } from "lucide-react";
import { useSearchParams } from "react-router-dom";

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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-blue-300 p-4">
        <Card className="max-w-md w-full shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold text-red-700">
              Token invalide ou expiré.
            </p>
            <a href="/forgot-password" className="text-blue-700 underline">
              Redemander un lien
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-blue-300 p-4">
        <Card className="max-w-md w-full shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardContent className="text-center p-6 space-y-4">
            <p className="text-purple-700 font-semibold text-lg">
               Mot de passe réinitialisé avec succès !
            </p>
            <a href="/login">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Réinitialisation de mot de passe
          </h1>
          <p className="text-slate-600">Entrez un nouveau mot de passe</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-bold text-slate-900">
              Nouveau mot de passe
            </CardTitle>
            <CardDescription className="text-slate-600">
              Créez un mot de passe sécurisé
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label>Nouveau mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    {showPwd ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRM PWD */}
              <div className="space-y-2">
                <Label>Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type={showConfirmPwd ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  >
                    {showConfirmPwd ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 shadow-lg"
              >
                {isLoading ? "Réinitialisation..." : "Réinitialiser"}
              </Button>

              <div className="text-center pt-4">
                <a
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour à la connexion
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
