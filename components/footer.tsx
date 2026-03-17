"use client";

import {
  Plane,
  Facebook,
  Instagram,
  MailIcon,
  Phone,
  MessageCircle,
  CoinsIcon,
  DollarSignIcon,
  DollarSign,
  BadgeDollarSignIcon,
  CircleDollarSign,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <footer>
      <div className="container px-4 py-12 md:px-6 md:py-10">
        {!isLoginPage && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 justify-items-start md:justify-items-center">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plane className="h-6 w-6 text-primary" />
                <span className="font-serif text-lg font-bold text-foreground">
                  Travel & Repeat
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                Tu agente de viajes independiente especializado en crear
                experiencias inolvidables en Disney, Universal Studios y
                destinos alrededor del mundo.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="h-6 w-6 text-primary" />
                <span className="font-serif text-lg font-bold text-foreground">
                  Contacto
                </span>
              </div>

              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <a
                    href="tel:+523319127291"
                    className="hover:text-primary transition-colors"
                  >
                    +52 33 1912 7291
                  </a>
                </li>
                <li className="flex items-center gap-3 pt-2">
                  <a
                    href="https://wa.me/523319127291?text=Hola!%20Quisiera%20más%20información%20sobre%20los%20paquetes%20o%20viajes%2e."
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
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/travel.and.repeat.by.eva"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Instagram"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.914 4.914 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.913 4.913 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
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

            <div>
              <div className="flex items-center gap-2 mb-4">
                <CoinsIcon className="h-6 w-6 text-primary" />
                <span className="font-serif text-lg font-bold text-foreground">
                  Quisieras apoyarme?
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                Accede al siguiente enlace para apoyar mi trabajo o si solo gustas
                darme una pequeña propina. ¡Gracias! 😊
              </p>
              <div className="mt-4 justify-center text-xs text-muted-foreground hover:text-primary transition-colors">
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=HPQZBKVU7XLRE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CircleDollarSign className="h-5 w-5 text-primary inline-block mr-1" />
                  Donar con PayPal
                </a>
              </div>
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
        )}

        <div className="border-t border-border pt-8 flex flex-col items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Travel & Repeat. Jalisco, Mexico. Todos
            los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
