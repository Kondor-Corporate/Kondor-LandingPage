import { getAttributionContext } from './analytics'

export function hasLeadIngestionEndpoint() {
  return Boolean(import.meta.env.VITE_LEAD_INGESTION_ENDPOINT?.trim())
}

export async function persistLeadFromContactForm(form, ctaId) {
  const endpoint = import.meta.env.VITE_LEAD_INGESTION_ENDPOINT?.trim()

  if (!endpoint) {
    throw new Error('lead_ingestion_not_configured')
  }

  const { attribution, entry } = getAttributionContext()

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      lead: {
        name: form.name,
        email: form.email,
        company: form.company,
        message: form.message,
        website: form.website,
      },
      attribution,
      entry,
      cta_id: ctaId || null,
    }),
  })

  let responseBody = null
  try {
    responseBody = await response.json()
  } catch {
    responseBody = null
  }

  if (!response.ok) {
    const error = new Error(responseBody?.error || 'lead_ingestion_failed')
    error.status = response.status
    error.details = responseBody
    throw error
  }

  return responseBody
}
