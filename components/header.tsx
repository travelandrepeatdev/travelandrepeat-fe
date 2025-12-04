"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, CastleIcon } from "lucide-react";
import { CurrencyIndicator } from "@/components/currency-indicator";
import Link from "next/link"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Contacto", href: "#contact" },
    { name: "Blog", href: "#", target: "_blank", disabled: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        
        <div className="flex items-center gap-2">
          <a href="#home" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <CastleIcon className="h-7 w-7 text-primary" />
            <span className="font-serif text-xl font-bold text-primary">Travel & Repeat</span>
          </a>

          <Button 
            //className="bg-primary hover:login-foreground text-primary-foreground hover:scale-105 hover:shadow-lg py-0 px-3"
            className="opacity-50 cursor-not-allowed py-0 px-3"
            style={{ margin: `20px`,}}
            >
            Login Agente
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 transition-all duration-500">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              target={link.target}
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

          <Button size="sm" 
            //className="bg-accent hover:bg-accent/90" 
            asChild
            className="opacity-50 cursor-not-allowed bg-accent hover:bg-accent/70 py-0 px-3"
            >
            <Link 
              onClick={ (event) => event.preventDefault() }
              href="/cotizacion">Formulario de cotización
            </Link>
          </Button>
          <CurrencyIndicator />
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
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
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                target={link.target}
                className={`text-sm font-medium transition-colors duration-300 ${
                  link.disabled
                    ? "text-foreground/30 cursor-not-allowed pointer-events-none"
                    : "text-foreground/80 hover:text-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            
            <Button size="sm" 
              //className="bg-accent hover:bg-accent/90 w-full"
              className="opacity-50 cursor-not-allowed bg-accent hover:bg-accent/70 w-full"
            >
              <Link 
                onClick={ (event) => event.preventDefault() }
                href="/cotizacion">Formulario de cotización
              </Link>
            </Button>

            <CurrencyIndicator />

          </nav>
        </div>
      )}
    </header>
  );
}
