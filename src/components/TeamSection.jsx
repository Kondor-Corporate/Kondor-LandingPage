import { motion } from 'framer-motion'
import { Linkedin } from 'lucide-react'

/**
 * Editá bio y socials por persona. `kind`: linkedin (más tipos si agregás iconos en el hover)
 */
const TEAM = [
  {
    id: 'K-01',
    name: 'Lucas Legorburu',
    role: 'CEO & Co-Fundador',
    img: '/lucas.webp',
    bio: 'Define la estrategia y alinea prioridades de negocio con la capacidad de ejecución del equipo',
    socials: [
      { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/legorburulucas/' },
    ],
  },
  {
    id: 'K-02',
    name: 'Joaquín E. Rodríguez',
    role: 'COO & Co-Fundador',
    img: '/joaco.webp',
    bio: 'Combina visión de negocio y ejecución. Convierte ideas ambiciosas en entregables concretos.',
    photoClassName: 'object-[center_18%] lg:group-hover/card:-translate-y-[6%]',
    avatarClassName: 'object-[center_28%] scale-125',
    socials: [
      { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/joaquin-e-rodriguez/' },
    ],
  },
  {
    id: 'K-03',
    name: 'Nicolás Pérez',
    role: 'CTO & Co-Fundador',
    img: '/nicolas.webp',
    bio: 'Apasionado por la calidad y la experiencia. Diseña flujos que la gente realmente usa.',
    socials: [
      { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/nicolas-agustin-perez-441335272/' },
    ],
  },
  {
    id: 'K-04',
    name: 'Santiago Talavera',
    role: 'CMO & Co-Fundador',
    img: '/santi.webp',
    bio: 'Operación y crecimiento. Hace que el mercado entienda el valor en segundos',
    socials: [
      { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/santiago-talavera/' },
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

/** TeamScene V2: columnas 1 y 3 arriba; 2 y 4 ligeramente bajas en lg */
const STAGGER_LG = 'lg:mt-0 even:lg:mt-10'

export default function TeamSection() {
  return (
    <section id="equipo" className="relative py-12 sm:py-14 lg:py-16 overflow-hidden">
      {/* TeamScene V2 — capas de fondo */}
      <div
        className="pointer-events-none absolute inset-0 bg-[#1E1E24]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_20%_85%,rgba(237,73,47,0.42)_0%,rgba(180,45,22,0.22)_32%,transparent_58%)]"
        aria-hidden
      />
      {/* Puente con #portfolio: continuidad del degradé naranja hacia arriba-derecha (body ~72% 65%) */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_65%_at_92%_-8%,rgba(237,73,47,0.48)_0%,rgba(180,45,22,0.20)_40%,transparent_72%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '384px 100%, 100% 180px',
        }}
        aria-hidden
      />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-6 lg:mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 lg:gap-8"
        >
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold text-brand-accent tracking-[0.22em] uppercase mb-3">
              <span className="w-7 h-0.5 bg-brand-accent/70" />
              Kondor Team
            </span>
            <h2 className="text-3xl sm:text-[2rem] lg:text-4xl xl:text-[2.75rem] font-black text-white tracking-[-0.02em] leading-[1.08] text-balance">
              El equipo fundador
              <br />
              <span className="text-brand-accent">de Kondor.</span>
            </h2>
          </div>
        </motion.div>

        <div className="relative">
          {/* Línea conectora (V2) — solo desktop */}
          <div
            className="pointer-events-none hidden lg:block absolute left-0 right-0 top-[6.25rem] h-px bg-[rgba(237,73,47,0.22)] mix-blend-screen z-20"
            aria-hidden
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
          >
            {TEAM.map(({ id, name, role, img, bio, socials, photoClassName }, index) => {
              const num = String(index + 1).padStart(2, '0')
              const primarySocial = socials[0]
              return (
                <motion.div
                  key={id}
                  variants={cardVariants}
                  className={`group relative pt-8 sm:pt-10 lg:pt-11 ${STAGGER_LG}`}
                >
                  <span
                    className="pointer-events-none absolute left-1 sm:left-2 lg:left-3 top-0 z-30 font-black text-4xl sm:text-5xl lg:text-[4.25rem] leading-none text-white/[0.18] tracking-tight select-none"
                    aria-hidden
                  >
                    {num}
                  </span>

                  <motion.div
                    className="group/card relative rounded-2xl overflow-hidden border border-white/[0.09] transition-[transform,border-color] duration-300 h-[min(400px,62vw)] sm:h-[440px] lg:h-[480px] xl:h-[520px] max-lg:max-h-[480px] lg:hover:-translate-y-1 lg:hover:border-brand-accent/35"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[3px] z-10 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-[0.65]" />

                    <div className="absolute inset-0 z-[1] bg-brand-accent/[0.06] pointer-events-none transition-opacity duration-300 lg:group-hover/card:opacity-0 lg:group-focus-within/card:opacity-0" />

                    <div className="relative z-[2] block h-full min-h-0 w-full overflow-hidden bg-white/[0.04] text-left">
                      <img
                        src={img}
                        alt={`${name}, ${role} en Kondor`}
                        loading="lazy"
                        decoding="async"
                        className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out grayscale-[20%] lg:group-hover/card:scale-[1.03] lg:group-hover/card:grayscale lg:group-hover/card:opacity-[0.35] lg:group-focus-within/card:scale-[1.03] lg:group-focus-within/card:grayscale lg:group-focus-within/card:opacity-[0.35] ${photoClassName ?? 'object-top'}`}
                      />

                      {/* Estado base: solo rol sobre la foto (badge simple) */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-black/55 via-black/25 to-transparent px-3 pb-4 pt-16 transition-opacity duration-300 lg:group-hover/card:opacity-0 lg:group-focus-within/card:opacity-0 sm:px-4 sm:pb-5">
                        <div className="mx-auto w-fit max-w-[95%] rounded-md border border-white/35 bg-black/35 px-3 py-2 sm:px-3.5 sm:py-2">
                          <p className="text-center text-[9px] font-semibold uppercase leading-tight tracking-[0.14em] text-white sm:text-[10px] sm:tracking-[0.16em]">
                            {role}
                          </p>
                        </div>
                      </div>

                      {/* Panel naranja: solo desktop (hover real); en móvil no se muestra para evitar tap/scroll roto */}
                      <div
                        className="pointer-events-none absolute inset-0 z-[4] hidden h-full min-h-0 flex-col bg-gradient-to-b from-[#ED492F] via-[#ED492F] to-[#C73A25] p-4 opacity-0 transition-[opacity,transform] duration-300 ease-out sm:p-5 lg:flex lg:opacity-0 lg:group-hover/card:pointer-events-auto lg:group-hover/card:opacity-100 lg:group-focus-within/card:pointer-events-auto lg:group-focus-within/card:opacity-100"
                      >
                        <div className="shrink-0 translate-y-2 opacity-0 transition-all duration-300 delay-75 lg:group-hover/card:translate-y-0 lg:group-hover/card:opacity-100 lg:group-focus-within/card:translate-y-0 lg:group-focus-within/card:opacity-100">
                          <p className="text-lg font-black tracking-tight text-white xl:text-xl">
                            {name}
                          </p>
                          <div className="mt-2 h-px w-2/3 max-w-[12rem] bg-white/45" />
                        </div>

                        <p className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-3 pr-1 text-left text-[13px] font-medium leading-snug text-white/90 [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin] opacity-0 transition-opacity duration-300 delay-100 lg:group-hover/card:opacity-100 lg:group-focus-within/card:opacity-100 xl:text-sm">
                          {bio}
                        </p>

                        <div className="shrink-0 translate-y-2 opacity-0 transition-all duration-300 delay-100 lg:group-hover/card:translate-y-0 lg:group-hover/card:opacity-100 lg:group-focus-within/card:translate-y-0 lg:group-focus-within/card:opacity-100">
                          <div className="flex items-end justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="inline-flex max-w-full rounded border border-white/50 bg-black/20 px-2.5 py-1.5 sm:px-3 sm:py-2">
                                <p className="text-left text-[9px] font-semibold uppercase leading-tight tracking-[0.12em] text-white sm:text-[10px] sm:tracking-[0.14em]">
                                  {role}
                                </p>
                              </div>
                            </div>
                            {primarySocial && (
                              <a
                                href={primarySocial.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/45 bg-black/15 text-white transition-colors hover:bg-black/25 xl:h-11 xl:w-11"
                                aria-label={primarySocial.label}
                              >
                                <Linkedin size={20} strokeWidth={1.75} aria-hidden />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        <p className="mt-6 lg:mt-8 text-right font-mono text-[9px] text-white/20 tracking-[0.12em]">
          K / TEAM / 2026
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
    </section>
  )
}
