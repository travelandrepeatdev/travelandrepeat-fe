import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, DollarSign, User } from "lucide-react"

const benefits = [
  {
    icon: DollarSign,
    title: "Sin compromiso",
    description: "Cotización gratuita sin obligación de compra",
  },
  {
    icon: User,
    title: "Agente dedicado",
    description: "Experto en tu destino de principio a fin",
  },
]

export function QuoteBenefits() {
  return (
    <div className="mt-16">
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-center text-primary mb-8">
        ¿Por qué reservar con nosotros?
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <Card key={index} className="text-center border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-serif font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{benefit.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
