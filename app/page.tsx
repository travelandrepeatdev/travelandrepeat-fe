import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { DestinationsCarousel } from "@/components/destinations-carousel"
import { Services } from "@/components/services"
import { Benefits } from "@/components/benefits"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <DestinationsCarousel />
        <Services />
        <Benefits />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
