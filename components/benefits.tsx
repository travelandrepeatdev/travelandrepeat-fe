import { Heart, CreditCard, Award, Headphones, Shield, DollarSign } from "lucide-react"

const benefits = [
  {
    icon: Heart,
    title: "Atención personalizada",
    description: "Asesoría dedicada en cada etapa de tu viaje",
  },
  {
    icon: CreditCard,
    title: "Pagos flexibles",
    description: "Múltiples opciones de pago adaptadas a tu presupuesto",
  },
  {
    icon: Award,
    title: "Experiencia en destinos temáticos",
    description: "Años de especialización en Disney y Universal",
  },
  {
    icon: Headphones,
    title: "Asistencia durante todo el viaje",
    description: "Soporte 24/7 para cualquier necesidad",
  },
  {
    icon: Shield,
    title: "Reservas seguras",
    description: "Protección y garantía en todas tus reservaciones",
  },
  {
    icon: DollarSign,
    title: "Precios competitivos",
    description: "Las mejores tarifas del mercado garantizadas",
  },
]

export function Benefits() {
  return (
    <section className="py-16 md:py-10 bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Beneficios que nos hacen tu mejor opción para viajar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
