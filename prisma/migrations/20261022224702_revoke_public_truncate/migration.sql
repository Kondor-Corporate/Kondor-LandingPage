REVOKE TRUNCATE ON TABLE
  public."_prisma_migrations",
  public.campaigns,
  public.content_pieces,
  public.lead_events,
  public.lead_status_history,
  public.leads
FROM anon, authenticated;
