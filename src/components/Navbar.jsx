import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'

const navLinks = [
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
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-[4.25rem]">
        <a href="#inicio" className="group shrink-0 py-1 transition-opacity hover:opacity-95">
          <img
            src="/kondor.png"
            alt="Kondor"
            className="h-7 md:h-8 w-auto max-w-[11rem] object-contain object-left [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.35))]"
          />
        </a>

        {/* ── Nav links — glass ellipse + segment dividers; extremos difuminados con la navbar ── */}
        {/*
          ── Nav links: píldora liquid-glass Apple ──────────────────────────────
          px-10 en la ul  → añade vidrio "de sobra" a izq/der del texto.
          La máscara mask-nav-pill-feather desvanece los 4 bordes; el texto
          queda en la zona central 100% opaca. Sin divisores.
          ─────────────────────────────────────────────────────────────────────── */}
        <ul
          className={`hidden md:flex relative items-stretch overflow-hidden rounded-full
            px-24
            mask-nav-pill-feather
            backdrop-blur-2xl
            border-y border-white/[0.13]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.26),inset_0_-1px_0_rgba(0,0,0,0.07),0_10px_36px_rgba(0,0,0,0.14)]
            bg-[#1E1E24]/40`}
        >
          {/* Specular rim continuo (afectado por máscara → también se desvanece) */}
          <span
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px
              bg-gradient-to-r from-transparent via-white/50 to-transparent"
            aria-hidden
          />
          {/* Sheen interior: brillo en corona, sombra en suelo */}
          <span
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.09] via-transparent to-black/[0.06]"
            aria-hidden
          />
          {navLinks.map((link) => (
            <li key={link.href} className="relative z-[1] flex">
              <a
                href={link.href}
                className="flex items-center justify-center text-sm font-medium text-white/80 hover:text-white
                  px-5 py-2.5 min-h-[2.75rem] transition-[background-color,color] duration-200
                  hover:bg-white/[0.11] active:bg-white/[0.06]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── CTA — mismo lenguaje que el botón principal del hero ── */}
        <div className="hidden md:flex items-center gap-3">
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
            <motion.span
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              animate={{ x: ['-100%', '220%'] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.0, ease: 'easeInOut' }}
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
                <motion.span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  animate={{ x: ['-100%', '220%'] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.0, ease: 'easeInOut' }}
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
