import { useState, useCallback, useId, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, GitBranch, Eye } from 'lucide-react'

const products = [
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
  },
]

/* Curvas horizontales: viewBox ancho >> alto */
const H_PATH_UP = 'M 0 28 Q 50 6 100 28'
const H_PATH_DN = 'M 0 10 Q 50 32 100 10'

function HorizontalConnector({ index, lit }) {
  const d = index % 2 === 0 ? H_PATH_UP : H_PATH_DN
  const gid = useId().replace(/:/g, '')
  const gradId = `h-road-${gid}-${index}`
  return (
    <div
      className="relative flex-1 min-w-[2.5rem] max-w-[8rem] lg:max-w-[10rem] h-14 lg:h-16 self-center pointer-events-none"
      aria-hidden
    >
      <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
            <stop offset="0%" stopColor="#c73d28" stopOpacity={lit ? 0.5 : 0.28} />
            <stop offset="40%" stopColor="#ED492F" stopOpacity={lit ? 1 : 0.65} />
            <stop offset="60%" stopColor="#ff8f7a" stopOpacity={lit ? 0.95 : 0.58} />
            <stop offset="100%" stopColor="#c73d28" stopOpacity={lit ? 0.5 : 0.28} />
          </linearGradient>
          <filter id={`h-glow-${gid}-${index}`} x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Aura difusa bajo la curva */}
        <path
          d={d}
          fill="none"
          stroke="#ED492F"
          strokeWidth="7"
          strokeLinecap="round"
          strokeOpacity={lit ? 0.12 : 0.06}
        />

        {/* Pista “circuito” — guía técnica */}
        <path
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.11)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="2 10"
        />

        {/* Bisel claro interior (efecto tubo) */}
        <path
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity={lit ? 0.85 : 0.5}
        />

        {/* Cuerpo principal */}
        <motion.path
          d={d}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="2.6"
          strokeLinecap="round"
          filter={`url(#h-glow-${gid}-${index})`}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
        />

        {/* Energía que recorre la curva */}
        <motion.path
          d={d}
          fill="none"
          stroke="#ED492F"
          strokeWidth="5"
          strokeLinecap="round"
          strokeOpacity={lit ? 0.4 : 0.22}
          strokeDasharray="12 88"
          animate={{ strokeDashoffset: [0, -100] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'linear',
            delay: index * 0.35,
          }}
        />

        {/* Cabeza de pulso brillante */}
        <motion.path
          d={d}
          fill="none"
          stroke="rgba(255,252,250,0.95)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="8 92"
          animate={{ strokeDashoffset: [0, -100] }}
          transition={{
            duration: 2.35,
            repeat: Infinity,
            ease: 'linear',
            delay: index * 0.35,
          }}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 0 10px rgba(237,73,47,0.65))',
          }}
        />
      </svg>
    </div>
  )
}

function RoadmapNode({ product, isActive, onSelect }) {
  const Icon = product.icon

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={`group relative flex shrink-0 flex-col items-center rounded-2xl border px-3 py-3 sm:px-4 sm:py-4 text-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1E24]
        w-[7.5rem] sm:w-[9rem] lg:w-[10rem]
        ${
          isActive
            ? 'border-brand-accent/55 bg-brand-accent/[0.10] shadow-[0_0_0_1px_rgba(237,73,47,0.2)]'
            : 'border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]'
        }
        ${product.highlight && !isActive ? 'ring-1 ring-brand-accent/30' : ''}`}
    >
      {product.highlight && (
        <span className="absolute -top-px left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-80" />
      )}
      <div
        className={`mb-2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border transition-colors ${
          isActive
            ? 'border-brand-accent/40 bg-brand-accent/15 text-white'
            : 'border-white/10 bg-white/[0.06] text-white/85 group-hover:border-white/18'
        }`}
      >
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <h3 className="text-[11px] sm:text-xs font-bold text-white leading-tight tracking-tight">{product.name}</h3>
      <p className="mt-0.5 text-[9px] sm:text-[10px] text-white/40 line-clamp-2 leading-snug">{product.tagline}</p>
      <span
        className={`mt-2 text-[8px] sm:text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md border ${product.statusColor}`}
      >
        {product.status}
      </span>
      <span className="mt-2 text-[9px] text-brand-accent/80 font-semibold tracking-wide underline underline-offset-2">
        Conocer producto →
      </span>
    </button>
  )
}

export default function PortfolioSection() {
  const [active, setActive] = useState(0)

  const selectProduct = useCallback((i) => setActive(i), [])

  const activeProduct = products[active]

  return (
    <section id="portfolio" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="pointer-events-none absolute top-0 inset-x-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
      <div className="pointer-events-none absolute top-px inset-x-0 z-[1] h-[2px] bg-gradient-to-r from-transparent via-brand-accent/32 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-10 lg:mb-12"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-white/90 tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-white/40" />
            Portfolio
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
        </motion.div>

        {/* Fila horizontal + curvas (todas las resoluciones: scroll suave en móvil) */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-[52px] sm:top-[56px] hidden sm:block h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent pointer-events-none" />

          <div className="flex items-center justify-center gap-0 overflow-x-auto overflow-y-hidden pb-2 pt-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:overflow-visible [scrollbar-width:thin]">
            <div className="flex items-center justify-center min-w-min mx-auto">
              {products.map((product, i) => (
                <Fragment key={product.name}>
                  <RoadmapNode
                    product={product}
                    isActive={active === i}
                    onSelect={() => selectProduct(i)}
                  />
                  {i < products.length - 1 && (
                    <HorizontalConnector index={i} lit={active === i || active === i + 1} />
                  )}
                </Fragment>
              ))}
            </div>
          </div>

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

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 text-center text-xs text-white/45 max-w-lg mx-auto"
        >
          Más sistemas en desarrollo. Hablá con el equipo para conocer la hoja de ruta completa.
        </motion.p>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
