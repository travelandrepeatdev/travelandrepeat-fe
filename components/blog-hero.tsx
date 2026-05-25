"use client";

import { BookOpen } from "lucide-react";

export function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary/50 via-background to-accent/50">
      <div className="container px-4 py-16 md:py-20 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 animate-scale-in flex justify-center">
            <img
              src="/LOGO-EVA-CIRCULO.webp"
              alt="Travel Repeat Logo"
              width={180}
              height={180}
              className="transition-transform duration-500 hover:scale-110"
            />
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
            <BookOpen className="h-4 w-4" />
            <span>Consejos y experiencias de viaje</span>
          </div>

          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance mb-6">
            Nuestro{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Blog
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            Descubre consejos de viaje, guias de destinos, y experiencias unicas
            que te ayudaran a planificar tu proxima aventura.
          </p>
        </div>
      </div>
      
    </section>
  );
}
