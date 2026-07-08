# Kondor Landing Page

Landing corporativa de Kondor con un piloto de medicion de adquisicion y conversion.

## Arquitectura del piloto

```text
Landing
  |-- dataLayer -> GTM -> GA4
  |-- formulario -> /api/leads -> Prisma -> Supabase/PostgreSQL
                                              |
                                              -> vistas agregadas -> Data Studio
```

- GA4 conserva comportamiento web y eventos de volumen.
- Supabase/PostgreSQL es la fuente de verdad para leads, atribucion y resultados.
- Data Studio consulta vistas agregadas sin PII.
- Formspree queda como notificacion auxiliar, no como fuente de verdad.

## Inicio rapido

Requisitos:

- Node.js 20 o superior;
- npm;
- un proyecto Supabase si se probaran persistencia y reporting.

```powershell
npm ci
Copy-Item .env.example .env
npm run prisma:generate
npm run dev
```

Vite levanta el frontend, pero no ejecuta `api/leads.js`. Sin un runtime server-side, el formulario usa Formspree si
`VITE_LEAD_INGESTION_ENDPOINT` no esta configurada.

Para preparar una base nueva desde las migraciones versionadas:

```powershell
npm run prisma:deploy
```

## QA

Con `.env` conectado al proyecto Supabase:

```powershell
npm run test:pilot
```

La suite valida build, UTMs, estado de migraciones, ingesta, eventos, atribucion y vistas de reporting. Los registros
temporales se eliminan o revierten al finalizar.

| Comando | Uso |
| --- | --- |
| `npm run build` | build de produccion |
| `npm run test:attribution` | UTMs, referrer, persistencia y `dataLayer` |
| `npm run test:lead-ingestion` | lead, eventos e historial contra Supabase |
| `npm run test:reporting-views` | metricas, funnel y ausencia de PII |
| `npm run prisma:status` | estado de migraciones |
| `npm run prisma:studio` | inspeccion operativa local |

## Documentacion

| Fase | Documento |
| --- | --- |
| 0-1 | [Arquitectura y auditoria](docs/f0_f1_analytics-pilot-architecture.md) |
| 0-1 | [Setup GTM, GA4 y Search Console](docs/setup-fase-0-1.md) |
| 1 | [Taxonomia de eventos](docs/event-taxonomy.md) |
| 1-3 | [Variables de entorno](docs/env-vars.md) |
| 2 | [Prisma y Supabase](docs/f2_prisma-supabase.md) |
| 3 | [Ingesta de leads](docs/f3_lead-ingestion.md) |
| 4 | [Reporting y Data Studio](docs/f4_reporting-looker-studio.md) |
| 5 | [QA, operacion y handoff a MAPS](docs/f5_qa-handoff.md) |

## Estado

Las fases 0 a 5 estan implementadas y validadas localmente contra Supabase. El despliegue, las variables del hosting
y los accesos a productos externos se configuran fuera del repositorio siguiendo el handoff de Fase 5.
