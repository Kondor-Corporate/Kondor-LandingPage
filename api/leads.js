import { PrismaClient } from '@prisma/client'

const prisma = globalThis.__kondorPrismaClient ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__kondorPrismaClient = prisma
}

const ALLOWED_METHODS = ['POST', 'OPTIONS']

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(payload))
}

function normalizeText(value) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

function normalizeAttribution(attribution = {}) {
  return {
    source: normalizeText(attribution.source) || 'unknown',
    medium: normalizeText(attribution.medium) || 'unknown',
    campaign: normalizeText(attribution.campaign),
    contentPieceId: normalizeText(attribution.content_piece_id),
  }
}

function normalizeEntry(entry = {}) {
  return {
    landingPath: normalizeText(entry.landing_path) || '/',
    entryPoint: normalizeText(entry.entry_point),
  }
}

function validateBody(body) {
  const errors = []
  const lead = body?.lead ?? {}

  if (!normalizeText(lead.name)) errors.push('name is required')
  if (!normalizeText(lead.email)) errors.push('email is required')
  if (!normalizeText(lead.message)) errors.push('message is required')

  return errors
}

async function readJsonBody(request) {
  if (request.body && typeof request.body === 'object') return request.body

  const chunks = []
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk))
  }

  const rawBody = Buffer.concat(chunks).toString('utf8')
  return rawBody ? JSON.parse(rawBody) : {}
}

export default async function handler(request, response) {
  response.setHeader('Allow', ALLOWED_METHODS.join(', '))

  if (request.method === 'OPTIONS') {
    response.statusCode = 204
    response.end()
    return
  }

  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'method_not_allowed' })
    return
  }

  let body
  try {
    body = await readJsonBody(request)
  } catch {
    sendJson(response, 400, { error: 'invalid_json' })
    return
  }

  if (normalizeText(body?.lead?.website)) {
    sendJson(response, 202, { status: 'ignored' })
    return
  }

  const validationErrors = validateBody(body)
  if (validationErrors.length > 0) {
    sendJson(response, 422, { error: 'validation_error', details: validationErrors })
    return
  }

  const leadInput = body.lead
  const attribution = normalizeAttribution(body.attribution)
  const entry = normalizeEntry(body.entry)
  const ctaId = normalizeText(body.cta_id)

  try {
    const createdLead = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          name: normalizeText(leadInput.name),
          email: normalizeText(leadInput.email),
          phone: normalizeText(leadInput.phone),
          source: attribution.source,
          medium: attribution.medium,
          campaign: attribution.campaign,
          contentPieceId: attribution.contentPieceId,
          landingPath: entry.landingPath,
          entryPoint: entry.entryPoint,
          ctaId,
          metadata: {
            company: normalizeText(leadInput.company),
            message: normalizeText(leadInput.message),
          },
        },
      })

      await tx.leadEvent.create({
        data: {
          leadId: lead.id,
          eventType: 'lead_created',
          metadata: {
            cta_id: ctaId,
            company_present: Boolean(normalizeText(leadInput.company)),
            message_present: Boolean(normalizeText(leadInput.message)),
          },
        },
      })

      await tx.leadEvent.create({
        data: {
          leadId: lead.id,
          eventType: 'contact_form_submitted',
          metadata: {
            form_id: 'contact_modal',
          },
        },
      })

      await tx.leadStatusHistory.create({
        data: {
          leadId: lead.id,
          toStatus: 'NEW',
          changedBy: 'landing',
          reason: 'Lead creado desde formulario publico',
        },
      })

      return lead
    })

    sendJson(response, 201, {
      id: createdLead.id,
      status: createdLead.currentStatus,
    })
  } catch (error) {
    console.error('lead_ingestion_failed', error)
    sendJson(response, 500, { error: 'lead_ingestion_failed' })
  }
}
