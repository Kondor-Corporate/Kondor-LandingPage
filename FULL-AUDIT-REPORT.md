# Auditoría SEO Completa — Kondor Landing Page
**Fecha:** 10 de abril de 2026  
**URL analizada:** kondor.io (SPA local — análisis basado en código fuente)  
**Stack:** Vite 5 + React 18 + Tailwind CSS 3 (Single Page Application)  
**Auditor:** Skill SEO Agentic

---

## Resumen Ejecutivo

| Categoría | Puntuación | Estado |
|-----------|-----------|--------|
| Technical SEO | 28/100 | 🔴 Crítico |
| On-Page SEO | 42/100 | 🔴 Crítico |
| Content Quality / E-E-A-T | 50/100 | ⚠️ Necesita mejora |
| Schema / Structured Data | 0/100 | 🔴 Crítico |
| Performance / CWV (estimado) | 45/100 | ⚠️ Necesita mejora |
| Image Optimization | 55/100 | ⚠️ Necesita mejora |
| AI Search Readiness (GEO) | 10/100 | 🔴 Crítico |
| **SCORE GLOBAL** | **33/100** | **🔴 Crítico** |

> **El mayor problema es estructural: la arquitectura SPA sin SSR/SSG impide que Google indexe el contenido de forma confiable. Sin resolver esto, las demás mejoras tienen impacto limitado.**

---

## 1. Technical SEO (25% del score global)

### 1.1 Arquitectura SPA — Sin renderizado del lado del servidor
| Elemento | Estado |
|----------|--------|
| Server-Side Rendering (SSR) | 🔴 Ausente |
| Static Site Generation (SSG) | 🔴 Ausente |
| Pre-rendering | 🔴 Ausente |

**Finding:** La página es una SPA pura (Vite + React). Todo el contenido se genera en el cliente vía JavaScript. Aunque Googlebot puede ejecutar JS, lo hace con retraso (crawl budget dual) y no siempre de forma completa.

**Evidence:** `index.html` solo contiene `<div id="root"></div>`. Todo el HTML visible es generado por `main.jsx` → `App.jsx` → componentes React.

**Impact:** El contenido principal (H1, H2s, textos, meta dinámicas) puede no ser indexado correctamente. Las otras páginas/secciones no tienen URLs propias, lo que limita la capacidad de ranking por keyword individual.

**Fix:** Migrar a Next.js con App Router (SSG estático o SSR), o configurar pre-rendering con `vite-plugin-ssr` / `@vitejs/plugin-react` + `react-snap` / `vite-ssg`.

---

### 1.2 robots.txt
| Elemento | Estado |
|----------|--------|
| robots.txt | 🔴 Ausente |

**Finding:** No existe archivo `robots.txt` en `/public/`.

**Impact:** Los crawlers de Google, Bing y los bots de IA (GPTBot, ClaudeBot, PerplexityBot) no tienen directivas de rastreo. Por defecto pueden rastrear todo, pero no hay control ni señal para crawlers selectivos.

