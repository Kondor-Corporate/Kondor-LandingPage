# QA, operacion y handoff a MAPS - Fase 5

## Objetivo

Dejar el piloto de Kondor reproducible, operable y transferible a MAPS sin convertirlo en un CRM ni en una
plataforma de datos enterprise.

## Estado validado

| Area | Estado | Evidencia |
| --- | --- | --- |
| Build | listo | `npm run build` |
| UTMs y entry context | listo | `npm run test:attribution` |
| GTM y GA4 | validado manualmente | Preview y DebugView |
| Schema y migraciones | listo | `npm run prisma:status` |
| Ingesta de leads | listo | `npm run test:lead-ingestion` |
| Eventos e historial inicial | listo | smoke de ingesta |
| Vistas sin PII | listo | `npm run test:reporting-views` |
| Dashboard de negocio | validado manualmente | fixture temporal en Data Studio |
| Search Console | configuracion externa | verificar propiedad y sitemap antes de produccion |
| Deploy del endpoint | configuracion externa | requiere hosting y variables privadas |

La validacion de Data Studio uso nueve leads controlados para cubrir source, medium, campaign, pieza, CTA y todos los
estados del funnel. Los datos, campanias y piezas temporales fueron eliminados despues de la prueba.

## Setup desde un checkout limpio

### 1. Instalar y configurar

```powershell
npm ci
Copy-Item .env.example .env
npm run prisma:generate
```

Completar `.env` segun [Variables de entorno](env-vars.md). Nunca commitear credenciales.

### 2. Preparar Supabase

Para un proyecto nuevo o una base sin migraciones aplicadas:

```powershell
npm run prisma:deploy
npm run prisma:status
```

`prisma:deploy` aplica las migraciones versionadas. `prisma:migrate` se reserva para desarrollar cambios nuevos de
schema.

### 3. Levantar la landing

```powershell
npm run dev
```

Vite sirve la landing en local. No ejecuta la funcion `api/leads.js`.

- Sin `VITE_LEAD_INGESTION_ENDPOINT`, el formulario usa Formspree.
- Con `VITE_LEAD_INGESTION_ENDPOINT=/api/leads`, el runtime debe soportar la funcion server-side.
- Para una prueba completa, usar un entorno local del hosting o un despliegue Preview con las variables privadas.

### 4. Ejecutar QA

```powershell
npm run test:pilot
```

Resultado esperado:

- build exitoso;
- UTMs explicitas, referral y direct verificados;
- migraciones al dia;
- lead temporal con dos eventos y estado inicial `NEW`;
- seis vistas de reporting consultables y sin PII;
- limpieza verificada.

## Variables y secretos

| Variable | Ambito | Obligatoria |
| --- | --- | --- |
| `VITE_GTM_ID` | frontend | si GTM es el cargador principal |
| `VITE_GA4_MEASUREMENT_ID` | frontend | solo como alternativa sin GTM |
| `VITE_FORMSPREE_FORM_ID` / `VITE_FORMSPREE_ENDPOINT` | frontend | para notificacion por correo |
| `VITE_LEAD_INGESTION_ENDPOINT` | frontend | para persistir negocio |
| `DATABASE_URL` | servidor | para Prisma runtime |
| `DIRECT_URL` | servidor/local | para migraciones |

Reglas:

- Ninguna URL de base puede tener prefijo `VITE_`.
- No compartir `DATABASE_URL` con Data Studio.
- Data Studio usa el rol read-only `looker_reporting`.
- GA4/GTM no reciben nombre, email, empresa, mensaje ni `lead_id`.

## Orden de despliegue

Los pasos externos deben ejecutarse manualmente en las cuentas de Kondor:

1. Confirmar el proyecto y password de base en Supabase.
2. Configurar `DATABASE_URL` y `DIRECT_URL` en el hosting.
3. Aplicar `npm run prisma:deploy` desde un entorno autorizado.
4. Configurar las variables `VITE_*` del build.
5. Desplegar un Preview y probar una URL con UTMs.
6. Confirmar el lead, eventos e historial en Supabase.
7. Confirmar eventos sin PII en GTM Preview y GA4 DebugView.
8. Desplegar a produccion.
9. Validar el dominio real y actualizar Data Studio.

No ejecutar `prisma migrate dev` durante un deploy.

## Operacion de leads

### Fuente de verdad

- GA4: visitas, sesiones, clicks y comportamiento.
- Supabase: lead, atribucion, estado, historial y resultado comercial.
- Data Studio: lectura agregada; nunca se edita negocio desde el dashboard.

### Cambios de estado

Hasta que exista una interfaz interna, los estados se actualizan mediante Prisma Studio o SQL controlado. Cada cambio
debe actualizar `leads.current_status` y crear `lead_status_history` en la misma transaccion.

Ejemplo para pasar un lead a `QUALIFIED`:

