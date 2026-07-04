# Reporting para Data Studio - Fase 4

## Objetivo

Exponer metricas de negocio entendibles sin conectar Data Studio (antes Looker Studio) a las tablas crudas ni
incluir PII.

La separacion de fuentes se mantiene:

- GA4: volumen, sesiones y comportamiento web.
- Supabase/PostgreSQL: leads, atribucion y resultados de negocio.

## Vistas disponibles

| Vista | Granularidad | Uso principal |
| --- | --- | --- |
| `vw_leads_by_source` | fecha + source + medium | comparar origen de leads |
| `vw_leads_by_campaign` | fecha + campaign + source + medium | comparar campanias |
| `vw_leads_by_content_piece` | fecha + pieza + metadata de contenido | comparar piezas |
| `vw_lead_funnel` | fecha + etapa | construir funnel ejecutivo |
| `vw_channel_performance` | fecha + canal + medium | comparar canales y resultados |
| `vw_cta_performance` | fecha + CTA | comparar CTAs de origen |

`_vw_lead_reporting_base` es una vista interna. No debe conectarse a Data Studio ni recibir permisos para el
usuario de reporting.

## Diccionario de metricas

| Campo | Definicion |
| --- | --- |
| `lead_date` | fecha UTC de creacion del lead |
| `total_leads` | leads creados en la granularidad de la fila |
| `qualified_leads` | leads que alcanzaron `QUALIFIED` o una etapa posterior |
| `meeting_booked_leads` | leads que alcanzaron `MEETING_BOOKED` o una etapa posterior |
| `proposal_sent_leads` | leads que alcanzaron `PROPOSAL_SENT` o `WON` |
| `won_leads` | leads que alcanzaron `WON` |
| `lost_leads` | leads que alcanzaron `LOST` |
| `qualification_rate_pct` | `qualified_leads / total_leads * 100` |
| `meeting_rate_pct` | `meeting_booked_leads / total_leads * 100` |
| `proposal_rate_pct` | `proposal_sent_leads / total_leads * 100` |
| `win_rate_pct` | `won_leads / total_leads * 100` |
| `lead_count` | leads que alcanzaron la etapa de `vw_lead_funnel` |
| `conversion_from_total_pct` | `lead_count / leads creados en la fecha * 100` |

Los hitos se calculan desde `lead_status_history`. `current_status` funciona como respaldo para estados activos cuando
falta un registro historico. Se asume que `WON` y `LOST` son estados terminales y que no se reabre un lead en este
piloto.

Los valores sin atribucion se normalizan como `(not_set)`.

## Reglas de agregacion en Data Studio

Los campos de conteo usan agregacion `SUM`.

Los campos `*_rate_pct` ya estan calculados para la granularidad de cada fila. No deben sumarse. Para scorecards o
graficos que agrupen varias fechas o dimensiones, crear campos calculados ponderados:

```text
Qualification rate = SUM(qualified_leads) / SUM(total_leads)
Meeting rate = SUM(meeting_booked_leads) / SUM(total_leads)
Proposal rate = SUM(proposal_sent_leads) / SUM(total_leads)
Win rate = SUM(won_leads) / SUM(total_leads)
```

Mostrar estos campos con formato `Percent(2)`. Las formulas devuelven una razon de `0` a `1`, que Data Studio
convierte visualmente a porcentaje. No multiplicar por `100`: el conector PostgreSQL puede rechazar esa expresion al
combinar conteos `INT64` con el resultado decimal `FLOAT64`.

Los campos existentes `*_rate_pct` si estan expresados de `0` a `100`. Solo deben usarse sin reagrupar las filas y
deben conservar formato numerico, no `Percent`.

En `vw_lead_funnel`, sumar `lead_count` por `stage_key` para rangos de varias fechas. No sumar
`conversion_from_total_pct`.

## Mapeo de dashboards

### Dashboard ejecutivo

Fuente principal: `vw_lead_funnel`.

- Funnel: `stage_label` como dimension, `lead_count` como metrica y `stage_order` para ordenar.
- Conversion total: `conversion_from_total_pct`.
- Filtro de fecha: `lead_date`.

Complementar con scorecards desde `vw_channel_performance`:

