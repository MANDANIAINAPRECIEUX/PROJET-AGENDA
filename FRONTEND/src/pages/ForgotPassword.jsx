"use client";

import { useState } from "react";
import { ArrowLeft, Mail, Send, Stethoscope } from "lucide-react";

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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("L'email est requis");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format d'email invalide");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsEmailSent(true);
    } catch (error) {
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-700 shadow-lg">
                <Send className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Email envoyé !
            </h1>
            <p className="text-slate-600">Vérifiez votre boîte de réception</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-slate-600">
                  Nous avons envoyé un lien de réinitialisation à{" "}
                  <span className="font-medium text-slate-900">{email}</span>
                </p>
                <p className="text-sm text-slate-500">
                  Si vous ne recevez pas l'email dans les prochaines minutes,
                  vérifiez votre dossier spam.
                </p>
                <div className="pt-4">
                  <a href="/login">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour à la connexion
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Mot de passe oublié
          </h1>
          <p className="text-slate-600">Réinitialisez votre mot de passe</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold text-center text-slate-900">
              Réinitialisation
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Entrez votre email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email professionnel
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-slate-300 focus-visible:ring-blue-500"
                    autoComplete="email"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Envoyer le lien
                  </div>
                )}
              </Button>

              <div className="text-center pt-4 border-t border-slate-200">
                <a
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium flex items-center justify-center gap-1"
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
