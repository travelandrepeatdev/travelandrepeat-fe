import { Button } from "@/components/ui/button"
import { MessageCircle, Facebook, Instagram, MailIcon } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="py-16 md:py-10 bg-gradient-to-br from-primary/50 via-background to-accent/50">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
            ¿Listo para comenzar tu aventura?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            Contáctame ahora y recibe una cotización personalizada sin compromiso. Estoy aquí para hacer realidad el
            viaje de tus sueños.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white text-lg px-8 w-full sm:w-auto group"
            >
              <a href="https://wa.me/523319127291?text=Hola!%20Quisiera%20más%20información%20sobre%20los%20paquetes%20o%20viajes%2e" target="_blank" className="flex items-center justify-center w-full h-full">
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
              </a>
            </Button>

            <Button size="lg" className="bg-[#1877F2] hover:bg-[#165ECC] text-white text-lg px-8 w-full sm:w-auto">
              <a href="https://www.facebook.com/profile.php?id=61560223352813" target="_blank" className="flex items-center justify-center w-full h-full">
              <Facebook className="mr-2 h-5 w-5" />
              Facebook
              </a>
            </Button>

            <Button
              size="lg"
              className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white text-lg px-8 w-full sm:w-auto"
            >
              <a href="https://www.instagram.com/travelrepeat.mx" target="_blank" className="flex items-center justify-center w-full h-full">
              <Instagram className="mr-2 h-5 w-5" />
              Instagram
              </a>
            </Button>
            
            <Button
              size="lg"
              className="bg-[#369694] hover:bg-[#12a9a2] text-white text-lg px-8 w-full sm:w-auto"
            >
              <a href="mailto:lizy_901202@hotmail.com?subject=Consulta%20de%20Viajes%20Mágicos" className="flex items-center justify-center w-full h-full">
              <MailIcon className="mr-2 h-5 w-5" />
              Email
              </a>
            </Button>
            
          </div>
        </div>
      </div>
    </section>
  )
}
