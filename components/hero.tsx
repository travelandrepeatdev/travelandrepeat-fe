"use client"

import { Sparkles, ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-secondary/50 via-background to-accent/50">
      <div className="container px-4 py-20 md:py-20 md:px-6">
        <div className="mx-auto max-w-4xl text-center">

          <div className="mb-8 animate-scale-in flex justify-center leading-7 tracking-normal">
            <img src="/LOGO-EVA-CIRCULO.png" alt="Travel Repeat Logo" width={180} height={180} className="transition-transform duration-500 hover:scale-110"/>
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Especialistas en experiencias mágicas</span>
          </div>

          {/* Variante A del Hero */}
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance mb-6">
            Convierte tus sueños en{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              vacaciones inolvidables
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed mb-8">
            Expertos en paquetes Disney, Universal Studios, cruceros y más. Te acompañamos en cada paso para crear la
            experiencia perfecta.
          </p>

        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
    </section>
  )
}
