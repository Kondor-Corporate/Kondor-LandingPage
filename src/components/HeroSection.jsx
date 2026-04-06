import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

/* ── Radar constants ──────────────────────────────────────────── */

// Blip positions in px offset from circle center.
// Angles are clockwise from top; delays match sweep period (4 s).
const BLIPS = [
  { xOff:  43, yOff: -51, delay: 0.44 }, // θ ≈ 40°
  { xOff: -52, yOff:  91, delay: 2.33 }, // θ ≈ 210°
  { xOff: -75, yOff: -27, delay: 3.22 }, // θ ≈ 290°
]

// 24 tick marks at 15° intervals around the outer ring (r = 182 px)
const TICKS = Array.from({ length: 24 }, (_, i) => {
  const deg = i * 15
  const rad = (deg * Math.PI) / 180
  const r   = 182
  return {
    deg,
    x:       r * Math.sin(rad),
    y:      -r * Math.cos(rad),
    isMajor: i % 6 === 0, // cardinal directions
    isMid:   i % 3 === 0, // 45° diagonals
  }
})

/* ── Component ────────────────────────────────────────────────── */

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center pt-20 lg:pt-24 overflow-hidden"
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Atmospheric glows */}
      <div className="absolute top-1/4 -left-32 w-[32rem] h-[32rem] rounded-full bg-brand-accent/20 blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[28rem] h-[28rem] rounded-full bg-brand-accent/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[78vh]">

          {/* ─── LEFT: Copy + CTA ─── */}
          <div className="flex flex-col justify-center gap-8">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.10, duration: 0.50 }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-white/80 tracking-[0.22em] uppercase">
                <span className="w-8 h-px bg-white/40" />
                Software Factory
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.75, ease: 'easeOut' }}
              className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.03] tracking-tight text-balance drop-shadow-sm"
            >
              Diseñados para
              <br />
              despegar fuerte
              <br />
              <span className="text-brand-accent [text-shadow:0_0_56px_rgba(237,73,47,0.55)]">
                y escalar rápido
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.60 }}
              className="text-lg text-white/60 font-light leading-relaxed max-w-lg border-l-2 border-white/20 pl-5"
            >
              Diseñamos sistemas para que las empresas operen con más estructura, control y escala.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.55 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.a
                href="#contacto"
                whileHover={{ scale: 1.04, boxShadow: '0 0 44px rgba(237,73,47,0.55)' }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 text-sm font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #ED492F 0%, #c73520 60%, #9b2615 100%)',
                  boxShadow: '0 8px 32px -8px rgba(237,73,47,0.5), inset 0 1px 0 rgba(255,255,255,0.18)',
                }}
              >
                <motion.span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  animate={{ x: ['-100%', '220%'] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.0, ease: 'easeInOut' }}
                />
                <span>Hablar con el equipo</span>
                <ArrowRight size={16} className="shrink-0" />
              </motion.a>

              <motion.a
                href="#vision"
                whileHover={{ x: 3 }}
                className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors"
              >
                <ChevronDown size={15} />
                Conocer más
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.80, duration: 0.70 }}
              className="flex items-center gap-8 pt-4 border-t border-white/10"
            >
              {[
                { value: '3+',   label: 'Productos activos' },
                { value: '100%', label: 'Ingeniería propia' },
                { value: '4',    label: 'Cofundadores' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xl font-black text-white">{value}</span>
                  <span className="text-[10px] text-white/45 uppercase tracking-widest leading-tight">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── RIGHT: Tactical Radar ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.90 }}
            className="hidden lg:flex flex-col items-center justify-center relative min-h-[520px]"
          >

            {/* Top HUD bar */}
            <div className="absolute top-8 left-0 right-0 flex justify-between px-2 pointer-events-none">
              <span className="text-[8px] font-mono tracking-[0.22em] text-brand-accent/45 uppercase">KONDOR&nbsp;SYS</span>
              <span className="text-[8px] font-mono tracking-[0.22em] text-white/18 uppercase">v2.4.1</span>
            </div>

            {/* ── Radar disk ── */}
            <div className="relative w-[380px] h-[380px] select-none">

              {/* Soft ambient glow behind the disk */}
              <div className="absolute -inset-12 rounded-full bg-brand-accent/[0.06] blur-[80px] pointer-events-none" />

              {/* Radial background */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(237,73,47,0.06) 0%, rgba(20,20,28,0.55) 60%, transparent 100%)',
                }}
              />

              {/* Concentric range rings */}
              {[0.25, 0.50, 0.75, 1].map((s, i) => (
                <div
                  key={s}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width:  `${s * 100}%`,
                    height: `${s * 100}%`,
                    top:    `${(1 - s) * 50}%`,
                    left:   `${(1 - s) * 50}%`,
                    border: `1px solid rgba(255,255,255,${i === 3 ? 0.11 : 0.045})`,
                  }}
                />
              ))}

              {/* Crosshair */}
              <div
                className="absolute top-1/2 left-5 right-5 h-px -translate-y-1/2 pointer-events-none"
                style={{ background: 'rgba(255,255,255,0.055)' }}
              />
              <div
                className="absolute left-1/2 top-5 bottom-5 w-px -translate-x-1/2 pointer-events-none"
                style={{ background: 'rgba(255,255,255,0.055)' }}
              />

              {/* 45° diagonal guides */}
              {[45, 135].map(angle => (
                <div
                  key={angle}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div
                    className="w-full h-px"
                    style={{
                      background: 'rgba(255,255,255,0.025)',
                      transform:  `rotate(${angle}deg)`,
                    }}
                  />
                </div>
              ))}

              {/* Tick marks around outer ring */}
              {TICKS.map(({ deg, x, y, isMajor, isMid }) => (
                <div
                  key={deg}
                  className="absolute pointer-events-none"
                  style={{
                    width:  '1px',
                    height: isMajor ? '14px' : isMid ? '8px' : '4px',
                    top:    `calc(50% + ${y}px)`,
                    left:   `calc(50% + ${x}px)`,
                    transform: `translate(-50%, -50%) rotate(${deg}deg)`,
                    background: isMajor
                      ? 'rgba(237,73,47,0.55)'
                      : 'rgba(255,255,255,0.18)',
                  }}
                />
              ))}

              {/* Sweep cone — self-clips to circle via rounded-full */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, rgba(237,73,47,0.13) 52deg, transparent 52deg)',
                }}
              />

              {/* Sweep leading edge — thin bright line */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(237,73,47,0.85) 0deg, transparent 2.5deg)',
                }}
              />

              {/* Blips — pulse in sync with sweep period (4 s) */}
              {BLIPS.map(({ xOff, yOff, delay }, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width:  '7px',
                    height: '7px',
                    top:    `calc(50% + ${yOff}px)`,
                    left:   `calc(50% + ${xOff}px)`,
                    transform: 'translate(-50%, -50%)',
                    background: '#ED492F',
                    boxShadow:  '0 0 10px rgba(237,73,47,0.9), 0 0 22px rgba(237,73,47,0.4)',
                  }}
                  animate={{ opacity: [0, 1, 0.65, 0], scale: [0.4, 1.4, 1.0, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 3.2, delay }}
                />
              ))}

              {/* Center pulsing dot */}
              <motion.div
                animate={{ scale: [1, 1.7, 1], opacity: [1, 0.45, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand-accent pointer-events-none"
                style={{ boxShadow: '0 0 16px rgba(237,73,47,0.95), 0 0 36px rgba(237,73,47,0.35)' }}
              />

              {/* Bearing labels */}
              <span className="absolute font-mono text-white/25 tracking-widest pointer-events-none" style={{ fontSize: '9px', top: '10px',  left: '50%',   transform: 'translateX(-50%)' }}>000</span>
              <span className="absolute font-mono text-white/25 tracking-widest pointer-events-none" style={{ fontSize: '9px', top: '50%',  right: '10px', transform: 'translateY(-50%)' }}>090</span>
              <span className="absolute font-mono text-white/25 tracking-widest pointer-events-none" style={{ fontSize: '9px', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>180</span>
              <span className="absolute font-mono text-white/25 tracking-widest pointer-events-none" style={{ fontSize: '9px', top: '50%',  left: '10px', transform: 'translateY(-50%)' }}>270</span>

            </div>{/* /radar disk */}

            {/* HUD readouts */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-between px-4 pointer-events-none">
              <div>
                <p className="text-[8px] font-mono tracking-[0.22em] uppercase text-brand-accent/50">ALT</p>
                <p className="text-[11px] font-mono text-white/38">3 821 m</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] font-mono tracking-[0.22em] uppercase text-brand-accent/50">ZONA DE VUELO</p>
                <p className="text-[11px] font-mono text-white/38 flex items-center justify-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                  EN LÍNEA
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-mono tracking-[0.22em] uppercase text-brand-accent/50">VEL</p>
                <p className="text-[11px] font-mono text-white/38">128 km/h</p>
              </div>
            </div>

          </motion.div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#1E1E24]/60 to-transparent pointer-events-none" />
    </section>
  )
}
