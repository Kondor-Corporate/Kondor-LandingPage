# Setup Fase 0 y Fase 1

## Estado del repo

Fase 0 y Fase 1 ya tienen base de codigo:

- auditoria y arquitectura documentadas;
- taxonomia de eventos;
- capa `dataLayer`/GA4/GTM en `src/lib/analytics.js`;
- persistencia local de UTMs y `content_piece_id`;
- eventos cableados en CTAs, formulario y links externos.

Este documento cubre el setup externo necesario para empezar a validar medicion real.

## Cuentas y accesos necesarios

Necesitas acceso a:

- Google Tag Manager;
- Google Analytics;
- Google Search Console;
- DNS o hosting del dominio `kondorcorporate.com` si se verifica Search Console por dominio.

## 1. Google Analytics 4

1. Entrar a `https://analytics.google.com`.
2. Crear una cuenta o usar la cuenta de Kondor.
3. Crear una propiedad GA4 para Kondor.
4. Crear un Web data stream para:

```text
https://kondorcorporate.com/
```

5. Copiar el Measurement ID, con formato:

```text
G-XXXXXXXXXX
```

6. Guardarlo como:

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

Si se usa GTM, este ID se configura dentro de GTM y no hace falta cargar GA4 directo desde el frontend.

## 2. Google Tag Manager

1. Entrar a `https://tagmanager.google.com`.
2. Crear una cuenta para Kondor si no existe.
3. Crear un container tipo `Web` para:

```text
kondorcorporate.com
```

4. Copiar el Container ID:

```text
GTM-XXXXXXX
```

5. Guardarlo como:

```env
VITE_GTM_ID=GTM-XXXXXXX
```

6. En GTM, crear tags/triggers para leer los eventos enviados a `dataLayer`.

Eventos ya disponibles:

- `page_view`
- `cta_click`
- `contact_click`
- `outbound_click`
- `lead_form_view`
- `lead_form_submit`

## 3. Variables locales

Crear `.env` en la raiz del repo:

```env
VITE_GTM_ID=GTM-XXXXXXX
VITE_GA4_MEASUREMENT_ID=
VITE_FORMSPREE_FORM_ID=your_form_id_here
```

Notas:

- Si `VITE_GTM_ID` existe, la app no carga GA4 directo para evitar doble medicion.
- Si todavia no hay GTM, se puede usar `VITE_GA4_MEASUREMENT_ID` directo.
- `VITE_FORMSPREE_FORM_ID` recibe solo el ID, no la URL completa.
- Durante Fases 0/1 no configurar `VITE_LEAD_INGESTION_ENDPOINT`: Vite no ejecuta `api/leads.js`.
- Despues de configurar Supabase y un runtime server-side, habilitar `VITE_LEAD_INGESTION_ENDPOINT=/api/leads`.
- `.env` no se commitea.

## 4. Variables en hosting

En el hosting de produccion/staging, cargar:

```env
VITE_GTM_ID=GTM-XXXXXXX
VITE_GA4_MEASUREMENT_ID=
VITE_FORMSPREE_FORM_ID=your_form_id_here
```

Para Fase 0/1 no hacen falta `DATABASE_URL` ni `DIRECT_URL`.

## 5. Search Console

1. Entrar a `https://search.google.com/search-console`.
2. Crear propiedad para `kondorcorporate.com`.
3. Preferir verificacion por DNS si hay acceso al dominio.
4. Si se usa meta tag, copiar el token que entrega Google y agregarlo en `index.html`.
5. Enviar sitemap:

```text
https://kondorcorporate.com/sitemap.xml
```

6. Verificar robots:

```text
https://kondorcorporate.com/robots.txt
```

## 6. Validacion local

1. Ejecutar:

```bash
npm run dev
```

2. Abrir una URL con UTMs:

```text
http://localhost:5173/?utm_source=instagram&utm_medium=social&utm_campaign=setup_fase_1&utm_content=test_post&content_piece_id=test_001
```

3. Abrir DevTools y ejecutar:

```js
window.dataLayer
```

4. Confirmar que aparecen eventos con:

- `source=instagram`;
- `medium=social`;
- `campaign=setup_fase_1`;
- `content_piece_id=test_001`.

5. Probar:

- click en CTA principal;
- abrir formulario;
- enviar formulario de prueba y confirmar respuesta exitosa de Formspree;
- click en redes externas.

En esta etapa no debe aparecer una solicitud a `/api/leads`. Esa ruta se habilita al completar Supabase y ejecutar la
landing en un entorno que soporte funciones server-side.

## 7. Validacion en GTM/GA4

1. En GTM, usar Preview Mode.
2. Conectar la landing local. Si Tag Assistant rechaza `localhost`, usar:

```text
http://127.0.0.1:5173/
```

La landing conserva automaticamente los parametros temporales `gtm_auth`, `gtm_preview` y `gtm_cookies_win` que
Tag Assistant agrega a la URL. Esos parametros solo se reenvian al script de GTM durante una sesion Preview.

3. Abrir la landing.
4. Confirmar eventos en `dataLayer`.
5. Confirmar que `GA4 - Configuracion base` se activa una sola vez.
6. En GA4, usar DebugView o Realtime.
7. Confirmar que no hay doble medicion de `page_view`.

## Criterios de aceptacion

- GTM o GA4 recibe eventos.
- `window.dataLayer` existe aunque falten IDs.
- UTMs se conservan durante navegacion razonable.
- `content_piece_id` queda presente en eventos.
- No se envia PII a GA4/GTM.
- El formulario envia por Formspree y emite `lead_form_submit` con `persistence=formspree`.
- Search Console tiene propiedad creada o queda pendiente con responsable claro.