**Fix:** Crear `/public/robots.txt` con directivas básicas y gestión de crawlers IA.

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://kondor.io/sitemap.xml
```

---

### 1.3 sitemap.xml
| Elemento | Estado |
|----------|--------|
| sitemap.xml | 🔴 Ausente |

**Finding:** No existe sitemap XML en `/public/`.

**Impact:** Sin sitemap, Google no tiene una señal directa de qué URLs indexar ni cuándo se actualizó el contenido.

**Fix:** Crear `/public/sitemap.xml` con la URL canónica raíz. Al ser SPA de una sola página, es simple:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kondor.io/</loc>
    <lastmod>2026-04-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

### 1.4 Canonical URL
| Elemento | Estado |
|----------|--------|
| `<link rel="canonical">` | 🔴 Ausente |

**Finding:** No existe etiqueta canonical en `index.html`.

**Impact:** Si la página es accesible por múltiples URLs (con/sin www, con/sin trailing slash, HTTP/HTTPS), Google puede fragmentar el link equity entre duplicados.

**Fix:** Agregar en `<head>` de `index.html`:
```html
<link rel="canonical" href="https://kondor.io/" />
```

---

### 1.5 Favicon
| Elemento | Estado |
|----------|--------|
| favicon.svg | 🔴 Ausente en /public |

**Finding:** `index.html` referencia `/favicon.svg` pero en `/public/` solo existe `kondor.png`. El favicon no se sirve.

**Evidence:** `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` — archivo no encontrado en public/.

**Fix:** Copiar o crear `public/favicon.svg` (o cambiar la referencia a `/kondor.png` y agregar formatos múltiples).

---

### 1.6 HTTPS / Seguridad (no verificable localmente)
| Elemento | Estado |
|----------|--------|
| HSTS header | ℹ️ No verificable |
| CSP header | ℹ️ No verificable |
| X-Frame-Options | ℹ️ No verificable |

**Finding:** No se pudo verificar headers de seguridad (entorno local sin URL live). Se deben verificar con Vercel deployment.

---

### 1.7 Links legales rotos
| Elemento | Estado |
|----------|--------|
| Política de privacidad | 🔴 Enlace roto (`href="#"`) |
| Términos de uso | 🔴 Enlace roto (`href="#"`) |

**Evidence:** En `Footer.jsx`:
```js
const legalLinks = [
  { label: 'Política de privacidad', href: '#' },
  { label: 'Términos de uso',        href: '#' },
]
```

**Impact:** Links muertos generan mala señal de confianza. La ausencia real de estos documentos es un problema E-E-A-T y potencialmente legal (GDPR/LSSI si opera en España/Argentina).

**Fix:** Crear páginas o modales para estos documentos y actualizar los hrefs.

---

## 2. On-Page SEO (15% del score global)

### 2.1 Title Tag
| Elemento | Valor | Estado |
|----------|-------|--------|
| Title | `Kondor — Ingeniería con criterio` | ⚠️ Mejorable |
| Longitud | ~33 caracteres | ✅ Dentro del límite |

**Finding:** El título es correcto en longitud pero muy genérico. No incluye la categoría de negocio (software factory), la propuesta de valor diferencial, ni términos de búsqueda de intención.

**Fix sugerido:** `Kondor | Software Factory — Sistemas digitales para empresas en crecimiento`  
(~74 chars, incluye categoría + propuesta de valor)

---

### 2.2 Meta Description
| Elemento | Valor | Estado |
|----------|-------|--------|
| Meta description | "Kondor es una fábrica de software que construye sistemas para llevar a las organizaciones a su evolución tecnológica." | ⚠️ Mejorable |
| Longitud | ~114 caracteres | ✅ Dentro del límite |

**Finding:** La descripción es informativa pero carece de CTA (call to action) y de palabras clave accionables que un usuario buscaría ("desarrollo de software", "sistemas digitales", "aplicaciones empresariales").

**Fix sugerido:** `Kondor es una software factory que diseña y desarrolla sistemas digitales para pymes en crecimiento. Ingeniería con criterio, resultados concretos. ¡Conversemos!`  
(~162 chars — podría recortarse a ~155)

---

### 2.3 Open Graph / Social Meta
| Etiqueta | Estado |
|----------|--------|
| `og:title` | 🔴 Ausente |
| `og:description` | 🔴 Ausente |
| `og:image` | 🔴 Ausente |
| `og:url` | 🔴 Ausente |
| `og:type` | 🔴 Ausente |
| `twitter:card` | 🔴 Ausente |
| `twitter:title` | 🔴 Ausente |
| `twitter:image` | 🔴 Ausente |

**Finding:** No existe ninguna meta tag de Open Graph ni Twitter Card en `index.html`.

**Impact:** Cuando se comparte el enlace en LinkedIn, Instagram stories, WhatsApp, Twitter/X, Slack u otras plataformas, no se genera preview visual. Esto reduce significativamente el CTR en redes sociales, que es además el canal principal de Kondor (Instagram, LinkedIn, TikTok declarados en Footer).

**Fix:** Agregar en `<head>`:
```html
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://kondor.io/" />
<meta property="og:title" content="Kondor | Software Factory — Ingeniería con criterio" />
<meta property="og:description" content="Diseñamos y construimos sistemas digitales para empresas en crecimiento. Ingeniería aplicada, criterio técnico y visión a largo plazo." />
<meta property="og:image" content="https://kondor.io/og-image.png" />
<meta property="og:locale" content="es_AR" />
<meta property="og:site_name" content="Kondor" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Kondor | Software Factory" />
<meta name="twitter:description" content="Diseñamos y construimos sistemas digitales para empresas en crecimiento." />
<meta name="twitter:image" content="https://kondor.io/og-image.png" />
```

**Nota:** Crear una imagen OG de 1200×630px (`public/og-image.png`) con el branding de Kondor.

---

### 2.4 Estructura de Headings (H1-H3)
| Heading | Texto | Estado |
|---------|-------|--------|
| H1 | "Evolución tecnológica real, construida con ingeniería" | ✅ Correcto |
| H2 (About) | "Construimos con criterio, no por improvisación." | ✅ |
| H2 (Vision) | "Tecnología real, construida con rigor." | ⚠️ Duplica concepto del H1 |
| H2 (Portfolio) | "Marcas y proyectos con criterio compartido." | ✅ |
| H2 (Team) | "Cuatro personas, una dirección." | ⚠️ Poco descriptivo para SEO |
| H2 (CTA) | "Construyamos el sistema que tu organización necesita" | ✅ |
| H3 | Quiénes somos / Cómo trabajamos / Qué buscamos lograr | ✅ |
| H3 | Ingeniería de criterio / Arquitectura escalable / Evolución continua / Ecosistema integrado | ✅ |

**Finding:** H1 es correcto y único. La Vision Section tiene un H2 que repite el concepto del H1 ("Tecnología real, construida con rigor" vs "Evolución tecnológica real, construida con ingeniería"). El H2 del Team es demasiado genérico desde el punto de vista SEO.

**AboutSection:** No tiene `id=""` en su `<section>`, lo que impide navegar a ella por ancla desde el navbar.

**Fix:** 
- H2 VisionSection → "Nuestra visión: sistemas con rigor para empresas en crecimiento"
- H2 TeamSection → "El equipo fundador de Kondor"
- Agregar `id="nosotros"` o `id="about"` a AboutSection

---

### 2.5 Etiqueta `lang` y localización
| Elemento | Valor | Estado |
|----------|-------|--------|
| `html lang` | `es` | ✅ Correcto |
| hreflang alternates | Ausente | ℹ️ OK (sitio monolingüe) |

---

## 3. Content Quality / E-E-A-T (20% del score global)

### 3.1 Volumen y densidad de contenido
| Sección | Texto visible estimado | Estado |
|---------|----------------------|--------|
| Hero | ~25 palabras | 🔴 Muy escaso |
| About | ~90 palabras | ⚠️ Escaso |
| Vision | ~50 palabras | 🔴 Muy escaso |
| Portfolio | ~40 palabras (sin nombres de cliente) | 🔴 Muy escaso |
| Team | Bios ~15 palabras c/u | ⚠️ Escaso |
| CTA | ~60 palabras | ⚠️ Escaso |
| **Total estimado** | **~350 palabras** | 🔴 Muy por debajo del mínimo |

**Finding:** El contenido total de la landing es de aproximadamente 350 palabras. Para una página de empresa en un sector competitivo (software factory / desarrollo de software), Google espera al menos 500-800 palabras de contenido de calidad en la página principal. El contenido actual es muy fragmentado y de naturaleza puramente de marketing, sin demostrar experiencia ni conocimiento técnico.

**Impact:** Baja señal de relevancia temática para keywords de intención transaccional ("contratar software factory", "desarrollo de sistemas empresariales", etc.).

---

### 3.2 E-E-A-T (Experiencia, Expertise, Autoridad, Confianza)
| Señal | Estado |
|-------|--------|
| Nombres reales del equipo fundador | ✅ Presente |
| Fotos del equipo | ✅ Presente |
| LinkedIn de fundadores | ✅ Presente |
| Roles/cargos visibles | ✅ Presente |
| Email de contacto visible | ✅ kondorcorporate@gmail.com |
| Dirección física | 🔴 Ausente |
| Número de teléfono | 🔴 Ausente |
| Casos de éxito con detalles | 🔴 Ausente |
| Testimoniales de clientes | 🔴 Ausente |
| Años de experiencia declarados | 🔴 Ausente |
| Blog / contenido de autoridad | 🔴 Ausente |
| Política de privacidad real | 🔴 Ausente |
| Términos de uso reales | 🔴 Ausente |

**Finding:** Kondor tiene señales básicas de E-E-A-T (equipo identificable con LinkedIn), pero carece de prueba social concreta (testimoniales, casos de éxito con detalles, métricas de resultados) y de documentos legales reales.

**Email:** `kondorcorporate@gmail.com` — el uso de Gmail en lugar de dominio propio (`@kondor.io`) reduce la percepción de confianza profesional para Google y para visitantes.

---

### 3.3 Keywords y relevancia temática
**Keywords detectadas en el contenido:**
- "software factory" (solo en HeroSection label decorativo)
- "ingeniería" (varias apariciones)
- "sistemas digitales" / "sistemas" (varias)
- "evolución tecnológica" (H1 y meta description)
- "empresas en crecimiento" (varios)
- "criterio técnico"

**Keywords de intención transaccional ausentes:**
- "desarrollo de software a medida"
- "aplicaciones empresariales"
- "consultoría tecnológica"
- "transformación digital"
- "automatización de procesos"
- "Argentina" / ciudad (sin geo-targeting)

**Finding:** El contenido usa lenguaje de marca propio ("criterio", "rigor", "ingeniería con criterio") que probablemente nadie busca directamente. Falta orientar el contenido hacia las búsquedas reales de potenciales clientes.

---

## 4. Schema / Structured Data (15% del score global)

### 4.1 JSON-LD
| Tipo de Schema | Estado |
|---------------|--------|
| Organization | 🔴 Ausente |
| WebSite (con SearchAction) | 🔴 Ausente |
| LocalBusiness | 🔴 Ausente |
| SoftwareApplication | 🔴 Ausente |
| Person (equipo) | 🔴 Ausente |
| BreadcrumbList | ℹ️ No aplica (SPA) |

**Finding:** No existe ningún bloque de structured data (JSON-LD) en toda la aplicación. Esta es una omisión crítica para aparecer en el Knowledge Panel de Google y en respuestas de IA (Perplexity, SearchGPT, etc.).

**Fix — Schema Organization mínimo (agregar en index.html):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Kondor",
  "url": "https://kondor.io",
  "logo": "https://kondor.io/kondor.png",
  "description": "Software factory que diseña y construye sistemas digitales para empresas en crecimiento.",
  "email": "kondorcorporate@gmail.com",
  "sameAs": [
    "https://www.instagram.com/kondor.io/",
    "https://www.linkedin.com/company/kondorcorporate/",
    "https://www.tiktok.com/@kondor.io"
  ],
  "foundingDate": "2024",
  "founders": [
    { "@type": "Person", "name": "Lucas Legorburu", "jobTitle": "CEO & Co-Fundador" },
    { "@type": "Person", "name": "Joaquín E. Rodríguez", "jobTitle": "COO & Co-Fundador" },
    { "@type": "Person", "name": "Nicolás Pérez", "jobTitle": "CTO & Co-Fundador" },
    { "@type": "Person", "name": "Santiago Talavera", "jobTitle": "CMO & Co-Fundador" }
  ]
}
</script>
```

