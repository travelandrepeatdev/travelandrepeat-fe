import { CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function About() {
  return (
    <section className="py-16 md:py-10">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="relative">

          <div className="relative z-10">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-6">
              Tu experto en viajes de ensueño
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              Con más de <span className="font-semibold text-foreground">10 años de experiencia</span> en la industria
              turística, me especializo en crear experiencias únicas para familias y viajeros que buscan vivir la magia
              de Disney, Universal Studios y los destinos más fascinantes del mundo.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              Mi pasión es convertir cada viaje en una aventura inolvidable, brindando atención personalizada y cuidando
              cada detalle para que solo te preocupes por disfrutar.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Agente certificado en destinos Disney y Universal</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Experto en planificación de cruceros y tours</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Más de 500 familias felices atendidas</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Asesoría en español e inglés</span>
              </div>
            </div>
          </div>

          </div>

          <Card className="overflow-hidden border-border/50">
            <CardContent className="p-0">
              <img src="/IMG_0188.PNG" alt="Agente de viajes profesional" className="w-full h-full object-cover" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
