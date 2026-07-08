import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const LEGAL_CONTENT = {
  privacidad: {
    title: 'Política de Privacidad',
    sections: [
      {
        heading: '1. Información que recopilamos',
        body: 'Recopilamos la información que usted nos proporciona directamente al completar nuestro formulario de contacto: nombre, dirección de correo electrónico, y el contenido del mensaje. No recopilamos información de forma automática más allá de lo estrictamente necesario para el funcionamiento del sitio.',
      },
      {
        heading: '2. Uso de la información',
        body: 'Utilizamos la información recopilada exclusivamente para responder a sus consultas y solicitudes de contacto. No compartimos, vendemos ni cedemos sus datos personales a terceros con fines comerciales.',
      },
      {
        heading: '3. Almacenamiento y seguridad',
        body: 'Los mensajes enviados a través del formulario de contacto son procesados mediante Formspree y almacenados de forma segura. Tomamos medidas razonables para proteger su información contra acceso no autorizado.',
      },
      {
        heading: '4. Cookies',
        body: 'Este sitio no utiliza cookies de seguimiento ni de publicidad. Únicamente pueden existir cookies técnicas necesarias para el funcionamiento básico del sitio.',
      },
      {
        heading: '5. Sus derechos',
        body: 'Usted tiene derecho a acceder, rectificar o eliminar sus datos personales en cualquier momento. Para ejercer estos derechos, contáctenos en kondorcorporate@gmail.com.',
      },
      {
        heading: '6. Contacto',
        body: 'Para cualquier consulta relacionada con esta política, puede contactarnos en: kondorcorporate@gmail.com',
      },
    ],
  },
  terminos: {
    title: 'Términos de Uso',
    sections: [
      {
        heading: '1. Aceptación de los términos',
        body: 'Al acceder y utilizar el sitio web de Kondor (kondorcorporate.com), usted acepta estos Términos de Uso. Si no está de acuerdo, le pedimos que no utilice el sitio.',
      },
      {
        heading: '2. Uso del sitio',
        body: 'Este sitio web tiene carácter informativo. El contenido publicado es propiedad de Kondor y está protegido por derechos de autor. Queda prohibida su reproducción total o parcial sin autorización expresa.',
      },
      {
        heading: '3. Precisión de la información',
        body: 'Kondor procura mantener la información del sitio actualizada y precisa. Sin embargo, no garantizamos la exactitud, integridad o vigencia de todo el contenido publicado. La información puede modificarse sin previo aviso.',
      },
      {
        heading: '4. Servicios y propuestas',
        body: 'La información sobre servicios publicada en este sitio es orientativa. Las condiciones, precios y alcances definitivos se establecen en propuestas formales acordadas entre Kondor y el cliente.',
      },
      {
        heading: '5. Limitación de responsabilidad',
        body: 'Kondor no será responsable por daños directos, indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso de este sitio o de la información contenida en él.',
      },
      {
        heading: '6. Modificaciones',
        body: 'Kondor se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entran en vigencia al momento de su publicación en el sitio.',
      },
      {
        heading: '7. Ley aplicable',
        body: 'Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa será sometida a la jurisdicción de los tribunales competentes de la Ciudad de Buenos Aires.',
      },
      {
        heading: '8. Contacto',
        body: 'Para consultas sobre estos términos: kondorcorporate@gmail.com',
      },
    ],
  },
}

export default function LegalModal({ type, onClose }) {
  const content = LEGAL_CONTENT[type]

  useEffect(() => {
    if (!content) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [content])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {content && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-x-4 bottom-0 top-16 z-[201] mx-auto max-w-2xl overflow-hidden rounded-t-2xl border border-white/10 bg-[#1E1E24] shadow-2xl sm:inset-x-6 md:inset-x-auto md:left-1/2 md:top-12 md:-translate-x-1/2 md:rounded-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={content.title}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#1E1E24]/90 px-6 py-4 backdrop-blur-md">
              <h2 className="text-base font-bold text-white">{content.title}</h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-white/25 hover:text-white"
                aria-label="Cerrar"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-6" style={{ maxHeight: 'calc(100% - 61px)' }}>
              <p className="mb-6 text-xs text-white/40">Última actualización: abril de 2026</p>
              <div className="space-y-6">
                {content.sections.map((section) => (
                  <div key={section.heading}>
                    <h3 className="mb-2 text-sm font-semibold text-white">{section.heading}</h3>
                    <p className="text-sm leading-relaxed text-white/55">{section.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-xs text-white/30">© 2026 Kondor. Todos los derechos reservados.</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
