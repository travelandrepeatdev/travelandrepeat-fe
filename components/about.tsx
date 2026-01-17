import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function About() {
  return (
    <section className="py-16 md:py-10">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="relative">
            <div className="relative z-10">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-6">
                Tu experto en viajes
              </h2>
              <p className="text-lg leading-relaxed mb-6">
                <span className="font-semibold text-foreground">
                Hola! 👋 soy Eva Elizabeth! 💁🏻‍♀️
               </span>
              </p>
              <p className="text-lg leading-relaxed mb-6">
                🎢 Agente de viajes con experiencia real, certificada por{" "}
                <span className="font-semibold text-foreground">
                  Disney y Universal
                </span>
                , me especializo en crear experiencias únicas para familias y viajeros que buscan explorar el mundo.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                He ayudado a personas con planeación clara y acompañamiento de principio a fin.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                💜 Viaja con confianza, tranquilidad y la seguridad de estar en manos de alguien que conoce y ama viajar.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">
                    Organización completa de viajes a medida
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">
                    Guías prácticas y recomendaciones reales de viajeros
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">
                    Uso de apps oficiales para optimizar tu experiencia
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">
                    Tips personalizados y consejos exclusivos para cada destino
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Foto principal */}
            <Card className="overflow-hidden border-border/50">
              <CardContent className="p-0">
                <img
                  src="/IMG_0188.webp"
                  alt="Agente de viajes profesional"
                  className="w-full h-full object-cover"
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1">
            {/* Grid de certificaciones */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/travel-certification-badge-1.webp"
                alt="Certificación 1"
                className="w-full transition-all duration-300 hover:scale-130 hover:rotate-2 hover:shadow-xl"
              />

              <img
                src="/travel-certification-badge-2.webp"
                alt="Certificación 2"
                className="w-full transition-all duration-300 hover:scale-130 hover:rotate-2 hover:shadow-xl"
              />

              <img
                src="/travel-certification-badge-3.webp"
                alt="Certificación 3"
                className="w-full transition-all duration-300 hover:scale-130 hover:rotate-2 hover:shadow-xl"
              />

              <img
                src="/travel-certification-badge-4.webp"
                alt="Certificación 4"
                className="w-full transition-all duration-300 hover:scale-130 hover:rotate-2 hover:shadow-xl"
              />

              <img
                src="/travel-certification-badge-5.webp"
                alt="Certificación 5"
                className="w-full transition-all duration-300 hover:scale-130 hover:rotate-2 hover:shadow-xl"
              />

              <img
                src="/travel-certification-badge-6.webp"
                alt="Certificación 6"
                className="w-full transition-all duration-300 hover:scale-130 hover:rotate-2 hover:shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