- total de leads;
- leads calificados;
- reuniones;
- propuestas;
- ganados;
- perdidos;
- win rate.

### Dashboard de adquisicion

- Canales: `vw_channel_performance`.
- Source/medium: `vw_leads_by_source`.
- Campanias: `vw_leads_by_campaign`.
- Piezas: `vw_leads_by_content_piece`.
- CTAs: `vw_cta_performance`.

Ordenar tablas por `total_leads`, `qualified_leads` o `won_leads` segun la pregunta. No evaluar calidad de una pieza
solo por volumen: usar tambien `qualification_rate_pct` y `win_rate_pct`.

### GA4

Conectar GA4 como una fuente separada para sesiones, trafico y comportamiento. No mezclar sesiones de GA4 con filas
de leads mediante joins directos: en este piloto la comparacion debe hacerse por periodo y dimensiones compatibles
como source, medium y campaign.

## Usuario read-only para Data Studio

No usar el usuario `postgres` ni compartir `DATABASE_URL`.

Desde Supabase SQL Editor, crear un usuario exclusivo con una contrasenia generada por password manager:

```sql
CREATE ROLE looker_reporting
WITH LOGIN
PASSWORD 'REEMPLAZAR_CON_PASSWORD_SEGURA'
NOSUPERUSER
NOCREATEDB
NOCREATEROLE
NOINHERIT;

GRANT CONNECT ON DATABASE postgres TO looker_reporting;
GRANT USAGE ON SCHEMA public TO looker_reporting;

GRANT SELECT ON
  public.vw_leads_by_source,
  public.vw_leads_by_campaign,
  public.vw_leads_by_content_piece,
  public.vw_lead_funnel,
  public.vw_channel_performance,
  public.vw_cta_performance
TO looker_reporting;
```

Supabase recomienda crear un usuario distinto para cada servicio externo y otorgar solo los permisos necesarios:
[Postgres Roles](https://supabase.com/docs/guides/database/postgres/roles).

## Conexion desde Data Studio

1. Entrar a Data Studio con la cuenta de Kondor.
2. Crear una fuente de datos.
3. Elegir el conector oficial `PostgreSQL`.
4. Usar la conexion **Session pooler** de Supabase:
   - host: el host `*.pooler.supabase.com` mostrado en `Connect`;
   - puerto: `5432`;
   - database: `postgres`;
   - usuario: `looker_reporting.PROJECT_REF`;
   - password: la contrasenia creada para `looker_reporting`.
5. Habilitar SSL. El certificado raiz se obtiene desde `Connect` en Supabase.
6. Seleccionar una vista de reporting.
7. Crear una fuente de datos independiente por cada vista necesaria.
8. Confirmar que `lead_date` sea tipo `Date` y que los campos `*_pct` sean numericos.

El conector PostgreSQL permite seleccionar una tabla o vista y configurar SSL:
[Looker Studio PostgreSQL](https://docs.cloud.google.com/looker/docs/studio/connect-to-postgresql?hl=es).
Supabase recomienda Session pooler para clientes persistentes que requieren IPv4:
[Supabase database connections](https://supabase.com/docs/guides/database/connecting-to-postgres).

## Consultas de verificacion

```sql
SELECT * FROM vw_leads_by_source ORDER BY lead_date DESC LIMIT 100;
SELECT * FROM vw_leads_by_campaign ORDER BY lead_date DESC LIMIT 100;
SELECT * FROM vw_leads_by_content_piece ORDER BY lead_date DESC LIMIT 100;
SELECT * FROM vw_lead_funnel ORDER BY lead_date DESC, stage_order;
SELECT * FROM vw_channel_performance ORDER BY lead_date DESC LIMIT 100;
SELECT * FROM vw_cta_performance ORDER BY lead_date DESC LIMIT 100;
```

## Criterios de aceptacion

- Data Studio puede consultar solo vistas agregadas.
- Ninguna vista publica contiene nombre, email, telefono, empresa o mensaje.
- Los filtros de fecha usan `lead_date`.
- El funnel distingue progresion (`QUALIFIED`, reunion, propuesta) de resultados (`WON`, `LOST`).
- Las vistas responden canal, campania, pieza y CTA sin consultar tablas crudas.
