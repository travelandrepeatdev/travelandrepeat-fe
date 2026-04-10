"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, CastleIcon } from "lucide-react";
import { CurrencyIndicator } from "./currency-indicator";
import Link from "next/link"
import { useIsMobile } from "./ui/use-mobile";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navLinks = [
    { name: "Contacto", href: "#contact", disabled: false },
    { name: "Blog", href: "/blogs", disabled: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        
        <div className="flex items-center gap-2">
          <a href="#home" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <CastleIcon className="h-7 w-7 text-primary" />
            <span className="font-serif text-xl font-bold text-primary">Travel & Repeat</span>
          </a>

          {isMobile ? (
            <Link href="/cotizacion">
              <Button style={{ marginRight: `20px`,}} className="bg-accent hover:bg-accent/90"><span>Formulario de cotización</span></Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button style={{ margin: `20px`,}} >Login Agente</Button>
            </Link>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 transition-all duration-500">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-300 ${
                  link.disabled
                    ? "text-foreground/30 cursor-not-allowed pointer-events-none"
                    : "text-foreground/80 hover:text-primary"
                }`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
              }}
            >
              {link.name}
            </a>
          ))}

          <Button size="sm" className="bg-accent hover:bg-accent/90" asChild>
            <Link href="/cotizacion">Formulario de cotización</Link>
          </Button>
          <CurrencyIndicator mobileMenuOpen={mobileMenuOpen} />
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border px-4 py-4 animate-fade-in-up">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className={`text-sm font-medium transition-colors duration-300 ${
                  link.disabled
                    ? "text-foreground/30 cursor-not-allowed pointer-events-none"
                    : "text-foreground/80 hover:text-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

            <Link href="/login">
            <Button size="sm" className="w-full">Login Agente</Button>
            </Link>

            <CurrencyIndicator mobileMenuOpen={mobileMenuOpen} />

          </nav>
        </div>
      )}
    </header>
  );
}
