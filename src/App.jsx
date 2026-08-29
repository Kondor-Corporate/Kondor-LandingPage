import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import VisionSection from './components/VisionSection'
import PortfolioSection from './components/PortfolioSection'
import CTASection from './components/CTASection'
import TeamSection from './components/TeamSection'
import Footer from './components/Footer'
import ContactFormModal from './components/ContactFormModal'
import LegalModal from './components/LegalModal'

export default function App() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [legalType, setLegalType] = useState(null)

  return (
    <div className="min-h-screen overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Navbar onOpenContactForm={() => setIsContactFormOpen(true)} />
        <main>
          <HeroSection />
          <AboutSection />
          <VisionSection />
          <PortfolioSection />
          <TeamSection />
          <CTASection onOpenContactForm={() => setIsContactFormOpen(true)} />
        </main>
        <Footer onOpenLegal={(type) => setLegalType(type)} />
        <ContactFormModal open={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} />
        <LegalModal type={legalType} onClose={() => setLegalType(null)} />
      </motion.div>
    </div>
  )
}