---

## 5. Performance / Core Web Vitals (10% del score global)

### 5.1 Estimación de impacto de bundle
| Factor | Impacto estimado | Estado |
|--------|-----------------|--------|
| Three.js (heavy 3D library, ~600KB min) | LCP + TBT | 🔴 Alto riesgo |
| Framer Motion (~140KB) | TBT | ⚠️ Moderado |
| @react-three/fiber + drei + postprocessing | LCP + TBT | 🔴 Alto riesgo |
| Google Fonts (render-blocking) | FCP / LCP | ⚠️ Moderado |
| React 18 base (~130KB) | TBT | ⚠️ Moderado |

**Finding:** El bundle incluye Three.js y tres librerías de React-Three, que suman fácilmente 800KB-1.2MB en el bundle total. Irónicamente, el componente 3D en HeroSection es solo un radar SVG/CSS animado (no usa Three.js directamente). Si Three.js se importa pero solo es usado por algún componente menor o está en el tree sin uso real, es peso muerto.

**Finding:** Las fuentes de Google se cargan con `<link rel="stylesheet">` (bloqueante del render), aunque se usa `preconnect` que ayuda parcialmente.

**Fix:** 
- Verificar si Three.js/R3F se usa realmente o se puede eliminar.
- Si se usa, cargar el componente 3D con `React.lazy()` + Suspense.
- Cambiar carga de fuentes a `font-display: swap` o usar fuente del sistema como fallback.
- Usar `display=swap` en el URL de Google Fonts: `&display=swap` (ya presente en el link, verificar).

