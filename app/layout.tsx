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
  title: "Travel & Repeat | Especialistas en Disney y Universal Studios",
  description:
    "Agente de viajes independiente especializado en paquetes Disney, Universal Studios, cruceros, tours y eventos. Atención personalizada y pagos flexibles.",
  keywords:
    "viajes disney, paquetes universal studios, cruceros, tours, agente viajes, vacaciones, orlando, parques temáticos",
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
