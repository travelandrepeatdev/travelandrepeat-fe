import { Plane, Facebook, Instagram, MailIcon, Phone, MessageCircle } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container px-4 py-12 md:px-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 justify-items-start md:justify-items-center">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plane className="h-6 w-6 text-primary" />
              <span className="font-serif text-lg font-bold text-foreground">
                Travel & Repeat
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tu agente de viajes independiente especializado en crear
              experiencias inolvidables en Disney, Universal Studios y destinos
              alrededor del mundo.
            </p>
          </div>

          {/* Quick Links 
          <div>
            <h3 className="font-serif text-base font-semibold text-foreground mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Paquetes Disney
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Universal Studios
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Cruceros
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Tours y eventos
                </a>
              </li>
            </ul>
          </div>
          */}

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-base font-semibold text-foreground mb-4">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <a
                  href="tel:+523319127291"
                  className="hover:text-primary transition-colors"
                >
                  +52 33 1912 7291
                </a>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <a
                  href="https://wa.me/523319127291?text=Hola!%20Quisiera%20más%20información%20sobre%20los%20paquetes%20o%20viajes%2e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61560223352813"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/travel.and.repeat.by.eva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="mailto:lizy_901202@hotmail.com?subject=Consulta%20de%20Viajes%20Mágicos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <MailIcon className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>

          <div className="relative z-0 w-32 h-32 md:w-30 md:h-30">
            <Image
              src="/LOGO-EVA-CIRCULO-GOTA-DE-AGUA.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Travel & Repeat. Todos los derechos
            reservados.
          </p>
          {/* 
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">
              Políticas de privacidad
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Términos y condiciones
            </a>
          </div> 
          */}
        </div>
      </div>
    </footer>
  );
}