---

### 5.2 Imágenes
| Aspecto | Estado |
|---------|--------|
| Format moderno (WebP/AVIF) | 🔴 Ausente (PNG, JPEG, JFIF) |
| lazy loading | ✅ Presente en portfolio |
| `decoding="async"` | ✅ Presente en portfolio |
| Tamaños srcset | 🔴 Ausente |
| Alt text en fotos del equipo | 🔴 `alt=""` vacío en imágenes significativas |

**Finding:** Las fotos del equipo (lucas.jpeg, joaco.jfif, nicolas.png, santi.jfif) usan `alt=""` vacío. Esto está semánticamente incorrecto para imágenes de personas con significado contextual.

**Evidence (TeamSection.jsx línea 157):**
```jsx
<img src={img} alt="" className="..." />
```

**Fix:** Agregar alt descriptivo con nombre y rol:
```jsx
alt={`${name}, ${role} en Kondor`}
```

---

## 6. Image Optimization (10% del score global)

| Imagen | Alt text | Formato | Lazy | Estado |
|--------|----------|---------|------|--------|
| `/kondor.png` (Navbar) | "Kondor" | PNG | No | ⚠️ |
| `/kondor.png` (Footer) | "Kondor" | PNG | No | ⚠️ |
| `/portfolio/maps.png` | "Logo MAPS" | PNG | ✅ | ✅ |
| `/portfolio/IconoLF.png` | "Logo La Federal" | PNG | ✅ | ✅ |
| `/portfolio/forever.png` | "Logo For Ever" | PNG | ✅ | ✅ |
| `/lucas.jpeg` | "" (vacío) | JPEG | No | 🔴 |
| `/joaco.jfif` | "" (vacío) | JFIF | No | 🔴 |
| `/nicolas.png` | "" (vacío) | PNG | No | 🔴 |
| `/santi.jfif` | "" (vacío) | JFIF | No | 🔴 |

