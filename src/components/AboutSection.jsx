import { motion } from 'framer-motion'
import { Zap, Compass, Target } from 'lucide-react'

const blocks = [
  {
    Icon: Compass,
    number: '01',
    title: 'Quiénes somos',
    body: 'Una arquitectura de pensamiento digital diseñada para la anticipación absoluta.',
  },
  {
    Icon: Zap,
    number: '02',
    title: 'Qué hacemos',
    body: 'Decodificamos la complejidad para devolver simplicidad operativa y autonomía total.',
  },
  {
    Icon: Target,
    number: '03',
    title: 'Qué obtienes',
    body: 'Sistemas que aprenden y procesos que se superan a sí mismos por diseño.',
  },
]

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.14 },
  }),
}

export default function AboutSection() {
  return (
    <section className="relative py-24 lg:py-36 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-16 lg:gap-24">

          {/* ── Left: sticky header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-32 lg:w-[42%] shrink-0"
          >
            <span className="inline-block text-[11px] font-semibold text-white/35 tracking-[0.28em] uppercase mb-6">
              Nuestra identidad
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
              Más que software,{' '}
              <span className="text-brand-accent" style={{ textShadow: '0 0 36px rgba(237,73,47,0.35)' }}>
                un ecosistema de criterio.
              </span>
            </h2>
            <p className="text-white/38 text-base leading-relaxed max-w-sm">
              Construimos desde los fundamentos — con lógica, con propósito, con resultados que persisten.
            </p>

            {/* Decorative line */}
            <div className="mt-10 flex items-center gap-3">
              <div className="w-8 h-px bg-brand-accent/60" />
              <div className="w-2 h-2 rounded-full bg-brand-accent/40" />
            </div>
          </motion.div>

          {/* ── Right: items with vertical timeline ── */}
          <div className="relative flex-1">
            {/* Vertical line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{ originY: 0 }}
              className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-accent/50 via-white/10 to-transparent hidden lg:block"
            />

            <div className="flex flex-col gap-12">
              {blocks.map(({ Icon, number, title, body }, i) => (
                <motion.div
                  key={title}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  className="flex items-start gap-7 group"
                >
                  {/* Icon with dot on timeline */}
                  <div className="relative shrink-0 flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.12 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-white/12 bg-white/[0.05] group-hover:border-brand-accent/40 group-hover:bg-brand-accent/[0.07] transition-all duration-300"
                      style={{ zIndex: 1 }}
                    >
                      <Icon size={17} className="text-white/55 group-hover:text-brand-accent transition-colors duration-300" />
                    </motion.div>
                  </div>

                  {/* Text */}
                  <div className="pt-1.5">
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className="text-[10px] font-bold text-brand-accent/50 tracking-[0.2em]">{number}</span>
                      <div className="w-4 h-px bg-white/15" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-accent transition-colors duration-300">
                      {title}
                    </h3>
                    <p className="text-sm text-white/42 leading-relaxed max-w-xs">
                      {body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
