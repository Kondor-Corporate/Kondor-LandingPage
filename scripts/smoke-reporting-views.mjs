import assert from 'node:assert/strict'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const rollbackSignal = new Error('phase4_smoke_rollback')
const token = Date.now().toString()
const leadDate = new Date('2099-01-15T12:00:00.000Z')
const leadDateSql = '2099-01-15'
const source = `phase4_smoke_source_${token}`
const secondarySource = `phase4_smoke_secondary_${token}`
const campaignCode = `phase4_smoke_campaign_${token}`
const contentPieceId = `phase4_smoke_piece_${token}`
const channel = `phase4_smoke_channel_${token}`
const publicViews = [
  'vw_leads_by_source',
  'vw_leads_by_campaign',
  'vw_leads_by_content_piece',
  'vw_lead_funnel',
  'vw_channel_performance',
  'vw_cta_performance',
]

let result = null

try {
  await prisma.$transaction(
    async (tx) => {
      const campaign = await tx.campaign.create({
        data: {
          name: 'Phase 4 smoke campaign',
          source,
          medium: 'smoke_test',
          campaignCode,
        },
      })

      await tx.contentPiece.create({
        data: {
          contentPieceId,
          channel,
          format: 'smoke_test',
          campaignId: campaign.id,
        },
      })

      await tx.lead.create({
        data: {
          createdAt: leadDate,
          source,
          medium: 'smoke_test',
          campaign: campaignCode,
          contentPieceId,
          landingPath: '/phase-4-smoke',
          ctaId: 'phase4_hero_cta',
          currentStatus: 'QUALIFIED',
          statusHistory: {
            create: {
              toStatus: 'QUALIFIED',
              changedAt: new Date('2099-01-15T12:05:00.000Z'),
              changedBy: 'phase4_smoke',
            },
          },
        },
      })

      await tx.lead.create({
        data: {
          createdAt: leadDate,
          source,
          medium: 'smoke_test',
          campaign: campaignCode,
          contentPieceId,
          landingPath: '/phase-4-smoke',
          ctaId: 'phase4_footer_cta',
          currentStatus: 'WON',
          statusHistory: {
            create: [
              {
                toStatus: 'QUALIFIED',
                changedAt: new Date('2099-01-15T12:05:00.000Z'),
                changedBy: 'phase4_smoke',
              },
              {
                fromStatus: 'QUALIFIED',
                toStatus: 'MEETING_BOOKED',
                changedAt: new Date('2099-01-15T12:10:00.000Z'),
                changedBy: 'phase4_smoke',
              },
              {
                fromStatus: 'MEETING_BOOKED',
                toStatus: 'PROPOSAL_SENT',
                changedAt: new Date('2099-01-15T12:15:00.000Z'),
                changedBy: 'phase4_smoke',
              },
              {
                fromStatus: 'PROPOSAL_SENT',
                toStatus: 'WON',
                changedAt: new Date('2099-01-15T12:20:00.000Z'),
                changedBy: 'phase4_smoke',
              },
            ],
          },
        },
      })

      await tx.lead.create({
        data: {
          createdAt: leadDate,
          source: secondarySource,
          medium: 'smoke_test',
          campaign: `phase4_smoke_lost_${token}`,
          landingPath: '/phase-4-smoke',
          ctaId: 'phase4_navbar_cta',
          currentStatus: 'LOST',
          statusHistory: {
            create: {
              toStatus: 'LOST',
              changedAt: new Date('2099-01-15T12:05:00.000Z'),
              changedBy: 'phase4_smoke',
            },
          },
        },
      })

      const [sourceRows, campaignRows, contentRows, channelRows, ctaRows, funnelRows, reportingColumns] =
        await Promise.all([
          tx.$queryRawUnsafe(
            'SELECT * FROM "vw_leads_by_source" WHERE lead_date = $1::date AND source = $2',
            leadDateSql,
            source,
          ),
          tx.$queryRawUnsafe(
            'SELECT * FROM "vw_leads_by_campaign" WHERE lead_date = $1::date AND campaign = $2',
            leadDateSql,
            campaignCode,
          ),
          tx.$queryRawUnsafe(
            'SELECT * FROM "vw_leads_by_content_piece" WHERE lead_date = $1::date AND content_piece_id = $2',
            leadDateSql,
            contentPieceId,
          ),
          tx.$queryRawUnsafe(
            'SELECT * FROM "vw_channel_performance" WHERE lead_date = $1::date AND channel = $2',
            leadDateSql,
            channel,
          ),
          tx.$queryRawUnsafe(
            'SELECT * FROM "vw_cta_performance" WHERE lead_date = $1::date AND cta_id = $2',
            leadDateSql,
            'phase4_hero_cta',
          ),
          tx.$queryRawUnsafe(
            'SELECT stage_key, lead_count FROM "vw_lead_funnel" WHERE lead_date = $1::date ORDER BY stage_order',
            leadDateSql,
          ),
          tx.$queryRawUnsafe(
            `SELECT table_name, column_name
             FROM information_schema.columns
             WHERE table_schema = 'public'
               AND table_name = ANY($1::text[])`,
            publicViews,
          ),
        ])

      assert.equal(sourceRows.length, 1)
      assert.equal(sourceRows[0].total_leads, 2n)
      assert.equal(sourceRows[0].qualified_leads, 2n)
      assert.equal(sourceRows[0].meeting_booked_leads, 1n)
      assert.equal(sourceRows[0].proposal_sent_leads, 1n)
      assert.equal(sourceRows[0].won_leads, 1n)
      assert.equal(campaignRows.length, 1)
      assert.equal(campaignRows[0].total_leads, 2n)
      assert.equal(contentRows.length, 1)
      assert.equal(contentRows[0].channel, channel)
      assert.equal(channelRows.length, 1)
      assert.equal(channelRows[0].total_leads, 2n)
      assert.equal(ctaRows.length, 1)
      assert.equal(ctaRows[0].qualified_leads, 1n)

      const funnel = Object.fromEntries(funnelRows.map(({ stage_key: key, lead_count: count }) => [key, count]))
      assert.deepEqual(funnel, {
        lead_created: 3n,
        qualified: 2n,
        meeting_booked: 1n,
        proposal_sent: 1n,
        won: 1n,
        lost: 1n,
      })

      assert.equal(new Set(reportingColumns.map(({ table_name: view }) => view)).size, publicViews.length)
      assert.deepEqual(
        reportingColumns
          .map(({ column_name: column }) => column)
          .filter((column) => ['lead_id', 'name', 'email', 'phone', 'metadata', 'message'].includes(column)),
        [],
      )

      result = {
        reportingViews: publicViews.length,
        piiColumns: 'none',
        sourceMetrics: 'verified',
        campaignMetrics: 'verified',
        contentMetrics: 'verified',
        channelMetrics: 'verified',
        ctaMetrics: 'verified',
        funnelMetrics: 'verified',
        cleanup: 'pending',
      }

      throw rollbackSignal
    },
    { timeout: 15000 },
  )
} catch (error) {
  if (error !== rollbackSignal) throw error

  assert.equal(
    await prisma.lead.count({
      where: {
        createdAt: {
          gte: new Date('2099-01-15T00:00:00.000Z'),
          lt: new Date('2099-01-16T00:00:00.000Z'),
        },
      },
    }),
    0,
  )
  assert.equal(await prisma.campaign.count({ where: { campaignCode } }), 0)
  assert.equal(await prisma.contentPiece.count({ where: { contentPieceId } }), 0)
  result.cleanup = 'verified'
} finally {
  await prisma.$disconnect()
}

console.log(JSON.stringify(result))