**Finding:** Formatos JFIF (`.jfif`) son especialmente problemáticos: no todos los navegadores los soportan correctamente y tienen peor compresión que WebP. Todos los archivos de imagen deberían convertirse a WebP para mejor rendimiento.

**Finding:** Las imágenes de personajes del equipo no tienen `loading="lazy"` pero están below-the-fold, lo que genera peticiones de red innecesarias en el LCP.

---

## 7. AI Search Readiness / GEO (5% del score global)

| Elemento | Estado |
|----------|--------|
| llms.txt | 🔴 Ausente |
| Gestión de crawlers IA en robots.txt | 🔴 Ausente (no hay robots.txt) |
| Contenido semánticamente denso | 🔴 Escaso |
| FAQ estructuradas | 🔴 Ausente |
| Definiciones claras de servicios | ⚠️ Parcial |
| Menciones de marca en texto plano | ✅ Presente |

**Finding:** Para aparecer en respuestas de Perplexity, SearchGPT, Google AI Overviews y Claude, el contenido debe ser semánticamente denso, con definiciones claras de qué hace la empresa y para quién. El contenido actual es demasiado abstracto y poético ("ingeniería con criterio", "evolución real").

**Finding:** `llms.txt` ausente — este archivo emergente le indica a los crawlers de LLMs qué contenido es relevante y cuál puede ser usado para entrenamiento/indexación.

