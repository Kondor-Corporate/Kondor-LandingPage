-- Internal reporting base. It intentionally excludes lead PII.
CREATE VIEW "_vw_lead_reporting_base" AS
WITH milestones AS (
    SELECT
        l.id AS lead_id,
        MIN(h.changed_at) FILTER (WHERE h.to_status = 'QUALIFIED') AS qualified_at,
        MIN(h.changed_at) FILTER (WHERE h.to_status = 'MEETING_BOOKED') AS meeting_booked_at,
        MIN(h.changed_at) FILTER (WHERE h.to_status = 'PROPOSAL_SENT') AS proposal_sent_at,
        MIN(h.changed_at) FILTER (WHERE h.to_status = 'WON') AS won_at,
        MIN(h.changed_at) FILTER (WHERE h.to_status = 'LOST') AS lost_at
    FROM leads l
    LEFT JOIN lead_status_history h ON h.lead_id = l.id
    GROUP BY l.id
)
SELECT
    l.id AS lead_id,
    l.created_at,
    (l.created_at AT TIME ZONE 'UTC')::date AS lead_date,
    l.source,
    l.medium,
    COALESCE(NULLIF(BTRIM(l.campaign), ''), '(not_set)') AS campaign,
    COALESCE(NULLIF(BTRIM(l.content_piece_id), ''), '(not_set)') AS content_piece_id,
    COALESCE(NULLIF(BTRIM(l.cta_id), ''), '(not_set)') AS cta_id,
    l.landing_path,
    l.current_status::text AS current_status,
    m.qualified_at,
    m.meeting_booked_at,
    m.proposal_sent_at,
    m.won_at,
    m.lost_at,
    (
        m.qualified_at IS NOT NULL
        OR l.current_status IN ('QUALIFIED', 'MEETING_BOOKED', 'PROPOSAL_SENT', 'WON')
    ) AS reached_qualified,
    (
        m.meeting_booked_at IS NOT NULL
        OR l.current_status IN ('MEETING_BOOKED', 'PROPOSAL_SENT', 'WON')
    ) AS reached_meeting,
    (
        m.proposal_sent_at IS NOT NULL
        OR l.current_status IN ('PROPOSAL_SENT', 'WON')
    ) AS reached_proposal,
    (m.won_at IS NOT NULL OR l.current_status = 'WON') AS reached_won,
    (m.lost_at IS NOT NULL OR l.current_status = 'LOST') AS reached_lost
FROM leads l
LEFT JOIN milestones m ON m.lead_id = l.id;

CREATE VIEW "vw_leads_by_source" AS
SELECT
    lead_date,
    source,
    medium,
    COUNT(*) AS total_leads,
    COUNT(*) FILTER (WHERE reached_qualified) AS qualified_leads,
    COUNT(*) FILTER (WHERE reached_meeting) AS meeting_booked_leads,
    COUNT(*) FILTER (WHERE reached_proposal) AS proposal_sent_leads,
    COUNT(*) FILTER (WHERE reached_won) AS won_leads,
    COUNT(*) FILTER (WHERE reached_lost) AS lost_leads,
    ROUND(100.0 * COUNT(*) FILTER (WHERE reached_qualified) / NULLIF(COUNT(*), 0), 2) AS qualification_rate_pct,
    ROUND(100.0 * COUNT(*) FILTER (WHERE reached_meeting) / NULLIF(COUNT(*), 0), 2) AS meeting_rate_pct,
    ROUND(100.0 * COUNT(*) FILTER (WHERE reached_proposal) / NULLIF(COUNT(*), 0), 2) AS proposal_rate_pct,
    ROUND(100.0 * COUNT(*) FILTER (WHERE reached_won) / NULLIF(COUNT(*), 0), 2) AS win_rate_pct
FROM "_vw_lead_reporting_base"
GROUP BY lead_date, source, medium;

CREATE VIEW "vw_leads_by_campaign" AS
SELECT
    lead_date,
    campaign,
    source,
    medium,
    COUNT(*) AS total_leads,
    COUNT(*) FILTER (WHERE reached_qualified) AS qualified_leads,
    COUNT(*) FILTER (WHERE reached_meeting) AS meeting_booked_leads,
    COUNT(*) FILTER (WHERE reached_proposal) AS proposal_sent_leads,
    COUNT(*) FILTER (WHERE reached_won) AS won_leads,
    COUNT(*) FILTER (WHERE reached_lost) AS lost_leads,
    ROUND(100.0 * COUNT(*) FILTER (WHERE reached_qualified) / NULLIF(COUNT(*), 0), 2) AS qualification_rate_pct,
    ROUND(100.0 * COUNT(*) FILTER (WHERE reached_won) / NULLIF(COUNT(*), 0), 2) AS win_rate_pct
FROM "_vw_lead_reporting_base"
GROUP BY lead_date, campaign, source, medium;

CREATE VIEW "vw_leads_by_content_piece" AS
SELECT
    b.lead_date,
    b.content_piece_id,
    COALESCE(NULLIF(BTRIM(cp.channel), ''), b.source) AS channel,
    COALESCE(NULLIF(BTRIM(cp.format), ''), '(not_set)') AS format,
    COALESCE(NULLIF(BTRIM(cp.pillar), ''), '(not_set)') AS pillar,
    COALESCE(NULLIF(BTRIM(cp.angle), ''), '(not_set)') AS angle,
    COUNT(*) AS total_leads,
    COUNT(*) FILTER (WHERE b.reached_qualified) AS qualified_leads,
    COUNT(*) FILTER (WHERE b.reached_meeting) AS meeting_booked_leads,
    COUNT(*) FILTER (WHERE b.reached_proposal) AS proposal_sent_leads,
    COUNT(*) FILTER (WHERE b.reached_won) AS won_leads,
    COUNT(*) FILTER (WHERE b.reached_lost) AS lost_leads,
    ROUND(100.0 * COUNT(*) FILTER (WHERE b.reached_qualified) / NULLIF(COUNT(*), 0), 2) AS qualification_rate_pct,
    ROUND(100.0 * COUNT(*) FILTER (WHERE b.reached_won) / NULLIF(COUNT(*), 0), 2) AS win_rate_pct
