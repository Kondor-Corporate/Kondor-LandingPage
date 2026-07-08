-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'QUALIFIED', 'MEETING_BOOKED', 'PROPOSAL_SENT', 'WON', 'LOST');

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "campaign_code" TEXT NOT NULL,
    "objective" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_pieces" (
    "id" UUID NOT NULL,
    "content_piece_id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "format" TEXT,
    "pillar" TEXT,
    "angle" TEXT,
    "published_at" TIMESTAMPTZ(6),
    "url" TEXT,
    "campaign_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_pieces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "source" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "campaign" TEXT,
    "content_piece_id" TEXT,
    "landing_path" TEXT NOT NULL,
    "entry_point" TEXT,
    "cta_id" TEXT,
    "current_status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_events" (
    "id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "lead_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_status_history" (
    "id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "from_status" "LeadStatus",
    "to_status" "LeadStatus" NOT NULL,
    "changed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changed_by" TEXT,
    "reason" TEXT,

    CONSTRAINT "lead_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_campaign_code_key" ON "campaigns"("campaign_code");

-- CreateIndex
CREATE INDEX "campaigns_source_medium_idx" ON "campaigns"("source", "medium");

-- CreateIndex
CREATE UNIQUE INDEX "content_pieces_content_piece_id_key" ON "content_pieces"("content_piece_id");

-- CreateIndex
CREATE INDEX "content_pieces_campaign_id_idx" ON "content_pieces"("campaign_id");

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");

-- CreateIndex
CREATE INDEX "leads_source_medium_campaign_idx" ON "leads"("source", "medium", "campaign");

-- CreateIndex
CREATE INDEX "leads_content_piece_id_idx" ON "leads"("content_piece_id");

-- CreateIndex
CREATE INDEX "leads_current_status_idx" ON "leads"("current_status");

-- CreateIndex
CREATE INDEX "lead_events_lead_id_event_timestamp_idx" ON "lead_events"("lead_id", "event_timestamp");

-- CreateIndex
CREATE INDEX "lead_events_event_type_idx" ON "lead_events"("event_type");

-- CreateIndex
CREATE INDEX "lead_status_history_lead_id_changed_at_idx" ON "lead_status_history"("lead_id", "changed_at");

-- AddForeignKey
ALTER TABLE "content_pieces" ADD CONSTRAINT "content_pieces_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_events" ADD CONSTRAINT "lead_events_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_status_history" ADD CONSTRAINT "lead_status_history_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
