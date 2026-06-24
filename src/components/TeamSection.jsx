import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Linkedin, Github, Twitter, Instagram, Mail, Globe, X } from 'lucide-react'
import { trackOutboundClick } from '../lib/analytics'

const SOCIAL_ICON = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  mail: Mail,
  web: Globe,
}

/**
 * Editá bio y socials por persona. `kind`: linkedin | github | twitter | instagram | mail | web
 */
const TEAM = [
  {
    id: 'K-01',
    name: 'Lucas',
    role: 'Co-Fundador',
    img: '/lucas.jpg',
    bio: 'Ingeniero enfocado en producto y arquitectura. Impulsa decisiones técnicas que escalan sin perder velocidad.',
    socials: [
      { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/' },
      { kind: 'github', label: 'GitHub', href: 'https://github.com/' },
    ],
  },
  {
    id: 'K-02',
    name: 'Joaquín',
    role: 'Co-Fundador',
    img: '/joaco.jfif',
    bio: 'Combina visión de negocio y ejecución. Convierte ideas ambiciosas en entregables concretos.',
    socials: [
      { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/' },
      { kind: 'twitter', label: 'X', href: 'https://x.com/' },
    ],
  },
  {
    id: 'K-03',
    name: 'Nicolás',
    role: 'Co-Fundador',
    img: '/Nico.jfif',
    bio: 'Apasionado por la calidad y la experiencia. Diseña flujos que la gente realmente usa.',
    socials: [
      { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/' },
      { kind: 'instagram', label: 'Instagram', href: 'https://instagram.com/' },
    ],
  },
  {
    id: 'K-04',
    name: 'Santiago',
    role: 'Co-Fundador',
    img: '/santi.jfif',
    bio: 'Operación y crecimiento. Asegura que cada sprint deje valor medible en producción.',
    socials: [
      { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/' },
      { kind: 'mail', label: 'Email', href: 'mailto:hola@ejemplo.com' },
    ],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

export default function TeamSection() {
  const [openId, setOpenId] = useState(null)
  const member = openId ? TEAM.find((m) => m.id === openId) : null

  const close = useCallback(() => setOpenId(null), [])

  useEffect(() => {
    if (!member) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [member, close])

  return (
    <section id="equipo" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[52rem] h-[28rem] rounded-full bg-brand-accent/[0.06] blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.60 }}
          className="mb-14 lg:mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-brand-accent tracking-[0.22em] uppercase mb-5">
              <span className="w-8 h-px bg-brand-accent/70" />
              Kondor Team
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight text-balance">
              Las mentes detrás
              <br />
              <span className="text-brand-accent">del despegue.</span>
            </h2>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm mt-3">
              Cuatro cofundadores construyendo Kondor desde producto, ingeniería y visión operativa.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-mono text-white/25 tracking-widest uppercase shrink-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
            4 tripulantes · equipo activo
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {TEAM.map(({ id, name, role, img }) => (
            <motion.div
              key={id}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="group relative rounded-2xl overflow-hidden border border-white/[0.09] hover:border-brand-accent/40 transition-colors duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] z-10 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute top-3 left-3 z-10 text-[9px] font-mono text-white/35 tracking-widest bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5 pointer-events-none">
                {id}
              </div>

              <button
                type="button"
                onClick={() => setOpenId(id)}
                className="relative block w-full text-left aspect-[3/4] overflow-hidden bg-white/[0.04] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1E24]"
                aria-label={`Ver perfil de ${name}`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover object-top grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                />
              </button>

              <div
                className="absolute bottom-0 inset-x-0 px-4 pt-12 pb-5 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(20,20,28,0.96) 55%, transparent 100%)',
                }}
              >
                <div className="w-6 h-px bg-brand-accent/60 mb-3 group-hover:w-10 transition-all duration-300" />

                <p className="text-sm font-bold text-white tracking-tight leading-none mb-1">
                  {name}
                </p>
                <p className="text-[10px] font-semibold text-brand-accent/80 tracking-[0.18em] uppercase">
                  {role}
                </p>
              </div>

              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 40px rgba(237,73,47,0.07)' }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <AnimatePresence>
        {member && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          >
            <button
              type="button"
              aria-label="Cerrar"
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
              onClick={close}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative w-full max-w-[22rem] rounded-2xl border border-white/12 bg-[#1E1E24]/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent" />

              <button
                type="button"
                onClick={close}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>

              <div className="p-5 pt-6">
                <div className="flex gap-4 mb-4">
                  <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-white/10 ring-1 ring-brand-accent/20">
                    <img src={member.img} alt="" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p id="team-modal-title" className="text-lg font-black text-white tracking-tight">
                      {member.name}
                    </p>
                    <p className="text-[10px] font-semibold text-brand-accent/85 tracking-[0.18em] uppercase mt-1">
                      {member.role}
                    </p>
                    <p className="text-[9px] font-mono text-white/30 tracking-widest mt-2">
                      {member.id} · perfil
                    </p>
                  </div>
                </div>

                <p className="text-sm text-white/65 leading-relaxed border-l-2 border-brand-accent/35 pl-3 mb-5">
                  {member.bio}
                </p>

                <p className="text-[9px] font-mono text-white/35 tracking-[0.2em] uppercase mb-2.5">
                  Redes
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.socials.map(({ kind, label, href }) => {
                    const Icon = SOCIAL_ICON[kind] ?? Globe
                    const isMail = href.startsWith('mailto:')
                    return (
                      <a
                        key={`${member.id}-${label}`}
                        href={href}
                        {...(isMail ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                        onClick={() => {
                          trackOutboundClick({
                            outbound_url: href,
                            link_text: `${member.name} ${label}`,
                            location: 'team_modal',
                          })
                        }}
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white/85 bg-white/[0.06] border border-white/10 hover:border-brand-accent/45 hover:bg-brand-accent/[0.08] transition-colors"
                      >
                        <Icon size={15} className="text-brand-accent shrink-0" />
                        {label}
                      </a>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
