# Ingesta de leads - Fase 3

## Objetivo

Conectar el formulario publico de la landing con Supabase/PostgreSQL usando Prisma como capa de acceso.

Flujo implementado:

```text
ContactFormModal -> /api/leads -> Prisma Client -> Supabase Postgres
```

Formspree queda como notificacion operativa best-effort. La fuente de verdad es Supabase.

## Archivos relevantes

- `api/leads.js`: endpoint server-side.
- `src/lib/leadCapture.js`: cliente de envio desde la landing.
- `src/components/ContactFormModal.jsx`: submit del formulario.
- `prisma/schema.prisma`: modelo de negocio.

## Datos persistidos

Al enviar el formulario se crea:

1. Un `Lead`.
2. Un `LeadEvent` con `eventType=lead_created`.
3. Un `LeadEvent` con `eventType=contact_form_submitted`.
4. Un `LeadStatusHistory` con `toStatus=NEW`.

El lead guarda:

- `name`
- `email`
- `source`
- `medium`
- `campaign`
- `contentPieceId`
- `landingPath`
- `entryPoint`
- `ctaId`
- `metadata.company`
- `metadata.message`

## Variables necesarias

Servidor:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

Cliente:

```env
VITE_LEAD_INGESTION_ENDPOINT=/api/leads
```

La variable debe quedar sin configurar durante Fases 0/1. En ese caso el formulario sigue enviando por Formspree.
Configurarla activa la persistencia obligatoria en Supabase y deja Formspree como notificacion best-effort.

## Pasos para probar punta a punta

### 1. Completar Supabase

Seguir `docs/f2_prisma-supabase.md`.

Cuando el proyecto exista y `.env` tenga `DATABASE_URL` y `DIRECT_URL`, correr:

```bash
npm run prisma:deploy
```

### 2. Generar Prisma Client

```bash
npm run prisma:generate
```

### 3. Validar persistencia contra Supabase

```bash
npm run test:lead-ingestion
```

El smoke test crea un lead temporal mediante `api/leads.js`, verifica atribucion, eventos e historial, y elimina ese
registro al finalizar para no contaminar reporting.

### 4. Correr un entorno que soporte `/api`

Vite puro no ejecuta `api/leads.js`.

Opciones:

- desplegar en Vercel;
- usar Vercel CLI con `vercel dev`;
- adaptar el endpoint al hosting elegido.

### 5. Configurar Vercel

Agregar en Production y Preview:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
VITE_LEAD_INGESTION_ENDPOINT=/api/leads
```

`DATABASE_URL` y `DIRECT_URL` son privadas. Solo `VITE_LEAD_INGESTION_ENDPOINT` se incorpora al frontend.

### 6. Enviar un formulario con UTMs

Ejemplo:

```text
/?utm_source=instagram&utm_medium=social&utm_campaign=piloto_kondor&utm_content=reel_01&content_piece_id=ig_reel_01
```

Completar el formulario y enviarlo.

### 7. Verificar en Supabase

En Table Editor o Prisma Studio:

- existe un registro en `leads`;
- `source=instagram`;
- `medium=social`;
- `campaign=piloto_kondor`;
- `content_piece_id=ig_reel_01`;
- `cta_id` refleja el boton que abrio el formulario;
- existen eventos en `lead_events`;
- existe historial inicial en `lead_status_history`.

## Criterios de aceptacion

- Un lead real puede crearse de punta a punta.
- El lead queda asociado a fuente, medio, campania, pieza y CTA.
- El historial inicial queda en `NEW`.
- GA4/GTM sigue recibiendo eventos de comportamiento.
- GA4/GTM no recibe `lead_id`, nombre, email, empresa ni mensaje.
- Formspree no es fuente de verdad.

## Supuestos

- El primer estado siempre es `NEW`.
- Los estados posteriores se pueden actualizar manualmente desde Supabase/Prisma Studio hasta que exista una interfaz interna.
- El endpoint corre en un entorno server-side con variables privadas disponibles.
