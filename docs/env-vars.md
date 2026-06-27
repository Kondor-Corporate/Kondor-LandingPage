# Variables de entorno - Analytics piloto

## Variables existentes

### `VITE_FORMSPREE_FORM_ID`

ID corto del formulario de Formspree.

Ejemplo:

```env
VITE_FORMSPREE_FORM_ID=xreorjeo
```

### `VITE_FORMSPREE_ENDPOINT`

Endpoint completo alternativo. Si existe, tiene prioridad sobre `VITE_FORMSPREE_FORM_ID`.

Ejemplo:

```env
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id_here
```

## Variables nuevas para Fase 1

### `VITE_GTM_ID`

ID del contenedor de Google Tag Manager.

Ejemplo:

```env
VITE_GTM_ID=GTM-XXXXXXX
```

Uso recomendado para produccion:

- Configurar GTM como contenedor principal.
- Crear tags GA4 dentro de GTM.
- Usar Preview Mode para validar `dataLayer`.

### `VITE_GA4_MEASUREMENT_ID`

Measurement ID de GA4.

Ejemplo:

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

Uso:

- Fallback directo si todavia no hay GTM.
- Si `VITE_GTM_ID` existe, la app no carga GA4 directo para evitar doble medicion.

### `VITE_GOOGLE_SITE_VERIFICATION`

Token de verificacion de Google Search Console.

Ejemplo:

```env
VITE_GOOGLE_SITE_VERIFICATION=google-site-verification-token
```

Estado actual:

- No se inyecta automaticamente en `index.html` para evitar publicar un placeholder invalido.
- Cuando Google entregue el token real, agregar temporalmente:

```html
<meta name="google-site-verification" content="TOKEN_REAL_DE_GOOGLE" />
```

Despues de verificar el dominio, puede mantenerse o retirarse segun el metodo de verificacion elegido.

### `VITE_LEAD_INGESTION_ENDPOINT`

Endpoint publico al que el formulario envia leads.

```env
VITE_LEAD_INGESTION_ENDPOINT=/api/leads
```

En deploy same-origin se puede dejar el valor default. Si se usa otro host para API, apuntar a la URL completa.

## Setup recomendado

### Local

1. Crear `.env`.
2. Agregar al menos una de estas variables:

```env
VITE_GTM_ID=GTM-XXXXXXX
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. Ejecutar `npm run dev`.
4. Abrir DevTools y revisar `window.dataLayer`.

### Vercel

Configurar variables en Project Settings -> Environment Variables:

- `VITE_GTM_ID`
- `VITE_GA4_MEASUREMENT_ID` si no se usa GTM.
- `VITE_FORMSPREE_FORM_ID` o `VITE_FORMSPREE_ENDPOINT`.

Luego redeploy.

## Search Console

Pasos:

1. Crear propiedad para `https://kondorcorporate.com/`.
2. Preferir verificacion por DNS si el equipo tiene acceso al dominio.
3. Alternativa: usar meta tag de verificacion en `index.html`.
4. Enviar sitemap:

```text
https://kondorcorporate.com/sitemap.xml
```

5. Confirmar que `robots.txt` responde:

```text
https://kondorcorporate.com/robots.txt
```

## Criterios de aceptacion de configuracion

- En local, `window.dataLayer` existe aunque no haya GTM/GA4 configurado.
- Con `VITE_GTM_ID`, GTM Preview detecta el contenedor.
- Con GA4 activo, DebugView muestra:
  - `page_view`
  - `cta_click`
  - `contact_click`
  - `outbound_click`
  - `lead_form_view`
  - `lead_form_submit`
- No hay doble carga de GA4 cuando GTM esta activo.

## Variables nuevas para Fase 2 y Fase 3

### `DATABASE_URL`

URL de conexion runtime para Prisma.

En Supabase, usar preferentemente la conexion pooled para despliegues serverless:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

### `DIRECT_URL`

URL directa para migraciones Prisma.

```env
DIRECT_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

Prisma CLI carga `.env` automaticamente. No exponer ninguna de estas variables con prefijo `VITE_`; deben existir
solo del lado servidor/local.
