import { PrismaClient } from '@prisma/client'

const prisma = globalThis.__kondorPrismaClient ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__kondorPrismaClient = prisma
}

const ALLOWED_METHODS = ['POST', 'OPTIONS']
const MAX_BODY_BYTES = 16 * 1024
const FIELD_LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  phone: 40,
  message: 5000,
  source: 120,
  medium: 120,
  campaign: 160,
  content_piece_id: 160,
  landing_path: 2048,
  entry_point: 2048,
  cta_id: 120,
}

class RequestBodyTooLargeError extends Error {}

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
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['request body must be an object']
  }

  const lead = body.lead
  if (!lead || typeof lead !== 'object' || Array.isArray(lead)) {
    return ['lead must be an object']
  }

  if (!normalizeText(lead.name)) errors.push('name is required')
  if (!normalizeText(lead.email)) errors.push('email is required')
  if (!normalizeText(lead.message)) errors.push('message is required')

  const fields = {
    name: lead.name,
    email: lead.email,
    company: lead.company,
    phone: lead.phone,
    message: lead.message,
    source: body.attribution?.source,
    medium: body.attribution?.medium,
    campaign: body.attribution?.campaign,
    content_piece_id: body.attribution?.content_piece_id,
    landing_path: body.entry?.landing_path,
    entry_point: body.entry?.entry_point,
    cta_id: body.cta_id,
  }
  for (const [field, value] of Object.entries(fields)) {
    const maxLength = FIELD_LIMITS[field]
    if (value != null && (typeof value !== 'string' || value.length > maxLength)) {
      errors.push(`${field} must be a string of at most ${maxLength} characters`)
    }
  }

  const email = normalizeText(lead.email)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('email must be valid')
  }

  return errors
}

async function readJsonBody(request) {
  if (request.body !== undefined) {
    const body = request.body
    const bodyBytes = Buffer.byteLength(JSON.stringify(body) ?? '', 'utf8')
    if (bodyBytes > MAX_BODY_BYTES) throw new RequestBodyTooLargeError()
    return body
  }

  const chunks = []
  let bodyBytes = 0
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk)
    bodyBytes += buffer.length
    if (bodyBytes > MAX_BODY_BYTES) throw new RequestBodyTooLargeError()
    chunks.push(buffer)
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
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      sendJson(response, 413, { error: 'payload_too_large' })
      return
    }
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
