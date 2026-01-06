"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";

const destinations = [
  {
    id: 1,
    name: "Walt Disney World",
    location: "Orlando, Florida",
    price: "1,299",
    image: "/disney-world-castle-magic-kingdom-sunset.jpg",
    description:
      "Experimenta la magia de Disney World con acceso a los 4 parques temáticos: Magic Kingdom, EPCOT, Hollywood Studios y Animal Kingdom. Incluye hotel y boletos de parque.",
  },
  {
    id: 2,
    name: "Universal Studios",
    location: "Orlando, Florida",
    price: "1,099",
    image: "/universal-studios-orlando-wizarding-world.jpg",
    description:
      "Vive la aventura en Universal Studios y Islands of Adventure. Incluye acceso al mundo mágico de Harry Potter, hotel y boletos multi-parque.",
  },
  {
    id: 3,
    name: "Disney Cruise Line",
    location: "Caribbean Islands, Europe & Alaska",
    price: "1,799",
    image: "/luxury-cruise-ship-caribbean-sea-sunset.jpg",
    description:
      "Navega por las aguas cristalinas del Caribe visitando múltiples islas. Todo incluido con comidas gourmet, entretenimiento y excursiones.",
  },
  {
    id: 4,
    name: "Disneyland California",
    location: "Anaheim, California",
    price: "1,199",
    image: "/disneyland-california-sleeping-beauty-castle.jpg",
    description:
      "Descubre donde comenzó la magia en Disneyland Park y Disney California Adventure. Incluye hotel en Anaheim y boletos de parque.",
  },
  {
    id: 5,
    name: "Universal Studios Hollywood",
    location: "Los Angeles, California",
    price: "899",
    image: "/water-park-slides-tropical-orlando.jpg",
    description:
      "Disfruta de los mejores parques acuáticos como Volcano Bay, Aquatica y los parques Disney. Diversión refrescante para toda la familia.",
  },
  {
    id: 6,
    name: "Paquete Todo Incluido",
    location: "Cancún, Puerto Vallarta - México",
    price: "1,499",
    image: "/cancun-resort-beach-turquoise-water.jpg",
    description:
      "Relájate en las playas de Cancún con paquete todo incluido. Resort de lujo, comidas ilimitadas, bebidas y actividades recreativas.",
  },
  {
    id: 7,
    name: "Viajes Internacionales",
    location: "Europa, Colombia, Perú, Japón, China...",
    price: "1,499",
    image: "/cancun-resort-beach-turquoise-water.jpg",
    description:
      "Relájate en las playas de Cancún con paquete todo incluido. Resort de lujo, comidas ilimitadas, bebidas y actividades recreativas.",
  },
  {
    id: 8,
    name: "Chepe Express",
    location: "Chihuahua - Los Mochis",
    price: "1,499",
    image: "/cancun-resort-beach-turquoise-water.jpg",
    description:
      "Relájate en las playas de Cancún con paquete todo incluido. Resort de lujo, comidas ilimitadas, bebidas y actividades recreativas.",
  },
];

export function DestinationsCarousel() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState<
    (typeof destinations)[0] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(destinations.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const openDestinationDetails = (destination: (typeof destinations)[0]) => {
    setSelectedDestination(destination);
    setIsDialogOpen(true);
  };

  const currentDestinations = destinations.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section className="py-16 md:py-10 bg-muted/30">
      <div className="container px-1 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
            Destinos y paquetes populares
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubre nuestras ofertas más solicitadas con precios especiales
          </p>
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
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-base font-semibold">
                      Desde ${destination.price}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{destination.location}</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                      {destination.name}
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
                    {selectedDestination.name}
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-2 text-base">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words overflow-wrap-anywhere">
                      {selectedDestination.location}
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-lg aspect-video w-full">
                    <img
                      src={selectedDestination.image || "/placeholder.svg"}
                      alt={selectedDestination.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-purple-700 break-words">
                      Desde ${selectedDestination.price} USD
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
