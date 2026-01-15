import { Sparkles, Building2, Ship, Compass, CalendarCheck, Plane, Hotel } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const services = [
  {
    icon: Sparkles,
    title: "Paquetes Disney",
    description:
      "Experiencias mágicas en todos los parques Disney alrededor del mundo, con entradas, hospedaje y más.",
  },
  {
    icon: Building2,
    title: "Paquetes Universal Studios",
    description: "Aventuras inolvidables en Universal Orlando y Hollywood, incluyendo el Mundo Mágico de Harry Potter.",
  },
  {
    icon: Ship,
    title: "Cruceros",
    description: "Navega por los mares más hermosos con las mejores líneas navieras y paquetes todo incluido.",
  },
  {
    icon: Compass,
    title: "Tours",
    description: "Excursiones personalizadas y grupales adaptadas a tus intereses.",
  },
  {
    icon: CalendarCheck,
    title: "Reservaciones personalizadas",
    description: "Planificación completa de tu viaje con atención a cada detalle según tus preferencias.",
  },
  {
    icon: Hotel,
    title: "Hoteles",
    description: "Paquetes completos con los mejores precios en hospedaje de calidad certificada.",
  },
]

export function Services() {
  return (
    <section className="py-16 md:py-10">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
            Nuestros servicios
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Soluciones completas para cada tipo de viaje
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <Card
                key={idx}
                className="group border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
