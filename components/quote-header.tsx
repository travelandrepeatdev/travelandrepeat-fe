"use client";

import { Button } from "@/components/ui/button";
import { CastleIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CurrencyIndicator } from "./currency-indicator";


export function QuoteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <CastleIcon className="h-7 w-7 text-primary" />
          <span className="font-serif text-xl font-bold text-primary">
            Travel & Repeat
          </span>
        </Link>
        <CurrencyIndicator />
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Button>
        </Link>
      </div>
    </header>
  );
}
