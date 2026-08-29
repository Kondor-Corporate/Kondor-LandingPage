import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'

export default function CTASection({ onOpenContactForm }) {
  return (
    <section
      id="contacto"
      className="relative z-[30] py-24 lg:py-36 overflow-hidden border-t border-white/10 bg-[#1E1E24]/45 backdrop-blur-2xl"
    >
      <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-brand-accent/15 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-brand-accent/10 blur-[90px] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-brand-accent tracking-[0.2em] uppercase">
            <span className="w-6 h-px bg-brand-accent/80" />
            Conversemos
            <span className="w-6 h-px bg-brand-accent/80" />
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
          className="text-3xl lg:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight mb-6 text-balance"
        >
          Construyamos el sistema que 
          tu organización <span className="text-brand-accent">necesita</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-white/60 text-base lg:text-lg leading-relaxed max-w-xl mx-auto mb-10"
        >
          En Kondor diseñamos y construimos sistemas con criterio de ingeniería, foco operativo
          y visión a largo plazo. Conversemos sobre lo que hoy necesita tu empresa para crecer mejor
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.38, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="mailto:kondorcorporate@gmail.com"
            onClick={(event) => {
              if (!onOpenContactForm) return
              event.preventDefault()
              onOpenContactForm()
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 bg-brand-accent text-white font-bold text-base px-9 py-4 rounded-2xl shadow-xl shadow-brand-accent/35 hover:brightness-110 transition-all duration-200"
          >
            Solicitar conversación
            <ArrowRight size={17} />
          </motion.a>

          <motion.a
            href="#portfolio"
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 text-white/55 hover:text-white font-medium text-sm transition-colors duration-200 px-4 py-4 rounded-xl hover:bg-white/5"
          >
            <ExternalLink size={14} />
            Ver casos y recursos
          </motion.a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-10 text-xs text-white/40"
        >
          Sin compromisos. Sin presentaciones largas. Solo una conversación honesta.
        </motion.p>
      </div>
    </section>
  )
}
