import { Mail, ArrowUpRight, Instagram, Linkedin } from 'lucide-react'
import { motion } from 'framer-motion'

const navLinks = [
  { label: 'Nosotros',   href: '#nosotros' },
  { label: 'Visión',     href: '#vision' },
  { label: 'Portfolio',  href: '#portfolio' },
  { label: 'Contacto',   href: '#contacto' },
]

const legalLinks = [
  { label: 'Política de privacidad', type: 'privacidad' },
  { label: 'Términos de uso',        type: 'terminos' },
]

/* TikTok SVG — lucide-react doesn't include it */
function TikTokIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  )
}

const socials = [
  {
    label: 'Instagram',
    href:  'https://www.instagram.com/kondor.io/',
    Icon:  Instagram,
  },
  {
    label: 'LinkedIn',
    href:  'https://www.linkedin.com/company/kondorcorporate/?viewAsMember=true',
    Icon:  Linkedin,
  },
  {
    label: 'TikTok',
    href:  'https://www.tiktok.com/@kondor.io',
    Icon:  TikTokIcon,
  },
]

function SocialBtn({ label, href, Icon }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.10 }}
      whileTap={{ scale: 0.94 }}
      className="relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden
        bg-white/[0.07] border border-white/[0.13]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]
        text-white/60 hover:text-white transition-colors duration-200
        hover:bg-white/[0.12] hover:border-white/[0.22]"
    >
      <Icon size={17} />
    </motion.a>
  )
}

export default function Footer({ onOpenLegal }) {
  return (
    <footer className="relative border-t border-white/[0.08] overflow-hidden">
      {/* Atmospheric glow behind footer */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[260px]
        rounded-full bg-brand-accent/[0.06] blur-[80px]" />

      {/* Dark glass base */}
      <div className="relative bg-[#1E1E24]/80 backdrop-blur-2xl">

        {/* ── Main grid ─────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

            {/* Brand column */}
            <div className="md:col-span-5 flex flex-col gap-5">
              <img
              src="/kondor.webp"
              alt="Kondor — Software Factory"
                className="h-8 w-auto max-w-[9.5rem] object-contain object-left opacity-95"
              />
              <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                Software, sistemas e ingeniería aplicada para organizaciones que quieren operar mejor
              </p>

              {/* Email */}
              <a
                href="mailto:kondorcorporate@gmail.com"
                className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-white
                  transition-colors duration-200 w-fit"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-lg
                  bg-brand-accent/[0.14] border border-brand-accent/[0.28] text-brand-accent">
                  <Mail size={13} />
                </span>
                kondorcorporate@gmail.com
                <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-60 transition-opacity -ml-0.5" />
              </a>

              {/* Socials */}
              <div className="flex items-center gap-2 mt-1">
                {socials.map((s) => (
                  <SocialBtn key={s.label} {...s} />
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden md:block md:col-span-1" />

            {/* Navigation */}
            <div className="md:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">
                Navegación
              </p>
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/55 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact CTA */}
            <div className="md:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">
                Contacto
              </p>
              <p className="text-sm text-white/50 leading-relaxed mb-5">
                ¿Tenés un proyecto en mente? Hablemos y evaluamos cómo podemos
                ayudarte a escalar.
              </p>
              <motion.a
                href="#contacto"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative inline-flex overflow-hidden items-center gap-2 text-sm font-semibold
                  px-5 py-2.5 rounded-2xl text-white
                  bg-brand-accent/[0.85] backdrop-blur-xl
                  border border-t-white/[0.30] border-brand-accent/50
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_4px_20px_rgba(237,73,47,0.30)]"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px
                  bg-gradient-to-r from-transparent via-white/55 to-transparent" />
                <span className="pointer-events-none absolute inset-0
                  bg-gradient-to-b from-white/[0.12] via-transparent to-black/[0.06]" />
                <span className="relative">Hablar con el equipo</span>
                <ArrowUpRight size={14} className="relative" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────── */}
        <div className="border-t border-white/[0.07]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5
            flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/30">
              © 2026 Kondor. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-5">
              {legalLinks.map((l) => (
                <button
                  key={l.label}
                  onClick={() => onOpenLegal?.(l.type)}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
