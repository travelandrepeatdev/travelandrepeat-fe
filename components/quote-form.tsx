"use client";

import type React from "react";
import { useEffect, useRef } from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import axios from "axios";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const successMessageRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    // Información del Cliente
    completeName: "",
    email: "",
    phone: "",
    countryCity: "",
    // Información del Viaje
    destiny: "",
    outDate: "",
    returnDate: "",
    areDatesFlexible: "false",
    // Presupuesto & Prioridades
    budget: "",
    levelType: "estandar",
    priority: "comodidad",
    // Viajeros
    totalTravelers: "",
    totalAdults: "",
    totalMinors: "",
    minorsAges: "",
    areBabiesTraveling: "false",
    // Preferencias de Viaje
    tripType: "",
    tripTheme: "",
    // Comentarios
    comments: "",
    recaptchaToken: ""
  });

  const isCommentsRequired = formData.tripType === "paquete-completo" || formData.tripType === "solo-tickets"

  const commentsPlaceholder = isCommentsRequired
    ? "Ej: Celebración de aniversario, necesidades especiales, actividades específicas deseadas... Especifica cuántos días parques Disney y cuantos días parques Universal Studios."
    : "Ej: Celebración de aniversario, necesidades especiales, actividades específicas deseadas..."

  useEffect(() => {
    if (submitted && successMessageRef.current) {
      const elementTop = successMessageRef.current.offsetTop
      const offset = 100 // Espacio desde el top (puedes ajustarlo)

      window.scrollTo({
        top: elementTop - offset,
        behavior: "smooth",
      })
    }
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      if (!siteKey) {
        console.log("Error al obtener el recaptcha");
        throw new Error("Configuración de seguridad incompleta")
      }

      const recaptchaToken = await new Promise<string>((resolve, reject) => {
        if (typeof window !== "undefined" && window.grecaptcha) {
          window.grecaptcha.ready(() => {
            window.grecaptcha.execute(siteKey, { action: "submit_quote" }).then(resolve).catch(reject)
          })
        } else {
          console.log("Sistema de verificación no disponible");
          reject(new Error("Sistema de verificación no disponible"))
        }
      })

      const response = await axios.post(apiBaseUrl + "/api/mail/sendQuotationForm", {
          ...formData,
          recaptchaToken,
      })

      // errors logged in backend side
      if (response.status === 403 || response.status === 500) {
        setError(response?.data?.message || "Error de servidor al enviar la cotización");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error al enviar cotización:", err)
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al enviar la cotización");
      } else {
        setError(err instanceof Error ? err.message : "Error al enviar la cotización");
      }
    } finally {
      setIsLoading(false)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <Card ref={successMessageRef} className="mx-auto max-w-2xl border-primary/20 bg-primary/5">
        <CardContent className="pt-12 pb-12 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
          <h3 className="font-serif text-2xl font-bold text-primary mb-4">
            ¡Cotización enviada exitosamente!
          </h3>
          <p className="text-muted-foreground mb-6 text-pretty">
            Gracias por confiar en nosotros. Uno de nuestros agentes
            especializados revisará tu solicitud y te contactará en las próximas
            24 horas con una propuesta personalizada.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                completeName: "",
                email: "",
                phone: "",
                countryCity: "",
                destiny: "",
                outDate: "",
                returnDate: "",
                areDatesFlexible: "false",
                budget: "",
                levelType: "estandar",
                priority: "comodidad",
                totalTravelers: "",
                totalAdults: "",
                totalMinors: "",
                minorsAges: "",
                areBabiesTraveling: "false",
                tripType: "",
                tripTheme: "",
                comments: "",
                recaptchaToken: ""
              });
            }}
            className="bg-primary hover:bg-primary/90"
          >
            Enviar otra cotización
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información del Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-primary">
            1. Información del Cliente
          </CardTitle>
          <CardDescription>
            Datos de contacto para comunicarnos contigo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="completeName">Nombre completo *</Label>
              <Input
                id="completeName"
                name="completeName"
                value={formData.completeName}
                onChange={handleChange}
                required
                placeholder="Ej: María González"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ejemplo@correo.com"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+52 123 456 7890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countryCity">País / Ciudad de residencia</Label>
              <Input
                id="countryCity"
                name="countryCity"
                value={formData.countryCity}
                onChange={handleChange}
                placeholder="Ej: México, Ciudad de México"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información del Viaje */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-primary">
            2. Información del Viaje
          </CardTitle>
          <CardDescription>Detalles de tu viaje soñado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destiny">Destino o destinos deseados *</Label>
            <Input
              id="destiny"
              name="destiny"
              value={formData.destiny}
              onChange={handleChange}
              required
              placeholder="Ej: Orlando, Disney World"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="outDate">Fecha de salida *</Label>
              <Input
                id="outDate"
                name="outDate"
                type="date"
                value={formData.outDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="returnDate">Fecha de regreso *</Label>
              <Input
                id="returnDate"
                name="returnDate"
                type="date"
                value={formData.returnDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="areDatesFlexible">¿Fechas flexibles?</Label>
            <select
              id="areDatesFlexible"
              name="areDatesFlexible"
              value={formData.areDatesFlexible}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="false">No</option>
              <option value="true">Sí</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Presupuesto & Prioridades */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-primary">
            3. Presupuesto y Prioridades
          </CardTitle>
          <CardDescription>
            Ayúdanos a personalizar tu experiencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Presupuesto total aproximado</Label>
            <Input
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Ej: $50,000 - $80,000 MXN"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="levelType">Nivel de alojamiento</Label>
            <select
              id="levelType"
              name="levelType"
              value={formData.levelType}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="economico">Económico</option>
              <option value="estandar">Estándar</option>
              <option value="lujo">Lujo</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Prioridad del viaje</Label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="precio">Precio</option>
              <option value="comodidad">Comodidad</option>
              <option value="experiencia">Experiencia</option>
              <option value="rapidez">Rapidez</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Viajeros */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-primary">
            4. Información de Viajeros
          </CardTitle>
          <CardDescription>¿Quiénes viajarán?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="totalTravelers">Número total de viajeros *</Label>
              <Input
                id="totalTravelers"
                name="totalTravelers"
                type="number"
                min="1"
                value={formData.totalTravelers}
                onChange={handleChange}
                required
                placeholder="Ej: 4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalAdults">Número de adultos *</Label>
              <Input
                id="totalAdults"
                name="totalAdults"
                type="number"
                min="0"
                value={formData.totalAdults}
                onChange={handleChange}
                required
                placeholder="Ej: 2"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="totalMinors">Número de menores</Label>
              <Input
                id="totalMinors"
                name="totalMinors"
                type="number"
                min="0"
                value={formData.totalMinors}
                onChange={handleChange}
                placeholder="Ej: 2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minorsAges">Edades de los menores</Label>
              <Input
                id="minorsAges"
                name="minorsAges"
                value={formData.minorsAges}
                onChange={handleChange}
                placeholder="Ej: 8 y 12 años"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="areBabiesTraveling">¿Viajan bebés?</Label>
            <select
              id="areBabiesTraveling"
              name="areBabiesTraveling"
              value={formData.areBabiesTraveling}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="false">No</option>
              <option value="true">Sí</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Preferencias de Viaje */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-primary">
            5. Preferencias de Viaje
          </CardTitle>
          <CardDescription>Personaliza tu experiencia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tripType">Tipo de viaje *</Label>
            <select
              id="tripType"
              name="tripType"
              value={formData.tripType}
              onChange={handleChange}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Seleccionar...</option>
              <option value="paquete-completo">Paquete completo</option>
              <option value="solo-tickets">Solo tickets</option>
              <option value="solo-hotel">Solo hotel</option>
              <option value="crucero">Crucero</option>
              <option value="tours">Tours</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tripTheme">Temática del viaje *</Label>
            <select
              id="tripTheme"
              name="tripTheme"
              value={formData.tripTheme}
              onChange={handleChange}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Seleccionar...</option>
              <option value="disney-universal">Disney / Universal</option>
              <option value="playa">Playa</option>
              <option value="aventura">Aventura</option>
              <option value="cultural">Cultural</option>
              <option value="romantico">Romántico</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Comentarios adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-primary">
            6. Comentarios Adicionales
          </CardTitle>
          <CardDescription>Cuéntanos más sobre tu viaje ideal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="comments">Especificaciones especiales {isCommentsRequired && "*"}</Label>
            <Textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              required={isCommentsRequired}
              placeholder={commentsPlaceholder}
              rows={6}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Botón de envío */}
      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-12 py-6 h-auto"
        >
          Solicitar Cotización
        </Button>
      </div>
    </form>
  );
}
