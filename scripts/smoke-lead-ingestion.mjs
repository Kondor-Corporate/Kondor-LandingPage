import assert from 'node:assert/strict'
import { PrismaClient } from '@prisma/client'
import handler from '../api/leads.js'

const prisma = new PrismaClient()

function createResponse() {
  return {
    body: null,
    headers: new Map(),
    statusCode: 200,
    setHeader(name, value) {
      this.headers.set(name.toLowerCase(), value)
    },
    end(body = '') {
      this.body = body ? JSON.parse(body) : null
    },
  }
}

const request = {
  method: 'POST',
  body: {
    lead: {
      name: 'Kondor Phase 3 Smoke Test',
      email: 'phase3-smoke@kondor.invalid',
      company: 'Kondor QA',
      message: 'Registro temporal para validar la ingesta de leads.',
      website: '',
    },
    attribution: {
      source: 'internal_validation',
      medium: 'smoke_test',
      campaign: 'phase_3',
      content_piece_id: 'phase3_smoke_001',
    },
    entry: {
      landing_path: '/phase-3-smoke',
      entry_point: '/phase-3-smoke?source=internal_validation',
    },
    cta_id: 'phase3_smoke_test',
  },
}

const response = createResponse()
let createdLeadId = null
let result = null

try {
  await handler(request, response)

  assert.equal(response.statusCode, 201)
  assert.ok(response.body?.id)
  createdLeadId = response.body.id

  const lead = await prisma.lead.findUnique({
    where: { id: createdLeadId },
    include: {
      events: true,
      statusHistory: true,
    },
  })

  assert.ok(lead)
  assert.equal(lead.source, 'internal_validation')
  assert.equal(lead.medium, 'smoke_test')
  assert.equal(lead.campaign, 'phase_3')
  assert.equal(lead.contentPieceId, 'phase3_smoke_001')
  assert.equal(lead.landingPath, '/phase-3-smoke')
  assert.equal(lead.ctaId, 'phase3_smoke_test')
  assert.equal(lead.currentStatus, 'NEW')
  assert.deepEqual(
    lead.events.map(({ eventType }) => eventType).sort(),
    ['contact_form_submitted', 'lead_created'],
  )
  assert.equal(lead.statusHistory.length, 1)
  assert.equal(lead.statusHistory[0].toStatus, 'NEW')

  result = {
    lead: 'created',
    events: lead.events.length,
    statusHistory: lead.statusHistory.length,
    attribution: 'verified',
  }
} finally {
  if (createdLeadId) {
    await prisma.lead.delete({ where: { id: createdLeadId } })
    assert.equal(await prisma.lead.findUnique({ where: { id: createdLeadId } }), null)
  }
  await prisma.$disconnect()
}

console.log(JSON.stringify({ ...result, cleanup: 'verified' }))
