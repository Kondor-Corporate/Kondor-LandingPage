import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Send, X } from 'lucide-react'

const DEFAULT_FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvzvdypk'

const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Este campo es obligatorio.' })
    .min(2, { message: 'Ingresá al menos 2 caracteres.' })
    .max(120, { message: 'El nombre es demasiado largo.' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Este campo es obligatorio.' })
    .email({ message: 'Ingresá un email válido.' }),
  company: z
    .string()
    .trim()
    .min(1, { message: 'Este campo es obligatorio.' })
    .min(2, { message: 'Ingresá el nombre de la empresa o equipo.' })
    .max(200, { message: 'Este campo admite como máximo 200 caracteres.' }),
  message: z
    .string()
    .trim()
    .min(1, { message: 'Este campo es obligatorio.' })
    .max(8000, { message: 'El mensaje es demasiado largo.' }),
  website: z.string().optional(),
})

const defaultFormValues = {
  name: '',
  email: '',
  company: '',
  message: '',
  website: '',
}

function inputClassName(hasError) {
  const base =
    'w-full rounded-xl border bg-white/[0.04] px-3 text-sm text-white outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-white/30 focus:ring-0'
  return hasError
    ? `${base} border-[#c94a3d]/80 ring-1 ring-[#e85d4a]/35 focus:border-[#d95545]`
    : `${base} border-white/12 focus:border-brand-accent/60`
}

export default function ContactFormModal({ open, onClose }) {
  const [view, setView] = useState('form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [lastSubmittedHash, setLastSubmittedHash] = useState('')

  const endpointFromEnv = import.meta.env.VITE_FORMSPREE_ENDPOINT
  const formIdFromEnv = import.meta.env.VITE_FORMSPREE_FORM_ID
  const formEndpoint =
    endpointFromEnv || (formIdFromEnv ? `https://formspree.io/f/${formIdFromEnv}` : DEFAULT_FORMSPREE_ENDPOINT)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: defaultFormValues,
  })

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
    setView('form')
    setSubmitStatus('idle')
    setSubmitMessage('')
    reset(defaultFormValues)
  }, [open, reset])

  const onValidSubmit = async (data) => {
    if (data.website?.trim()) {
      setView('success')
      return
    }

    const payloadHash = JSON.stringify({
      name: data.name.trim(),
      email: data.email.trim(),
      company: (data.company || '').trim(),
      message: data.message.trim(),
    })

    if (payloadHash === lastSubmittedHash) {
      setSubmitStatus('error')
      setSubmitMessage('Ya recibimos este mensaje. Si querés reenviar, cambiá algún campo.')
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
          name: data.name,
          email: data.email,
          company: data.company || '',
          message: data.message,
          _subject: `Nuevo contacto desde landing - ${data.name}`,
          _gotcha: data.website || '',
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

      setLastSubmittedHash(payloadHash)
      reset(defaultFormValues)
      setView('success')
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage(error?.message || 'No pudimos enviar el mensaje. Intentá nuevamente en unos minutos.')
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
                    Cuéntanos qué querés construir
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

              <AnimatePresence mode="wait">
                {view === 'success' ? (
                  <motion.div
                    key="success"
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0, y: 8, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.99 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center px-2 py-10 text-center sm:px-6"
                  >
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.06, duration: 0.35, ease: 'easeOut' }}
                      className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10 shadow-[0_0_40px_-12px_rgba(52,211,153,0.35)]"
                    >
                      <CheckCircle2 className="h-8 w-8 text-emerald-400/95" strokeWidth={1.75} aria-hidden />
                    </motion.div>
                    <p className="text-lg font-semibold tracking-tight text-white">Mensaje enviado correctamente</p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/55">
                      Te responderemos pronto por correo
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-8 inline-flex min-w-[140px] items-center justify-center rounded-2xl border border-white/14 bg-white/[0.06] px-6 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:border-white/22 hover:bg-white/[0.09]"
                    >
                      Cerrar
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    noValidate
                    onSubmit={handleSubmit(onValidSubmit)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="block">
                        <label htmlFor="contact-name" className="block">
                          <span className="mb-1.5 block text-xs font-medium text-white/70">Nombre</span>
                          <input
                            id="contact-name"
                            type="text"
                            autoComplete="name"
                            aria-invalid={errors.name ? 'true' : 'false'}
                            aria-describedby={errors.name ? 'contact-name-error' : undefined}
                            className={`h-11 ${inputClassName(!!errors.name)}`}
                            placeholder="Tu nombre"
                            {...register('name')}
                          />
                        </label>
                        {errors.name && (
                          <p id="contact-name-error" className="mt-1.5 text-xs text-[#f0a89e]/95" role="alert">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="block">
                        <label htmlFor="contact-email" className="block">
                          <span className="mb-1.5 block text-xs font-medium text-white/70">Email</span>
                          <input
                            id="contact-email"
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            aria-invalid={errors.email ? 'true' : 'false'}
                            aria-describedby={errors.email ? 'contact-email-error' : undefined}
                            className={`h-11 ${inputClassName(!!errors.email)}`}
                            placeholder="tu@email.com"
                            {...register('email')}
                          />
                        </label>
                        {errors.email && (
                          <p id="contact-email-error" className="mt-1.5 text-xs text-[#f0a89e]/95" role="alert">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="block">
                      <label htmlFor="contact-company" className="block">
                        <span className="mb-1.5 block text-xs font-medium text-white/70">Empresa / organización</span>
                        <input
                          id="contact-company"
                          type="text"
                          autoComplete="organization"
                          aria-invalid={errors.company ? 'true' : 'false'}
                          aria-describedby={errors.company ? 'contact-company-error' : undefined}
                          className={`h-11 ${inputClassName(!!errors.company)}`}
                          placeholder="Nombre de la organización"
                          {...register('company')}
                        />
                      </label>
                      {errors.company && (
                        <p id="contact-company-error" className="mt-1.5 text-xs text-[#f0a89e]/95" role="alert">
                          {errors.company.message}
                        </p>
                      )}
                    </div>

                    <div className="block">
                      <label htmlFor="contact-message" className="block">
                        <span className="mb-1.5 block text-xs font-medium text-white/70">Mensaje</span>
                        <textarea
                          id="contact-message"
                          rows={5}
                          aria-invalid={errors.message ? 'true' : 'false'}
                          aria-describedby={errors.message ? 'contact-message-error' : undefined}
                          className={`resize-y py-2.5 ${inputClassName(!!errors.message)}`}
                          placeholder="Cuéntanos brevemente objetivo, contexto y urgencia."
                          {...register('message')}
                        />
                      </label>
                      {errors.message && (
                        <p id="contact-message-error" className="mt-1.5 text-xs text-[#f0a89e]/95" role="alert">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      aria-hidden="true"
                      {...register('website')}
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
                    {submitStatus === 'error' && <p className="text-xs text-[#f0a89e]/95">{submitMessage}</p>}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
