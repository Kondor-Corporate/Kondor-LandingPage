# Piloto de analytics Kondor - Fase 0 y Fase 1

## Alcance

Este documento define el diagnostico inicial del repo y la arquitectura minima para instrumentar la landing publica de Kondor sin convertirla en una plataforma enterprise.

Alcance implementado en esta etapa:

- Fase 0: auditoria inicial, propuesta tecnica, supuestos y criterios de aceptacion.
- Fase 1: tracking web inicial, persistencia local de atribucion y eventos minimos hacia `dataLayer`/GA4.

Fuera de alcance en esta etapa:

- Persistencia de leads en Supabase.
- Migraciones SQL.
- CRM interno.
- Vistas de reporting para Looker Studio.
- Ingesta automatica de metricas desde redes sociales o Search Console.

## Auditoria del repo actual

### Stack

- Vite 5.
- React 18.
- Tailwind CSS 3.
- Framer Motion para animaciones.
- Lucide React para iconos.
- Formulario de contacto controlado con estado local de React.
- No hay backend ni DB configurados antes de este piloto.

### Estructura relevante

- `src/App.jsx`: compone la landing y modales.
- `src/main.jsx`: punto de entrada React.
- `src/components/Navbar.jsx`: navegacion y CTA superior.
- `src/components/HeroSection.jsx`: CTA principal hacia contacto.
- `src/components/CTASection.jsx`: CTA final y link a portfolio.
- `src/components/Footer.jsx`: email, redes sociales, navegacion, legales y CTA inferior.
- `src/components/ContactFormModal.jsx`: formulario modal actual.
- `src/components/TeamSection.jsx`: links externos a LinkedIn de fundadores.
- `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`: base SEO ya existente.

### Captura de leads actual

Hoy existe formulario de contacto en modal y envia a Formspree:

- Variables actuales: `VITE_FORMSPREE_FORM_ID` o `VITE_FORMSPREE_ENDPOINT`.
- Campos: `name`, `email`, `company`, `message`, honeypot `website`.
- Resultado: mensaje enviado a Formspree, no a una base propia.

Esto es suficiente como canal operativo temporal, pero no es fuente de verdad de negocio para el piloto completo.

### CTAs y links actuales

| Ubicacion | Tipo | Destino actual | Instrumentacion Fase 1 |
| --- | --- | --- | --- |
| Navbar desktop | CTA | abre modal de contacto | `cta_click`, `contact_click`, `lead_form_view` |
| Navbar mobile | CTA | abre modal de contacto | `cta_click`, `contact_click`, `lead_form_view` |
| Hero | CTA | ancla `#contacto` | `cta_click`, `contact_click` |
| CTA final | CTA | abre modal de contacto | `cta_click`, `contact_click`, `lead_form_view` |
| CTA final | Link interno | ancla `#portfolio` | `cta_click` |
| Footer | Email | `mailto:kondorcorporate@gmail.com` | `contact_click` |
| Footer | CTA | abre modal de contacto | `cta_click`, `contact_click`, `lead_form_view` |
| Footer | Redes | Instagram, LinkedIn, TikTok | `outbound_click` |
| Team | Redes | LinkedIn de fundadores | `outbound_click` |
| Legal | Botones | modales internos | sin tracking por ahora |

No se detecto:

- Boton a WhatsApp.
- Link de calendario o agenda.
- Backend propio.
- Supabase configurado.
- GA4/GTM previo.

## Arquitectura minima propuesta

### Principio

GA4/GTM captura comportamiento web y volumen. Supabase/PostgreSQL debe quedar reservado para eventos de negocio valiosos en fases posteriores.

### Capa de captura web

Implementada en `src/lib/analytics.js`.

Responsabilidades:

- Inicializar `dataLayer`.
- Cargar Google Tag Manager si existe `VITE_GTM_ID`.
- Cargar GA4 directo si existe `VITE_GA4_MEASUREMENT_ID` y no hay GTM.
- Persistir atribucion inicial:
  - `utm_source`
  - `utm_medium`
  - `utm_campaign`
  - `utm_content`
  - `utm_term`
  - `content_piece_id`
  - `landing_path`
  - `entry_point`
  - `referrer`
- Emitir eventos sin bloquear la UX.

### Capa de consolidacion futura

No implementada en Fase 0/Fase 1.

Arquitectura minima recomendada para fases siguientes:

- Supabase/PostgreSQL como fuente de verdad.
- Prisma como capa de schema, migraciones y cliente de acceso a Supabase Postgres.
- Endpoint server-side para crear leads y eventos de negocio.
- Tablas sugeridas:
  - `campaigns`
  - `content_pieces`
  - `leads`
  - `lead_events`
  - `lead_status_history`

La landing no debe escribir directo a Supabase con service role desde el navegador.

### Capa de visualizacion futura

Looker Studio debe consumir GA4 para comportamiento web y Supabase/PostgreSQL para negocio. En esta fase solo queda preparado el naming para que el cruce posterior sea consistente.

## Datos por destino

### GA4 / GTM

Van a GA4/GTM:

- `page_view`
- `cta_click`
- `contact_click`
- `outbound_click`
- `lead_form_view`
- `lead_form_submit`

Los eventos incluyen datos de atribucion, pero no incluyen datos personales del formulario.

### Supabase / PostgreSQL

Debe ir a Supabase en fases posteriores:

- Lead creado.
- Origen del lead.
- Campania.
- Pieza de contenido.
- CTA de origen.
- Estados del lead.
- Historial de cambios de estado.
- Resultado ganado/perdido y motivo.

No se guarda en Supabase en Fase 1.

## Supuestos

- `content_piece_id` puede venir por URL como `content_piece_id`, `content_piece` o `cpid`.
- Si no hay UTMs, se preserva atribucion previa por hasta 90 dias.
- Si no hay UTMs previas y hay referrer externo, se usa `source=<hostname>` y `medium=referral`.
- Si no hay UTMs ni referrer externo, se usa `source=direct` y `medium=none`.
- Formspree sigue funcionando como canal operativo hasta que Fase 3 conecte Supabase.
- Search Console requiere verificacion manual del dominio; el codigo no puede resolver esa aprobacion por si solo.

## Criterios de aceptacion

Fase 0:

- El diagnostico indica stack, estructura, CTAs, formulario y links externos actuales.
- Queda claro que GA4/GTM mide comportamiento web y Supabase sera fuente de verdad de negocio.
- Queda definido el funnel piloto de Kondor:
  `pieza/campania -> visita web -> CTA/contacto -> formulario -> lead futuro -> calificacion -> reunion -> propuesta -> ganado/perdido`.
- Quedan listados supuestos y limites.

Fase 1:

- La landing inicializa `dataLayer` sin romper si faltan variables de entorno.
- Los eventos minimos se pueden inspeccionar en GTM Preview, GA4 DebugView o consola revisando `window.dataLayer`.
- La atribucion por UTMs y `content_piece_id` se conserva entre navegaciones razonables.
- No se envia PII a GA4/GTM.
- La UX visual no cambia.
