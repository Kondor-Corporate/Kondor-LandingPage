import { useEffect, useState } from 'react'
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
import { initAnalytics, initializeAttribution, trackLeadFormView, trackPageView } from './lib/analytics'

export default function App() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [contactFormOrigin, setContactFormOrigin] = useState(null)
  const [legalType, setLegalType] = useState(null)

  useEffect(() => {
    initializeAttribution()
    initAnalytics()
    if (!window.__kondorInitialPageViewTracked) {
      window.__kondorInitialPageViewTracked = true
      trackPageView()
    }
  }, [])

  const openContactForm = (origin) => {
    setContactFormOrigin(origin || null)
    setIsContactFormOpen(true)
    trackLeadFormView({
      form_id: 'contact_modal',
      cta_id: origin,
    })
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Navbar onOpenContactForm={openContactForm} />
        <main>
          <HeroSection />
          <AboutSection />
          <VisionSection />
          <PortfolioSection />
          <TeamSection />
          <CTASection onOpenContactForm={openContactForm} />
        </main>
        <Footer
          onOpenContactForm={openContactForm}
          onOpenLegal={(type) => setLegalType(type)}
        />
        <ContactFormModal
          open={isContactFormOpen}
          ctaOrigin={contactFormOrigin}
          onClose={() => setIsContactFormOpen(false)}
        />
        <LegalModal type={legalType} onClose={() => setLegalType(null)} />
      </motion.div>
    </div>
  )
}
