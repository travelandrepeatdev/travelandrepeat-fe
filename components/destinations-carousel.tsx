"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import type { Promotion } from "../app/app/lib/types";
import axios from "axios";

export function DestinationsCarousel() {
  const [destinations, setDestinations] = useState<(Promotion)[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState<(Promotion) | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(destinations.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const openDestinationDetails = (destination: Promotion) => {
    setSelectedDestination(destination);
    setIsDialogOpen(true);
  };

  const currentDestinations = destinations.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => { 
    const fetchPromotions = async () => {
      try {
        console.log("Promotions loaded");
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const { data } = await axios.get<Promotion[]>(`${apiBaseUrl}/promotions/promotionListActive`);
        
        if (data) {
          setDestinations(data);
        } else {
          console.error("Failed to get promotions");
        }

      } catch (err: any) {
        console.error("Failed to load promotions");
      }
    };
    fetchPromotions();
  }, []);

  return (
    <section className="py-16 md:py-10 bg-muted/30">
      <div className="container px-1 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
            Destinos y paquetes populares
          </h2>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentDestinations.map((destination) => (
              <Card
                key={destination.id}
                className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={destination.image_url || "/placeholder.svg"}
                      alt={destination.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-4 left-4 pointer-events-none">
                      <span className="text-white/30 font-bold text-lg md:text-xl transform -rotate-12 select-none">
                        Imagen Real
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-base font-semibold">
                      Desde ${destination.promo_price}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{destination.destination}</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                      {destination.title}
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors bg-transparent"
                      onClick={() => openDestinationDetails(destination)}
                    >
                      Más detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              className="rounded-full bg-transparent"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentPage
                      ? "w-8 bg-primary"
                      : "w-2 bg-border hover:bg-primary/50"
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              className="rounded-full bg-transparent"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            {selectedDestination && (
              <div className="overflow-y-auto overflow-x-hidden px-6 py-4">
                <DialogHeader className="space-y-2 mb-4">
                  <DialogTitle className="font-serif text-2xl break-words pr-8">
                    {selectedDestination.title}
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-2 text-base">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words overflow-wrap-anywhere">
                      {selectedDestination.destination}
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-lg aspect-video w-full">
                    <img
                      src={selectedDestination.image_url || "/placeholder.svg"}
                      alt={selectedDestination.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-4 left-4 pointer-events-none">
                      <span className="text-white/30 font-bold text-lg md:text-xl transform -rotate-12 select-none">
                        Imagen Real
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-purple-700 break-words">
                      Desde ${selectedDestination.promo_price} USD
                    </p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed break-words overflow-wrap-anywhere text-xs">
                    {selectedDestination.description}
                  </p>
                  <Link href="/cotizacion">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Solicitar cotización
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