FROM "_vw_lead_reporting_base" b
LEFT JOIN content_pieces cp ON cp.content_piece_id = NULLIF(b.content_piece_id, '(not_set)')
GROUP BY
    b.lead_date,
    b.content_piece_id,
    COALESCE(NULLIF(BTRIM(cp.channel), ''), b.source),
    COALESCE(NULLIF(BTRIM(cp.format), ''), '(not_set)'),
    COALESCE(NULLIF(BTRIM(cp.pillar), ''), '(not_set)'),
    COALESCE(NULLIF(BTRIM(cp.angle), ''), '(not_set)');

CREATE VIEW "vw_lead_funnel" AS
SELECT
    b.lead_date,
    stage.stage_order,
    stage.stage_key,
    stage.stage_label,
    stage.stage_type,
    COUNT(*) FILTER (WHERE stage.reached) AS lead_count,
    ROUND(100.0 * COUNT(*) FILTER (WHERE stage.reached) / NULLIF(COUNT(*), 0), 2) AS conversion_from_total_pct
FROM "_vw_lead_reporting_base" b
CROSS JOIN LATERAL (
    VALUES
        (1, 'lead_created', 'Lead created', 'entry', true),
        (2, 'qualified', 'Qualified', 'progression', b.reached_qualified),
        (3, 'meeting_booked', 'Meeting booked', 'progression', b.reached_meeting),
        (4, 'proposal_sent', 'Proposal sent', 'progression', b.reached_proposal),
        (5, 'won', 'Won', 'outcome', b.reached_won),
        (6, 'lost', 'Lost', 'outcome', b.reached_lost)
) AS stage(stage_order, stage_key, stage_label, stage_type, reached)
GROUP BY b.lead_date, stage.stage_order, stage.stage_key, stage.stage_label, stage.stage_type;

CREATE VIEW "vw_channel_performance" AS
SELECT
    b.lead_date,
    COALESCE(NULLIF(BTRIM(cp.channel), ''), b.source) AS channel,
    b.medium,
    COUNT(*) AS total_leads,
    COUNT(*) FILTER (WHERE b.reached_qualified) AS qualified_leads,
    COUNT(*) FILTER (WHERE b.reached_meeting) AS meeting_booked_leads,
    COUNT(*) FILTER (WHERE b.reached_proposal) AS proposal_sent_leads,
    COUNT(*) FILTER (WHERE b.reached_won) AS won_leads,
    COUNT(*) FILTER (WHERE b.reached_lost) AS lost_leads,
    ROUND(100.0 * COUNT(*) FILTER (WHERE b.reached_qualified) / NULLIF(COUNT(*), 0), 2) AS qualification_rate_pct,
    ROUND(100.0 * COUNT(*) FILTER (WHERE b.reached_meeting) / NULLIF(COUNT(*), 0), 2) AS meeting_rate_pct,
    ROUND(100.0 * COUNT(*) FILTER (WHERE b.reached_won) / NULLIF(COUNT(*), 0), 2) AS win_rate_pct
FROM "_vw_lead_reporting_base" b
LEFT JOIN content_pieces cp ON cp.content_piece_id = NULLIF(b.content_piece_id, '(not_set)')
GROUP BY b.lead_date, COALESCE(NULLIF(BTRIM(cp.channel), ''), b.source), b.medium;

CREATE VIEW "vw_cta_performance" AS
SELECT
    lead_date,
    cta_id,
    COUNT(*) AS total_leads,
    COUNT(*) FILTER (WHERE reached_qualified) AS qualified_leads,
    COUNT(*) FILTER (WHERE reached_meeting) AS meeting_booked_leads,
    COUNT(*) FILTER (WHERE reached_proposal) AS proposal_sent_leads,
    COUNT(*) FILTER (WHERE reached_won) AS won_leads,
    COUNT(*) FILTER (WHERE reached_lost) AS lost_leads,
    ROUND(100.0 * COUNT(*) FILTER (WHERE reached_qualified) / NULLIF(COUNT(*), 0), 2) AS qualification_rate_pct,
    ROUND(100.0 * COUNT(*) FILTER (WHERE reached_won) / NULLIF(COUNT(*), 0), 2) AS win_rate_pct
FROM "_vw_lead_reporting_base"
GROUP BY lead_date, cta_id;

COMMENT ON VIEW "_vw_lead_reporting_base" IS 'Internal no-PII base for reporting views.';
COMMENT ON VIEW "vw_leads_by_source" IS 'Daily lead and funnel metrics grouped by source and medium.';
COMMENT ON VIEW "vw_leads_by_campaign" IS 'Daily lead and funnel metrics grouped by campaign, source and medium.';
COMMENT ON VIEW "vw_leads_by_content_piece" IS 'Daily lead and funnel metrics grouped by content piece metadata.';
COMMENT ON VIEW "vw_lead_funnel" IS 'Daily executive funnel stages and outcomes.';
COMMENT ON VIEW "vw_channel_performance" IS 'Daily channel performance using content channel with source fallback.';
COMMENT ON VIEW "vw_cta_performance" IS 'Daily lead and outcome metrics grouped by originating CTA.';
