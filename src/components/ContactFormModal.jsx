import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Send } from 'lucide-react'
import { trackLeadFormSubmit } from '../lib/analytics'

const DEFAULT_FORMSPREE_ENDPOINT = 'https://formspree.io/f/xblovokz'

export default function ContactFormModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    website: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [lastSubmittedHash, setLastSubmittedHash] = useState('')

  const endpointFromEnv = import.meta.env.VITE_FORMSPREE_ENDPOINT
  const formIdFromEnv = import.meta.env.VITE_FORMSPREE_FORM_ID
  const formEndpoint =
    endpointFromEnv || (formIdFromEnv ? `https://formspree.io/f/${formIdFromEnv}` : DEFAULT_FORMSPREE_ENDPOINT)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    setSubmitStatus('idle')
    setSubmitMessage('')
  }, [open])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Honeypot anti-spam: bots often complete hidden fields.
    if (form.website.trim()) {
      trackLeadFormSubmit({
        form_id: 'contact_modal',
        submit_status: 'spam_filtered',
      })
      setSubmitStatus('success')
      setSubmitMessage('Mensaje enviado. Te responderemos pronto.')
      return
    }

    const payloadHash = JSON.stringify({
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      message: form.message.trim(),
    })

    if (payloadHash === lastSubmittedHash) {
      setSubmitStatus('error')
      setSubmitMessage('Ya recibimos este mensaje. Si deseas reenviar, cambia algún campo.')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
          _subject: `Nuevo contacto desde landing - ${form.name}`,
          _gotcha: form.website,
        }),
      })

      if (!response.ok) {
        let message = 'No se pudo enviar el formulario.'
        try {
          const errorData = await response.json()
          if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
            message = errorData.errors.map((entry) => entry.message).join(' ')
          }
        } catch {
          // Keep fallback message when response body is not JSON.
        }
        throw new Error(message)
      }

      setSubmitStatus('success')
      setSubmitMessage('Mensaje enviado. Te responderemos pronto.')
      setLastSubmittedHash(payloadHash)
      trackLeadFormSubmit({
        form_id: 'contact_modal',
        submit_status: 'success',
        has_company: Boolean(form.company.trim()),
        has_message: Boolean(form.message.trim()),
      })
      setForm({ name: '', email: '', company: '', message: '', website: '' })
    } catch (error) {
      trackLeadFormSubmit({
        form_id: 'contact_modal',
        submit_status: 'error',
        error_message: error?.message || 'unknown',
      })
      setSubmitStatus('error')
      setSubmitMessage(error?.message || 'No pudimos enviar el mensaje. Intenta nuevamente en unos minutos.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
            aria-label="Cerrar formulario"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/12 bg-[#1E1E24]/95 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] sm:p-8"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-brand-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-52 w-52 rounded-full bg-brand-accent/10 blur-3xl" />

            <div className="relative z-[1]">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-accent">Conversemos</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    Cuéntanos qué quieres construir
                  </h3>
                  <p className="mt-2 text-sm text-white/55">
                    Te respondemos por correo y coordinamos una conversación breve.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-white/75 transition-colors hover:text-white"
                  aria-label="Cerrar"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-white/70">Nombre</span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-accent/60"
                      placeholder="Tu nombre"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-white/70">Email</span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-accent/60"
                      placeholder="tu@email.com"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-white/70">Empresa o equipo (opcional)</span>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-accent/60"
                    placeholder="Nombre de la organización"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-white/70">Mensaje</span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full resize-y rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-accent/60"
                    placeholder="Cuéntanos brevemente objetivo, contexto y urgencia."
                  />
                </label>

                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-white/40">
                    {submitStatus === 'idle' ? 'Responderemos al correo que ingreses en este formulario.' : submitMessage}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #ED492F 0%, #c73520 60%, #9b2615 100%)',
                      boxShadow: '0 8px 32px -8px rgba(237,73,47,0.5), inset 0 1px 0 rgba(255,255,255,0.18)',
                    }}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                    <Send size={15} />
                  </motion.button>
                </div>
                {submitStatus === 'error' && <p className="text-xs text-red-300">{submitMessage}</p>}
                {submitStatus === 'success' && <p className="text-xs text-emerald-300">{submitMessage}</p>}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
