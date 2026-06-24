import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import VisionSection from './components/VisionSection'
import PortfolioSection from './components/PortfolioSection'
import CTASection from './components/CTASection'
import TeamSection from './components/TeamSection'
import Footer from './components/Footer'
import ContactFormModal from './components/ContactFormModal'
import { initAnalytics, initializeAttribution, trackLeadFormView, trackPageView } from './lib/analytics'

export default function App() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  useEffect(() => {
    initializeAttribution()
    initAnalytics()
    if (!window.__kondorInitialPageViewTracked) {
      window.__kondorInitialPageViewTracked = true
      trackPageView()
    }
  }, [])

  const openContactForm = (origin) => {
    setIsContactFormOpen(true)
    trackLeadFormView({
      form_id: 'contact_modal',
      cta_id: origin,
    })
  }

  return (
    <div className="min-h-screen" style={{ overflowX: 'clip' }}>
      <Navbar onOpenContactForm={openContactForm} />
      <main>
        <HeroSection />
        <AboutSection />
        <VisionSection />
        <PortfolioSection />
        <TeamSection />
        <CTASection onOpenContactForm={openContactForm} />
      </main>
      <Footer onOpenContactForm={openContactForm} />
      <ContactFormModal open={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} />
    </div>
  )
}
