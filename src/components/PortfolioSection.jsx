import { motion } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Plane, Sparkles } from 'lucide-react'

/* ── Data ─────────────────────────────────────────────── */
const clients = [
  {
    icon: Activity,
    name: 'Kondor Core',
    tagline: 'Gestión operativa de base',
    description:
      'Plataforma central de gestión operativa para organizaciones en crecimiento. Estructura, visibilidad y control en un único sistema.',
    bullets: [
      'Estructura tu operación desde el primer día',
      'Visibilidad total en un solo sistema',
      'Adaptable a tu flujo, no al revés',
    ],
    status: 'En producción',
    statusColor: 'text-emerald-200/95 bg-emerald-500/15 border-emerald-400/20',
    highlight: false,
  },
  {
    icon: GitBranch,
    name: 'Kondor Flow',
    tagline: 'Automatización de procesos',
    description:
      'Sistema de automatización de flujos operativos diseñado para organizaciones con procesos complejos de gestión y seguimiento.',
    bullets: [
      'Automatizá flujos sin depender de IT',
      'Trazabilidad sin overhead burocrático',
      'Escalá sin rediseñar todo',
    ],
    status: 'En producción',
    statusColor: 'text-emerald-200/95 bg-emerald-500/15 border-emerald-400/20',
    highlight: true,
  },
  {
    icon: Eye,
    name: 'Kondor Lens',
    tagline: 'Trazabilidad y auditoría',
    description:
      'Módulo de trazabilidad y auditoría para equipos distribuidos. Registro completo de operaciones con criterio de ingeniería.',
    bullets: [
      'Auditoría completa con criterio de ingeniería',
      'Integración con sistemas existentes',
      'Reportes para equipos y directivos',
    ],
    status: 'En desarrollo',
    statusColor: 'text-sky-200/95 bg-sky-500/15 border-sky-400/20',
    highlight: false,
    name: 'Maps organización',
    logoSrc: '/portfolio/maps.webp',
    logoAlt: 'Logo MAPS organización',
    tagline: 'Partnership en plataforma',
  },
  {
    name: 'Club de campo La Federala',
    logoSrc: '/portfolio/IconoLF.webp',
    logoAlt: 'Logo Club de campo La Federala',
    tagline: 'Comercialización y control',
  },
  {
    name: 'Club For Ever',
    logoSrc: '/portfolio/forever.webp',
    logoAlt: 'Logo Club For Ever',
    tagline: 'Pagos y gestión',
  },
]

const labProjects = [
  {
    Icon: Plane,
    name: 'TakeOff - Planificar tu viaje ya no sera un problema',
    status: 'PROXIMAMENTE',
    statusClass: 'text-sky-200/95 bg-sky-500/12 border-sky-400/18',
  }
]

/* ── Motion helpers ───────────────────────────────────── */
const headerMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55 },
}
const staggerWrap = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

/* ── Carousel constants ───────────────────────────────── */
const N             = clients.length  // 3
const BUFFER        = 5               // cards in DOM: 1 hidden-left, 3 visible, 1 hidden-right
const CENTER        = 2               // index of center slot in the buffer
const GAP           = 20              // px between cards
const TRANSITION_MS = 620             // slide animation duration
const INTERVAL_MS   = 3000            // pause between auto-advances

// Initial baseIdx so that clients[0] starts at center slot
// center slot = baseIdx + CENTER  →  clients[(baseIdx + CENTER) % N] = clients[0]
// →  baseIdx = (N - CENTER + N) % N
const INIT_BASE = (N - CENTER + N) % N   // = 1 for N=3, CENTER=2

