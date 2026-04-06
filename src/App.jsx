import { useState } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import VisionSection from './components/VisionSection'
import PortfolioSection from './components/PortfolioSection'
import CTASection from './components/CTASection'
import TeamSection from './components/TeamSection'
import Footer from './components/Footer'
import ContactFormModal from './components/ContactFormModal'

export default function App() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ overflowX: 'clip' }}>
        <Navbar onOpenContactForm={() => setIsContactFormOpen(true)} />
        <main>
          <HeroSection />
          <AboutSection />
          <VisionSection />
          <PortfolioSection />
          <TeamSection />
          <CTASection onOpenContactForm={() => setIsContactFormOpen(true)} />
        </main>
        <Footer />
        <ContactFormModal open={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} />
    </div>
  )
}
