"use client"

// import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react" // ArrowRight
import { CastleIcon } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-secondary/50 via-background to-accent/50">
      <div className="container px-4 py-20 md:py-20 md:px-6">
        <div className="mx-auto max-w-4xl text-center">

          <div className="mb-8 animate-scale-in flex justify-center leading-7 tracking-normal">
            <img
              src="/LOGO-EVA-CIRCULO.png"
              alt="Travel Repeat Logo"
              width={180}
              height={180}
              className="transition-transform duration-500 hover:scale-110"
            />
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Especialistas en experiencias mágicas</span>
          </div>

          {/* Variante A del Hero */}
          {/* <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance mb-6">
            Convierte tus sueños en{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              vacaciones inolvidables
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed mb-8">
            Expertos en paquetes Disney, Universal Studios, cruceros y más. Te acompañamos en cada paso para crear la
            experiencia perfecta.
          </p> */}
          <div>
            <CastleIcon className="inline-block h-20 w-20 text-primary animate-bounce" />
          </div>
          
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance mb-6">
            "En Construcción..."
            <br />
            🚧
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Estamos creando algo increíble para ti!
            </span>
          </h1>

          {/* 
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              Cotización personalizada
          </Button>
            
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 group">
              Cotizar mi viaje
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Ver destinos populares
            </Button> 
            
          </div>
          */}

          {/* Variante B del Hero (comentada) */}
          {/* 
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance mb-6">
            Vive la <span className="text-primary">magia</span> de viajar con{' '}
            <span className="text-accent">expertos</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed mb-8">
            Más de 10 años creando experiencias únicas en Disney, Universal y destinos alrededor del mundo. 
            Tu viaje perfecto comienza aquí.
          </p>
          */}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
    </section>
  )
}