**Fix:** Crear `public/llms.txt`:
```
# Kondor — Software Factory
## About
Kondor es una software factory argentina que diseña y construye sistemas digitales para pequeñas y medianas empresas en crecimiento. Ofrecemos desarrollo de software a medida, arquitectura de sistemas escalables y consultoría tecnológica.

## Services
- Desarrollo de software a medida
- Arquitectura de sistemas escalables
- Consultoría tecnológica
- Plataformas de gestión para pymes

## Team
- Lucas Legorburu: CEO & Co-Fundador
- Joaquín E. Rodríguez: COO & Co-Fundador
- Nicolás Pérez: CTO & Co-Fundador
- Santiago Talavera: CMO & Co-Fundador

## Contact
kondorcorporate@gmail.com
```

---

## 8. Hallazgos Adicionales

### 8.1 Sección About sin ID de ancla
**Finding:** `AboutSection` renderiza una `<section>` sin `id=""`. El navbar no tiene link a esta sección, y no es posible hacer deep link a ella.

### 8.2 Email en dominio genérico (Gmail)
**Finding:** El email de contacto es `kondorcorporate@gmail.com`. Para E-E-A-T y percepción de marca profesional, se recomienda usar `hola@kondor.io` o `contacto@kondor.io`.

### 8.3 Copyright desactualizado / Consistencia
**Finding:** El footer muestra "© 2026 Kondor" — correcto para el año actual (2026). ✅

### 8.4 Sin página 404 personalizada
**Finding:** No existe página 404 en el proyecto. Si un usuario accede a una ruta inválida (ej. `kondor.io/servicios`), Vite sirve `index.html` pero React Router no está configurado, lo que resulta en una pantalla en blanco o error.

### 8.5 Vite config — Sin prerender / SSG
**Finding:** `vite.config.js` no tiene ningún plugin de prerender. Para resolver el problema de la SPA sin SSR, la solución más directa sería usar `vite-plugin-ssr` o migrar a Next.js.

---

## 9. Resumen de Categorías por Score

```
Technical SEO:        ████░░░░░░  28/100  🔴
On-Page SEO:          ████░░░░░░  42/100  🔴
Content / E-E-A-T:    █████░░░░░  50/100  ⚠️
Schema:               ░░░░░░░░░░   0/100  🔴
Performance (est.):   █████░░░░░  45/100  ⚠️
Image Optimization:   ██████░░░░  55/100  ⚠️
AI Readiness (GEO):   █░░░░░░░░░  10/100  🔴
─────────────────────────────────────────────
GLOBAL SCORE:         ████░░░░░░  33/100  🔴
```

---

*Generado por SEO Skill Agentic — 10 de abril de 2026*
