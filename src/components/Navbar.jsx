import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'

const navLinks = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Visión', href: '#vision' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar({ onOpenContactForm }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300
        bg-[#1E1E24]/75 backdrop-blur-xl shadow-panel border-b border-white/10"
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between gap-3 lg:gap-5 h-16 lg:h-[4.25rem]">
        <a href="#inicio" className="group z-[2] shrink-0 py-1 transition-opacity hover:opacity-95">
          <img
            src="/kondor.webp"
            alt="Kondor — Software Factory"
            className="h-7 md:h-8 w-auto max-w-[11rem] object-contain object-left [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.35))]"
          />
        </a>

        {/* Ocupa el hueco entre logo y CTA → vidrio alineado al ancho útil del header */}
        <div className="hidden md:flex flex-1 min-w-0 items-stretch justify-center self-stretch -mx-1 px-1">
          <ul
            className="relative flex w-full max-w-full items-stretch justify-center gap-0.5 overflow-hidden px-2
              mask-nav-glass-hv
              backdrop-blur-3xl backdrop-saturate-150
              shadow-[inset_0_-24px_40px_-18px_rgba(0,0,0,0.11),0_0_0_1px_rgba(255,255,255,0.045)]"
          >
            {/* Vidrio base: menos contraste con el header */}
            <span
              className="pointer-events-none absolute inset-0 bg-[#1E1E24]/30"
              aria-hidden
            />
            <span
              className="nav-glass-sheen-top pointer-events-none absolute inset-x-0 top-0 z-10 h-1/3 min-h-[1.1rem]"
              aria-hidden
            />
            <span
              className="nav-glass-sheen-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 min-h-[1.1rem]"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.018] to-black/[0.022]"
              aria-hidden
            />
          {navLinks.map((link) => (
            <li key={link.href} className="group relative z-[1] flex">
              <a
                href={link.href}
                className="relative flex items-center justify-center text-sm font-medium
                  text-white/[0.78] hover:text-white
                  px-4 py-2.5 min-h-[2.65rem]
                  transition-[color,background-color] duration-300 ease-out
                  rounded-md
                  hover:bg-white/[0.045] active:bg-white/[0.03]"
              >
                <span className="relative z-[1] tracking-[0.01em]">{link.label}</span>
                {/* Indicador hover: línea inferior tipo “pill glow”, muy sutil */}
                <span
                  className="pointer-events-none absolute left-1/2 bottom-[0.35rem] z-0 h-[2px] w-[min(72%,3.25rem)] -translate-x-1/2
                    rounded-full bg-gradient-to-r from-transparent via-white/45 to-transparent
                    opacity-0 shadow-[0_0_12px_rgba(255,255,255,0.12)]
                    transition-[opacity,transform] duration-300 ease-out
                    group-hover:opacity-100 group-hover:translate-y-0 translate-y-0.5"
                  aria-hidden
                />
              </a>
            </li>
          ))}
          </ul>
        </div>

        {/* ── CTA — mismo lenguaje que el botón principal del hero ── */}
        <div className="hidden md:flex shrink-0 items-center gap-3 z-[2]">
          <motion.a
            href="#contacto"
            onClick={(event) => {
              if (!onOpenContactForm) return
              event.preventDefault()
              onOpenContactForm()
            }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 44px rgba(237,73,47,0.55)' }}
            whileTap={{ scale: 0.97 }}
            className="relative flex items-center gap-2 overflow-hidden rounded-2xl px-5 py-2.5 text-sm font-bold text-white shrink-0"
            style={{
              background: 'linear-gradient(135deg, #ED492F 0%, #c73520 60%, #9b2615 100%)',
              boxShadow: '0 8px 32px -8px rgba(237,73,47,0.5), inset 0 1px 0 rgba(255,255,255,0.18)',
            }}
          >
            <span
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-btn-shimmer"
              aria-hidden
            />
            <span className="relative">Hablar con el equipo</span>
            <ArrowRight size={16} className="relative shrink-0" />
          </motion.a>
        </div>

        <button
          className="md:hidden text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-[#1E1E24]/92 backdrop-blur-xl"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-white/80 hover:text-white py-2.5 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <motion.a
                href="#contacto"
                onClick={(event) => {
                  setMenuOpen(false)
                  if (!onOpenContactForm) return
                  event.preventDefault()
                  onOpenContactForm()
                }}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center justify-center gap-2 overflow-hidden mt-2 text-sm font-bold px-5 py-3 rounded-2xl text-white"
                style={{
                  background: 'linear-gradient(135deg, #ED492F 0%, #c73520 60%, #9b2615 100%)',
                  boxShadow: '0 8px 32px -8px rgba(237,73,47,0.5), inset 0 1px 0 rgba(255,255,255,0.18)',
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-btn-shimmer"
                  aria-hidden
                />
                <span className="relative">Hablar con el equipo</span>
                <ArrowRight size={16} className="relative shrink-0" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
