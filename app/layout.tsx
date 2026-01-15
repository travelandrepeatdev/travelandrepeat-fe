import type React from "react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// <CHANGE> Using Inter for body and Poppins for headings
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Travel & Repeat | Agente",
  description:
    "Agente de viajes independiente especializado en paquetes Disney, Universal Studios, cruceros, tours y eventos. Atención personalizada y pagos flexibles.",
  keywords:
    "viajes disney, paquetes disney orlando, paquetes disney con hotel y boletos, viaje a disney, paquetes universal studios orlando, paquetes universal con hotel, parques temáticos orlando, vacaciones en orlando, cruceros familiares, cruceros disney, agente de viajes disney, asesor viajes parques temáticos, planeación de vacaciones familiares, experto en viajes disney y universal, agente de viajes en guadalajara, agente de viajes en jalisco",
  icons: {
    icon: [
      {
        url: "/plane.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/plane.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/plane.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/plane.png",
  },
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {recaptchaSiteKey && (
          <script
            src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
            async
            defer
          />
        )}
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
