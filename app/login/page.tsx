"use client";

import React, { use, useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CastleIcon, ArrowLeft, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { Footer } from "@/components/footer";
import { useAuth } from "../app/auth/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.post(apiBaseUrl + "/auth/login", {
        email,
        password,
      });

      const axiosError = new AxiosError();
      if (!response.data) {
        axiosError.message = "Usuario no encontrado";
        axiosError.code = "USER_NOT_FOUND";
        throw axiosError;
      } else {

        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          // Redirigir al dashboard o página principal del agente
          window.location.href = "/app";
        } else {
          axiosError.message = "Contraseña incorrecta. Intenta de nuevo.";
          axiosError.code = "INVALID_PASSWORD";
          throw axiosError;
        }

        if (!response.data.isActive) {
          axiosError.message = "Tu cuenta ha sido deshabilitada. Contacta al administrador.";
          axiosError.code = "ACCOUNT_DISABLED";
          throw axiosError;
        }
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.error || "Error al iniciar sesión";
        const errorCode = err.code;

        switch (errorCode) {
          case "USER_NOT_FOUND":
            setError("El usuario no existe. Verifica tu correo electrónico.");
            break;
          case "INVALID_PASSWORD":
            setError("Contraseña incorrecta. Intenta de nuevo.");
            break;
          case "ACCOUNT_DISABLED":
            setError("Tu cuenta ha sido deshabilitada. Contacta al administrador.");
            break;
          // case "TOO_MANY_ATTEMPTS":
          //   setError("Demasiados intentos fallidos. Intenta más tarde.");
          //   break;
          default:
            setError(errorMessage);
        }
      } else {
        setError("Error de conexión. Verifica tu conexión a internet.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#85DBD9]/30 via-background to-[#9473d4]/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <CastleIcon className="h-7 w-7 text-primary" />
            <span className="font-serif text-xl font-bold text-primary">
              Travel & Repeat
            </span>
          </Link>

          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <main className="container flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md border-border/50 shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <img src="/LOGO-EVA-CIRCULO.webp" alt="Travel Repeat Logo" />
            </div>
            <CardTitle className="font-serif text-2xl font-bold text-[var(--login-foreground)]">
              Portal de Agentes
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Ingresa tus credenciales para acceder al panel de administración
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="agente@travelandrepeat.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[var(--text-color-purple)] hover:text-primary transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Necesitas ayuda?{" "}
                <Link
                  href="mailto:travelandrepeatdev@gmail.com?subject=Acceso%20de%20Agente%20-%20Ayuda"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Contáctanos
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
