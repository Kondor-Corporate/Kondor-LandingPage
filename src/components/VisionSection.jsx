import { motion } from 'framer-motion'
import { Layers, Cpu, TrendingUp, Network, Crosshair } from 'lucide-react'

const pillars = [
  {
    icon: Cpu,
    title: 'Ingeniería de criterio',
    description: 'Tomamos decisiones técnicas basadas en evidencia, no en tendencias. Cada arquitectura refleja el problema real del negocio.',
  },
  {
    icon: Layers,
    title: 'Arquitectura escalable',
    description: 'Diseñamos sistemas que crecen con tu organización. Modular, mantenible y preparado para los próximos años.',
  },
  {
    icon: TrendingUp,
    title: 'Evolución continua',
    description: 'No entregamos software y desaparecemos. Acompañamos cada etapa del crecimiento con mejora iterativa.',
  },
  {
    icon: Network,
    title: 'Ecosistema integrado',
    description: 'Conectamos todas las piezas: pagos, gestión, operación y datos en una plataforma cohesionada.',
  },
]

const headerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
}

const fadeUpShort = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
}

const pillarsContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const pillarItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function VisionSection() {
  return (
    <section
      id="vision"
      className="relative z-[30] overflow-hidden border-y border-white/10 bg-[#1E1E24]/50 py-28 backdrop-blur-md lg:py-36"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px bg-gradient-to-r from-transparent via-brand-accent/35 to-transparent" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-accent/[0.04] via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-20 lg:gap-24">
          {/* Bloque superior: etiqueta + titular + párrafo */}
          <motion.div
            variants={headerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="w-full"
          >
            <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-x-16 xl:gap-x-24">
              <motion.div variants={fadeUpShort} className="min-w-0 max-w-[42rem] flex-1">
                <div className="mb-9 flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-accent/30 bg-brand-accent/[0.08] text-brand-accent">
                    <Crosshair size={18} strokeWidth={1.75} />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-accent/90">
                    Nuestra visión
                  </span>
                </div>

                {/* Titular: acento lateral mínimo (sin esquinas tipo L); el texto manda */}
                <div className="relative pl-5 sm:pl-6">
                  <div
                    className="absolute bottom-[0.2em] left-0 top-[0.2em] w-px rounded-full bg-gradient-to-b from-brand-accent/45 via-brand-accent/15 to-transparent"
                    aria-hidden
                  />
                  <h2 className="text-4xl font-black leading-[1.06] tracking-tight text-balance text-white sm:text-5xl xl:text-[3.25rem]">
                    Tecnología{' '}
                    <span className="relative inline text-white">
                      real
                      <motion.span
                        className="absolute -bottom-1 left-0 right-0 h-px rounded-full bg-gradient-to-r from-brand-accent/25 via-brand-accent/80 to-brand-accent/25"
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileInView={{ scaleX: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.28, duration: 0.55, ease: 'easeOut' }}
                        style={{ transformOrigin: 'left' }}
                        aria-hidden
                      />
                    </span>
                    ,
                    <br />
                    construida con{' '}
                    <span className="relative inline-block">
                      <span className="relative z-10 bg-gradient-to-br from-[#ff6b52] via-brand-accent to-[#9b2615] bg-clip-text text-transparent">
                        rigor
                      </span>
                      {/* Resplandor estático muy suave — sin animación continua */}
                      <span
                        className="pointer-events-none absolute -inset-1 -z-10 rounded-md bg-brand-accent/20 opacity-50 blur-lg"
                        aria-hidden
                      />
                    </span>
                    .
                  </h2>
                </div>
              </motion.div>

              <motion.p
                variants={fadeUpShort}
                className="max-w-md shrink-0 text-base leading-relaxed text-white/[0.52] lg:max-w-sm lg:text-right lg:text-[1.05rem] lg:leading-relaxed"
              >
                Diseñamos sistemas para que empresas en crecimiento puedan operar con la claridad,
                estructura y disciplina tecnológica que antes parecía reservada para organizaciones mucho más grandes.

              </motion.p>
            </div>
          </motion.div>

          {/* Pilares: composición con intención — fila generosa, base liviana, sin cards pesadas */}
          <div className="relative">
            <div
              className="pointer-events-none absolute -top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent md:-top-12"
              aria-hidden
            />
            <motion.div
              variants={pillarsContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            >
              {pillars.map((pillar) => {
                const Icon = pillar.icon
                return (
                  <motion.article
                    key={pillar.title}
                    variants={pillarItem}
                    className="relative flex gap-5 md:flex-col md:gap-5"
                  >
                    <div className="flex shrink-0 items-center justify-center md:items-start md:justify-start">
                      <motion.span
                        className="relative inline-flex cursor-default text-brand-accent"
                        whileHover={{
                          y: -7,
                          transition: { type: 'spring', stiffness: 440, damping: 26, mass: 0.85 },
                        }}
                      >
                        <Icon
                          className="h-11 w-11 sm:h-12 sm:w-12"
                          strokeWidth={1.25}
                          aria-hidden
                        />
                      </motion.span>
                    </div>

                    <div className="min-w-0 flex-1 md:flex-none">
                      <h3 className="text-[1.2rem] font-bold leading-snug tracking-tight text-white sm:text-xl md:text-[1.35rem] md:leading-tight">
                        {pillar.title}
                      </h3>
                      {pillar.description && (
                        <p className="mt-2 text-sm leading-relaxed text-white/45">
                          {pillar.description}
                        </p>
                      )}
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