/* ── Card ─────────────────────────────────────────────── */
function ClientCard({ name, logoSrc, logoAlt, tagline, isCenter }) {
  return (
    <article
      className={`
        relative flex flex-col items-center justify-center min-h-[15rem] lg:min-h-[13rem]
        overflow-hidden rounded-2xl border select-none
        transition-all duration-500 max-lg:transition-[opacity,background-color,border-color,box-shadow]
        ${isCenter
          ? `border-brand-accent/55 bg-brand-accent/[0.10] max-lg:scale-100 max-lg:z-0 max-lg:shadow-[0_0_28px_-14px_rgba(237,73,47,0.4)]
            lg:scale-[1.04] lg:z-10 lg:shadow-[0_0_80px_-8px_rgba(237,73,47,0.65)]`
          : `border-white/[0.04] bg-white/[0.025] opacity-35 max-lg:scale-100 max-lg:z-0 lg:scale-[0.96]`
        }
      `}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
        style={{
          background: 'radial-gradient(ellipse 90% 65% at 50% 0%, rgba(237,73,47,0.22), transparent 65%)',
          opacity: isCenter ? 1 : 0,
        }}
        aria-hidden
      />

      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500 ${
          isCenter
            ? 'bg-gradient-to-r from-brand-accent/50 via-brand-accent to-brand-accent/50 opacity-100'
            : 'opacity-0'
        }`}
      />

      {/* Content */}
      <div className="relative flex w-full flex-col items-center justify-center gap-3 px-5 py-9 max-lg:px-6 max-lg:py-10 lg:px-6 lg:py-8">
        <div className="flex h-28 w-full max-w-[16rem] items-center justify-center lg:h-24 lg:max-w-[14rem]">
          <img
            src={logoSrc}
            alt={logoAlt}
            className={`max-h-full w-full max-w-[13rem] object-contain duration-500 lg:transition-all max-lg:transition-[opacity,filter,transform] lg:max-w-[12rem] ${
              isCenter
                ? 'opacity-100 grayscale-0 scale-100 lg:scale-[1.06]'
                : 'opacity-55 grayscale'
            }`}
            loading="lazy"
            decoding="async"
          />
        </div>

        <p className={`text-center text-[11px] font-medium tracking-wide transition-all duration-500 ${
          isCenter ? 'text-brand-accent opacity-100' : 'text-white/25 opacity-60'
        }`}>
          {tagline}
        </p>

        <p className={`text-center text-[15px] font-semibold tracking-tight transition-all duration-500 lg:text-sm ${
          isCenter ? 'text-white opacity-100' : 'text-white/35 opacity-60'
        }`}>
          {name}
        </p>
      </div>

      {/* Dot */}
      <div
        className={`absolute bottom-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-all duration-500 ${
          isCenter
            ? 'bg-brand-accent shadow-[0_0_8px_rgba(237,73,47,0.9)] opacity-100'
            : 'bg-white/15 opacity-35'
        }`}
      />
    </article>
  )
}

/* ── Infinite sliding carousel ────────────────────────── */
function ClientsCarousel() {
  const containerRef = useRef(null)
  const [stepPx, setStepPx]     = useState(0) // cardWidth + GAP
  const [baseIdx, setBaseIdx]   = useState(INIT_BASE)
  const [sliding, setSliding]   = useState(false)
  const [multiView, setMultiView] = useState(true) // lg+: 3 visibles; móvil: 1

  /* Measure: 3 tarjetas en lg+, 1 ancho completo en móvil */
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    const measure = () => {
      const w = el.clientWidth
      const multi = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
      setMultiView(multi)
      const cardW = multi ? (w - GAP * (3 - 1)) / 3 : w
      setStepPx(cardW + GAP)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    const mq = window.matchMedia('(min-width: 1024px)')
    mq.addEventListener('change', measure)
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', measure)
    }
  }, [])

  /* Auto-advance every INTERVAL_MS */
  useEffect(() => {
    if (!stepPx) return
    const id = setInterval(() => {
      setSliding(true)
      // After animation completes: shift baseIdx and reset transform instantly
      setTimeout(() => {
        setBaseIdx(p => (p + 1) % N)
        setSliding(false)
      }, TRANSITION_MS)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [stepPx])

  /* Build the 5-card buffer with absoluteIdx to uniquely identify each physical card slot in the stream */
  const cards = Array.from({ length: BUFFER }, (_, i) => {
    const absoluteIdx = baseIdx + i;
    return {
      ...clients[absoluteIdx % N],
      absoluteIdx, // Unique key guarantees stable DOM nodes during reset
    }
  })

  // Start lighting up the incoming card exactly as it begins its journey to the center.
  // Simultaneous dimming of old center + brightening of new center = stationary spotlight effect.
  const highlightSlot = sliding ? CENTER + 1 : CENTER

  const cardW = stepPx ? stepPx - GAP : 0
  /* Desktop: -1 step alinea slots 1–3; móvil (1 visible): -2 steps alinea el slot central (índice 2) */
  const trackOffset = stepPx ? (multiView ? stepPx : 2 * stepPx) : 0

  return (
    <div ref={containerRef} className="relative overflow-hidden py-10 -my-10 lg:py-16 lg:-my-16">
      <div
        style={{
          display:    'flex',
          gap:        `${GAP}px`,
          marginLeft: stepPx ? `-${trackOffset}px` : 0,
          /* During slide: animate left by 1 more step */
          transform:  `translateX(${sliding && stepPx ? -stepPx : 0}px)`,
          transition: sliding
            ? `transform ${TRANSITION_MS}ms cubic-bezier(0.32,0,0.25,1)`
            : 'none',
          willChange: 'transform',
        }}
      >
        {cards.map((card, i) => (
          <div
            key={card.absoluteIdx}
            style={{ flexShrink: 0, width: cardW || (multiView ? '33.333%' : '100%') }}
          >
            <ClientCard {...card} isCenter={i === highlightSlot} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Lab card ─────────────────────────────────────────── */
function LabCard({ Icon, name, status, statusClass }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-4 rounded-xl border border-sky-400/10 bg-gradient-to-br from-white/[0.03] to-transparent px-4 py-4 sm:px-5 sm:py-4"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-500/10 text-sky-100/90">
        <Icon size={22} strokeWidth={1.65} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold tracking-tight text-white/92">{name}</p>
      </div>
      <span className={`shrink-0 rounded-md border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${statusClass}`}>
        {status}
      </span>
      <span className="mt-2 text-[9px] text-brand-accent/80 font-semibold tracking-wide underline underline-offset-2">
        Conocer producto →
      </span>
    </button>
    </motion.div>
  )
}

/* ── Section ──────────────────────────────────────────── */
export default function PortfolioSection() {
  return (
    <section id="portfolio" className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-px z-[1] h-[2px] bg-gradient-to-r from-transparent via-brand-accent/32 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <motion.div {...headerMotion} className="mb-10 lg:mb-14">
          <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
            <span className="h-px w-8 bg-white/40" />
            Portfolio
          </span>
          <h2 className="max-w-3xl text-balance text-3xl font-black leading-tight tracking-tight text-white lg:text-4xl">
            Marcas y proyectos
            <br />
            <span className="text-brand-accent">con criterio compartido.</span>
          </h2>
        </motion.div>

        {/* Clients label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="mb-4 flex flex-wrap items-center gap-3"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-accent/85">
            Empresas que ya confían en nosotros
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight text-balance">
              Nuestro portfolio
              <br />
              <span className="text-brand-accent">de productos.</span>
            </h2>
            <p className="text-white/55 text-sm leading-relaxed max-w-md">
              Cada producto resuelve una capa distinta de la operación. Explorá el portfolio y conocé el foco de cada sistema.
            </p>
          </div>
          <span className="hidden h-px flex-1 bg-gradient-to-r from-white/12 to-transparent sm:block" aria-hidden />
        </motion.div>

        {/* Sliding carousel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.50 }}
          className="mb-14 lg:mb-16"
        >
          <ClientsCarousel />
        </motion.div>

          {/* Panel de detalle único — compacto, bajo la fila */}
          <AnimatePresence mode="wait">
            {activeProduct && (
              <motion.div
                key={activeProduct.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 sm:px-6 sm:py-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-[10px] font-mono text-brand-accent/80 tracking-[0.2em] uppercase">
                    {activeProduct.name}
                  </p>
                  <span className={`text-[8px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md border ${activeProduct.statusColor}`}>
                    {activeProduct.status}
                  </span>
                </div>
                <p className="text-sm text-white/65 leading-relaxed mb-4">{activeProduct.description}</p>
                <ul className="flex flex-col gap-1.5">
                  {activeProduct.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-white/50">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-brand-accent/60 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Lab label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="mb-4 flex flex-wrap items-center gap-3"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-sky-300/75">
            Laboratorio
          </span>
          <span className="hidden h-px flex-1 bg-gradient-to-r from-sky-400/15 to-transparent sm:block" aria-hidden />
        </motion.div>

        <motion.div
          variants={staggerWrap}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
        >
          {labProjects.map((p) => (
            <LabCard key={p.name} {...p} />
          ))}
        </motion.div>

      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
