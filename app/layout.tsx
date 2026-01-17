import type React from "react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
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
  title: "Travel & Repeat | Agente de Viajes Independiente y Experto en Disney / Universal Studios",
  description:
    "Agente de viajes independiente especializado en paquetes Disney, Universal Studios, cruceros, tours y eventos. Atención personalizada y pagos flexibles.",
  keywords:
    "viajes disney, paquetes disney orlando, paquetes disney con hotel y boletos, viaje a disney, paquetes universal studios orlando, paquetes universal con hotel, parques temáticos orlando, vacaciones en orlando, cruceros familiares, cruceros disney, agente de viajes disney, asesor viajes parques temáticos, planeación de vacaciones familiares, experto en viajes disney y universal, agente de viajes en guadalajara, agente de viajes en jalisco",
  icons: {
    icon: [
      {
        url: "/favico.png",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {

  return (
    <html lang="es" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
