import { QuoteHeader } from "@/components/quote-header"
import { QuoteForm } from "@/components/quote-form"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Solicitar Cotización - Travel & Repeat",
  description: "Solicita tu cotización personalizada para tu próximo viaje",
}

export default function QuotePage() {
  return (
    <div className="min-h-screen">
      <QuoteHeader />
      <main className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4 text-balance">
              Solicita tu cotización personalizada
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Completa el formulario y en un momento te contactaré con la mejor propuesta para tu viaje
            </p>
          </div>
          <QuoteForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
