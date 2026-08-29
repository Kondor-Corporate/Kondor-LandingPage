import { motion } from 'framer-motion'
import { Zap, Compass, Target } from 'lucide-react'

const blocks = [
  {
    Icon:  Compass,
    title: 'Quiénes somos',
    body:  'Somos una software factory que diseña y construye sistemas digitales para acompañar la evolución tecnológica de empresas en crecimiento.',
    accent: false,
  },
  {
    Icon:  Zap,
    title: 'Cómo trabajamos',
    body:  'Combinamos visión de producto, criterio técnico y buenas prácticas de ingeniería para construir soluciones claras, seguras y escalables.',
    accent: true,
  },
  {
    Icon:  Target,
    title: 'Qué buscamos lograr',
    body:  'Ayudamos a que organizaciones pequeñas y medianas operen con más estructura, visibilidad y capacidad de crecimiento.',
    accent: false,
  },
]


const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.05 } },
}

const cardVariants = {
  hidden:   { opacity: 0, y: 36 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

export default function AboutSection() {
  return (
    <section id="nosotros" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Top edge line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.60 }}
          className="mb-14 lg:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-brand-accent tracking-[0.22em] uppercase mb-5">
            <span className="w-8 h-px bg-brand-accent/70" />
            Nuestra identidad
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight text-balance leading-tight">
            Construimos con criterio,
            <br className="hidden md:block" />
            <span className="text-brand-accent"> no por improvisación.</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
        >
          {blocks.map(({ Icon, title, body, accent }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className={`group relative rounded-2xl border p-7 overflow-hidden transition-all duration-300 cursor-default
                ${accent
                  ? 'border-brand-accent/30 bg-brand-accent/[0.07] hover:bg-brand-accent/[0.11] hover:border-brand-accent/50 hover:shadow-glow'
                  : 'border-white/10 bg-white/[0.05] hover:bg-white/[0.08] hover:border-white/18'
                }`}
            >
              {/* Top accent line (always visible on featured, hover on rest) */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300
                  ${accent
                    ? 'bg-gradient-to-r from-brand-accent/40 via-brand-accent to-brand-accent/40 opacity-100'
                    : 'bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100'
                  }`}
              />

              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors duration-200
                ${accent
                  ? 'bg-brand-accent/20 border border-brand-accent/30 group-hover:bg-brand-accent/30'
                  : 'bg-white/8 border border-white/10 group-hover:bg-white/12'
                }`}
              >
                <Icon size={20} className={accent ? 'text-brand-accent' : 'text-white/75'} />
              </div>

              {/* Text */}
              <h3 className={`text-base font-bold mb-2.5 transition-colors duration-200
                ${accent ? 'text-white' : 'text-white group-hover:text-brand-accent'}`}
              >
                {title}
              </h3>
              <p className="text-sm text-white/55 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom edge line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