```sql
BEGIN;

INSERT INTO lead_status_history (
  lead_id,
  from_status,
  to_status,
  changed_at,
  changed_by,
  reason
)
SELECT
  id,
  current_status,
  'QUALIFIED',
  NOW(),
  'manual:equipo_comercial',
  'Lead validado'
FROM leads
WHERE id = 'REEMPLAZAR_UUID'
  AND current_status <> 'QUALIFIED';

UPDATE leads
SET current_status = 'QUALIFIED'
WHERE id = 'REEMPLAZAR_UUID'
  AND current_status <> 'QUALIFIED';

COMMIT;
```

Estados permitidos:

```text
NEW -> QUALIFIED -> MEETING_BOOKED -> PROPOSAL_SENT -> WON
Cualquier estado no terminal -> LOST
```

`WON` y `LOST` son terminales para este piloto. No modificar solo `current_status`, porque el funnel se reconstruye
principalmente desde el historial.

### Disciplina de atribucion

Toda URL de campania debe usar:

```text
?utm_source=SOURCE&utm_medium=MEDIUM&utm_campaign=CAMPAIGN&utm_content=CONTENT&content_piece_id=PIECE_ID
```

El `content_piece_id` debe coincidir con `content_pieces.content_piece_id` para enriquecer reportes con canal, formato,
pilar y angulo. `cta_id`, `landing_path` y `entry_point` se capturan desde la landing.

## Data Studio

El informe usa seis fuentes independientes:

- `vw_leads_by_source`;
- `vw_leads_by_campaign`;
- `vw_leads_by_content_piece`;
- `vw_lead_funnel`;
- `vw_channel_performance`;
- `vw_cta_performance`.

Paginas validadas:

- `Resumen ejecutivo`;
- `Adquisicion`.

Para periodos con varias filas, las tasas deben ser ponderadas:

```text
SUM(qualified_leads) / SUM(total_leads)
SUM(won_leads) / SUM(total_leads)
```

Usar formato `Percent(2)`. No sumar ni promediar directamente campos `*_rate_pct`.

El informe es un recurso externo al repositorio. Compartirlo con las cuentas del equipo y conservar el rol
`looker_reporting` con permisos solo sobre las vistas publicas.

## Transferencia a MAPS

### Reutilizable sin cambios conceptuales

- contrato de UTMs y `content_piece_id`;
- persistencia first-touch con TTL;
- wrapper de `dataLayer`;
- separacion GA4 versus PostgreSQL;
- endpoint server-side como unica entrada a la base;
- `leads`, `lead_events` y `lead_status_history`;
- rol read-only y vistas agregadas;
- smoke tests con limpieza.

### Adaptar para MAPS

- nombres de CTAs y entry points;
- taxonomia de campanias y piezas;
- campos propios del proceso comercial;
- estados si el funnel comercial difiere;
- copy y formularios de captura;
- dashboard y dimensiones de negocio.

### Extender solo cuando exista ecommerce o cotizador

- entidad `quotes` o `quote_requests`;
- historial de estados de cotizacion;
- productos, items, ordenes y pagos si existe checkout;
- eventos `quote_started`, `quote_submitted`, `checkout_started` y `purchase`;
- identificadores server-side para reconciliar conversiones.

No almacenar microeventos web en PostgreSQL: GA4 sigue siendo la capa para volumen.

## Backlog posterior al piloto

### Antes de produccion

- pushear y revisar los commits de las fases;
- configurar variables en Preview y Production;
- ejecutar `npm run prisma:deploy`;
- validar un lead real desde el dominio publico;
- confirmar Search Console y sitemap;
- compartir el informe de Data Studio con el equipo.

### Segunda iteracion

- interfaz interna autenticada para cambiar estados;
- idempotencia y rate limiting del endpoint publico;
- validacion de email y proteccion anti-spam adicional;
- CI para build y smoke de atribucion;
- QA de base en un proyecto Supabase no productivo;
- automatizacion de catalogo de campanias y piezas.

### Fuera de alcance actual

- CRM completo;
- BigQuery;
- ingesta masiva de eventos web en PostgreSQL;
- observabilidad avanzada;
- ecommerce, cotizador y pagos.

## Checklist de aceptacion

- [x] Otro desarrollador puede instalar, configurar y levantar el frontend.
- [x] Las migraciones se aplican desde archivos versionados.
- [x] UTMs, lead, eventos, historial y reporting tienen smoke tests.
- [x] El funnel y la fuente de verdad estan documentados.
- [x] Data Studio consulta vistas agregadas sin PII.
- [x] La separacion entre estado actual y segunda etapa es explicita.
- [x] Los componentes transferibles a MAPS estan identificados.
- [ ] El equipo debe ejecutar y validar el deploy externo.
- [ ] El equipo debe confirmar Search Console en el dominio productivo.
