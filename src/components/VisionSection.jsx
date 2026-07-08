import { motion } from 'framer-motion'
import { Plug, Cpu, Layers, Crosshair } from 'lucide-react'

const pillars = [
  {
    icon: Plug,
    title: 'Productos conectados',
    n: '01',
  },
  {
    icon: Cpu,
    title: 'Pensamiento de sistema',
    n: '02',
  },
  {
    icon: Layers,
    title: 'Arquitectura escalable',
    n: '03',
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export default function VisionSection() {
  return (
    <section
      id="vision"
      className="relative z-[30] overflow-hidden border-y border-white/10 bg-[#1E1E24]/50 backdrop-blur-2xl py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute top-0 inset-x-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 z-[2] h-[2px] bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col gap-14 lg:gap-16">
          {/* Bloque superior — ancho completo */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.65 }}
            className="w-full"
          >
            <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <div className="min-w-0 flex-1 max-w-3xl">
                <div className="flex items-center gap-3 mb-8">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-accent/35 bg-brand-accent/10 text-brand-accent">
                    <Crosshair size={18} strokeWidth={1.75} />
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.28em] text-brand-accent/90 uppercase">
                    Nuestra visión
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute -left-1 -top-2 h-4 w-4 border-l-2 border-t-2 border-brand-accent/50" />
                  <span className="absolute -right-1 -bottom-2 h-4 w-4 border-r-2 border-b-2 border-white/20" />

                  <h2 className="text-4xl sm:text-5xl xl:text-[3.25rem] font-black text-white leading-[1.05] tracking-tight text-balance">
                    Tecnología{' '}
                    <span className="relative inline text-white">
                      real
                      <motion.span
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-accent/20 via-brand-accent to-brand-accent/20 rounded-full"
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileInView={{ scaleX: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.35, duration: 0.65, ease: 'easeOut' }}
                        style={{ transformOrigin: 'left' }}
                      />
                    </span>
                    ,
                    <br />
                    construida con{' '}
                    <span className="relative inline-block">
                      <span className="relative z-10 bg-gradient-to-br from-[#ff6b52] via-brand-accent to-[#9b2615] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(237,73,47,0.35)]">
                        rigor
                      </span>
                      <motion.span
                        className="pointer-events-none absolute -inset-2 -z-10 rounded-lg bg-brand-accent/35 blur-xl"
                        animate={{ opacity: [0.32, 0.12, 0.32] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                        aria-hidden
                      />
                    </span>
                    .
                  </h2>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-6 lg:max-w-md lg:text-right">
                <p className="text-base lg:text-lg text-white/55 leading-relaxed border-l border-white/15 pl-5 lg:border-l-0 lg:border-r lg:pl-0 lg:pr-5">
                  Diseñamos sistemas para que empresas en crecimiento puedan operar con la claridad,
                  estructura y disciplina tecnológica que antes parecía reservada para organizaciones
                  mucho más grandes.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tres focos — versión dinámica, icono + título */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10"
          >
            {pillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <motion.article
                  key={pillar.title}
                  variants={item}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  className="group relative flex min-h-[92px] items-center gap-4 border-l border-white/12 pl-5 md:border-l-0 md:pl-0 md:pt-2"
                >
                  <div
                    className="pointer-events-none absolute left-3 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-brand-accent/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <motion.span
                    className="pointer-events-none absolute bottom-0 left-5 right-0 h-px bg-gradient-to-r from-brand-accent/70 via-brand-accent/20 to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.1 }}
                    style={{ transformOrigin: 'left' }}
                    aria-hidden
                  />

                  <div className="relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center">
                    <motion.span
                      className="absolute inset-0 rounded-full border border-brand-accent/35"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      aria-hidden
                    />
                    <motion.span
                      className="absolute inset-[6px] rounded-full border border-dashed border-white/20"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                      aria-hidden
                    />
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#26262f] text-white/90 ring-1 ring-white/10 transition-colors group-hover:text-brand-accent group-hover:ring-brand-accent/35">
                      <Icon size={16} strokeWidth={1.8} />
                    </div>
                  </div>

                  <div className="relative z-[1] min-w-0 flex-1">
                    <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-brand-accent/75">{pillar.n}</p>
                    <h3 className="text-base font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-brand-accent sm:text-lg">
                      {pillar.title}
                    </h3>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
