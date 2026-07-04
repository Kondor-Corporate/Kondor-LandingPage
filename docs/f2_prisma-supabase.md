# Prisma + Supabase - Fase 2

## Objetivo

Preparar Supabase/PostgreSQL como fuente de verdad de negocio usando Prisma como capa de schema, migraciones y cliente.

Esto reemplaza la idea de mantener migraciones SQL manuales para el piloto. Prisma queda como la forma principal de:

- modelar tablas;
- generar migraciones;
- aplicar cambios al Postgres de Supabase;
- consumir la base desde endpoints server-side.

## Archivos relevantes

- `prisma/schema.prisma`: modelo de datos del piloto.
- `.env.example`: variables `DATABASE_URL` y `DIRECT_URL`.
- `package.json`: scripts Prisma.

## Lo que tenes que hacer en el navegador

### 1. Crear el proyecto en Supabase

1. Entrar a [Supabase](https://supabase.com/dashboard).
2. Crear un nuevo proyecto para Kondor.
3. Guardar:
   - project ref;
   - database password;
   - region.

### 2. Copiar las URLs de conexion

En Supabase:

1. Ir a `Project Settings`.
2. Entrar a `Database`.
3. Buscar `Connection string`.
4. Copiar dos valores:
   - conexion pooled para runtime;
   - conexion directa/session para migraciones.

En `.env` completar:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

Notas:

- Reemplazar `PROJECT_REF`, `PASSWORD` y host/region por los valores reales de Supabase.
- Prisma CLI carga `.env` automaticamente, pero no `.env.local`.
- `DATABASE_URL` usa Transaction pooler en el puerto `6543`.
- `DIRECT_URL` puede usar Session pooler en el puerto `5432`. La conexion directa tambien sirve si el equipo tiene IPv6.
- No usar prefijo `VITE_` para estas variables.
- No commitear `.env`.

### 3. Aplicar migraciones versionadas

Cuando las variables esten cargadas, aplicar las migraciones que ya existen en el repositorio:

```bash
npm run prisma:deploy
```

Este comando no genera archivos nuevos: aplica en Supabase las migraciones versionadas pendientes.

`prisma:migrate` se usa solo al desarrollar un cambio nuevo de schema:

```bash
npm run prisma:migrate -- --name nombre_descriptivo
```

### 4. Verificar en Supabase

En el navegador:

1. Ir a `Table Editor`.
2. Confirmar que existen:
   - `campaigns`
   - `content_pieces`
   - `leads`
   - `lead_events`
   - `lead_status_history`
3. Confirmar que `leads.current_status` usa el enum `LeadStatus`.

### 5. Abrir Prisma Studio local

```bash
npm run prisma:studio
```

Sirve para inspeccionar el modelo sin construir un CRM.

## Modelo de datos

### `Campaign`

Representa una campania o iniciativa comercial.

Campos clave:

- `name`
- `source`
- `medium`
- `campaignCode`
- `objective`

### `ContentPiece`

Representa una pieza de contenido trazable.

Campos clave:

- `contentPieceId`
- `channel`
- `format`
- `pillar`
- `angle`
- `publishedAt`
- `url`
- `campaignId`

### `Lead`

Representa un contacto de negocio.

Campos clave:

- `name`
- `email`
- `phone`
- `source`
- `medium`
- `campaign`
- `contentPieceId`
- `landingPath`
- `entryPoint`
- `ctaId`
- `currentStatus`
- `metadata`

### `LeadEvent`

Registra eventos de negocio asociados a un lead.

Eventos iniciales esperados:

- `lead_created`
- `contact_form_submitted`
- `contact_intent_started`

### `LeadStatusHistory`

Registra cambios de estado del lead.

Estados:

- `NEW`
- `QUALIFIED`
- `MEETING_BOOKED`
- `PROPOSAL_SENT`
- `WON`
- `LOST`

## Seguridad

La landing no debe conectarse directamente a Supabase.

El flujo correcto es:

```text
Landing -> endpoint server-side -> Prisma -> Supabase Postgres
```

La clave y URL de base quedan en variables del lado servidor. Nunca deben exponerse con `VITE_`.

## Criterios de aceptacion

- Prisma modela las tablas minimas del piloto.
- `npm run prisma:deploy` puede aplicar el schema desde un checkout limpio.
- Las tablas soportan trazabilidad por canal, campania, pieza, landing path, entry point y CTA.
- El modelo soporta historial de estados.
- La base sigue siendo simple y transferible a MAPS.
- No se agregan tablas de CRM innecesarias.
