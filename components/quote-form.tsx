"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { set } from "date-fns"

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    // Información del Cliente
    nombreCompleto: "",
    email: "",
    telefono: "",
    paisCiudad: "",
    // Información del Viaje
    destino: "",
    fechaSalida: "",
    fechaRegreso: "",
    fechasFlexibles: "no",
    // Presupuesto & Prioridades
    presupuesto: "",
    nivelAlojamiento: "estandar",
    prioridad: "comodidad",
    // Viajeros
    numeroViajeros: "",
    numeroAdultos: "",
    numeroMenores: "",
    edadesMenores: "",
    viajanBebes: "no",
    // Preferencias de Viaje
    tipoViaje: "",
    tematica: "",
    aerolinea: "",
    traslados: "no",
    seguros: "no",
    // Comentarios
    comentarios: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      //const response = await fetch("/api/cotizacion", {
      const response = fetch("/api/cotizacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      //const data = await response.json()
      const data = response.then(res => res.json())

      if (!response) {
        throw new Error("Error al enviar la cotización")
      }

      console.log("Cotización enviada exitosamente:", data)
      setSubmitted(true)
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Error al enviar la cotización")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-2xl border-primary/20 bg-primary/5">
        <CardContent className="pt-12 pb-12 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
          <h3 className="font-serif text-2xl font-bold text-primary mb-4">¡Cotización enviada exitosamente!</h3>
          <p className="text-muted-foreground mb-6 text-pretty">
            Gracias por confiar en nosotros. Uno de nuestros agentes especializados revisará tu solicitud y te
            contactará en las próximas 24 horas con una propuesta personalizada.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false)
              setFormData({
                nombreCompleto: "",
                email: "",
                telefono: "",
                paisCiudad: "",
                destino: "",
                fechaSalida: "",
                fechaRegreso: "",
                fechasFlexibles: "no",
                presupuesto: "",
                nivelAlojamiento: "estandar",
                prioridad: "comodidad",
                numeroViajeros: "",
                numeroAdultos: "",
                numeroMenores: "",
                edadesMenores: "",
                viajanBebes: "no",
                tipoViaje: "",
                tematica: "",
                aerolinea: "",
                traslados: "no",
                seguros: "no",
                comentarios: "",
              })
            }}
            className="bg-primary hover:bg-primary/90"
          >
            Enviar otra cotización
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información del Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-primary">1. Información del Cliente</CardTitle>
          <CardDescription>Datos de contacto para comunicarnos contigo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombreCompleto">Nombre completo *</Label>
              <Input
                id="nombreCompleto"
                name="nombreCompleto"
                value={formData.nombreCompleto}
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
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                required
                placeholder="+52 123 456 7890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paisCiudad">País / Ciudad de residencia</Label>
              <Input
                id="paisCiudad"
                name="paisCiudad"
                value={formData.paisCiudad}
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
          <CardTitle className="font-serif text-2xl text-primary">2. Información del Viaje</CardTitle>
          <CardDescription>Detalles de tu viaje soñado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destino">Destino o destinos deseados *</Label>
            <Input
              id="destino"
              name="destino"
              value={formData.destino}
              onChange={handleChange}
              required
              placeholder="Ej: Orlando, Disney World"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fechaSalida">Fecha de salida *</Label>
              <Input
                id="fechaSalida"
                name="fechaSalida"
                type="date"
                value={formData.fechaSalida}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaRegreso">Fecha de regreso *</Label>
              <Input
                id="fechaRegreso"
                name="fechaRegreso"
                type="date"
                value={formData.fechaRegreso}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechasFlexibles">¿Fechas flexibles?</Label>
            <select
              id="fechasFlexibles"
              name="fechasFlexibles"
              value={formData.fechasFlexibles}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Presupuesto & Prioridades */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-primary">3. Presupuesto y Prioridades</CardTitle>
          <CardDescription>Ayúdanos a personalizar tu experiencia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="presupuesto">Presupuesto total aproximado</Label>
            <Input
              id="presupuesto"
              name="presupuesto"
              value={formData.presupuesto}
              onChange={handleChange}
              placeholder="Ej: $50,000 - $80,000 MXN"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nivelAlojamiento">Nivel de alojamiento</Label>
            <select
              id="nivelAlojamiento"
              name="nivelAlojamiento"
              value={formData.nivelAlojamiento}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="economico">Económico</option>
              <option value="estandar">Estándar</option>
              <option value="lujo">Lujo</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prioridad">Prioridad del viaje</Label>
            <select
              id="prioridad"
              name="prioridad"
              value={formData.prioridad}
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
          <CardTitle className="font-serif text-2xl text-primary">4. Información de Viajeros</CardTitle>
          <CardDescription>¿Quiénes viajarán?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="numeroViajeros">Número total de viajeros *</Label>
              <Input
                id="numeroViajeros"
                name="numeroViajeros"
                type="number"
                min="1"
                value={formData.numeroViajeros}
                onChange={handleChange}
                required
                placeholder="Ej: 4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroAdultos">Número de adultos *</Label>
              <Input
                id="numeroAdultos"
                name="numeroAdultos"
                type="number"
                min="0"
                value={formData.numeroAdultos}
                onChange={handleChange}
                required
                placeholder="Ej: 2"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="numeroMenores">Número de menores</Label>
              <Input
                id="numeroMenores"
                name="numeroMenores"
                type="number"
                min="0"
                value={formData.numeroMenores}
                onChange={handleChange}
                placeholder="Ej: 2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edadesMenores">Edades de los menores</Label>
              <Input
                id="edadesMenores"
                name="edadesMenores"
                value={formData.edadesMenores}
                onChange={handleChange}
                placeholder="Ej: 8 y 12 años"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="viajanBebes">¿Viajan bebés?</Label>
            <select
              id="viajanBebes"
              name="viajanBebes"
              value={formData.viajanBebes}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Preferencias de Viaje */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-primary">5. Preferencias de Viaje</CardTitle>
          <CardDescription>Personaliza tu experiencia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipoViaje">Tipo de viaje *</Label>
            <select
              id="tipoViaje"
              name="tipoViaje"
              value={formData.tipoViaje}
              onChange={handleChange}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Seleccionar...</option>
              <option value="paquete-completo">Paquete completo</option>
              <option value="solo-hotel">Solo hotel</option>
              <option value="crucero">Crucero</option>
              <option value="tours">Tours</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tematica">Temática del viaje *</Label>
            <select
              id="tematica"
              name="tematica"
              value={formData.tematica}
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
          <CardTitle className="font-serif text-2xl text-primary">6. Comentarios Adicionales</CardTitle>
          <CardDescription>Cuéntanos más sobre tu viaje ideal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="comentarios">Especificaciones especiales</Label>
            <Textarea
              id="comentarios"
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange}
              placeholder="Ej: Celebración de aniversario, necesidades especiales, actividades específicas deseadas, restricciones alimentarias..."
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
  )
}
