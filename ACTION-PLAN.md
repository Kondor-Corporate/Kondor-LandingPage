# Plan de Acción SEO — Kondor Landing Page
**Fecha:** 10 de abril de 2026  
**Score actual:** 33/100 🔴  
**Score proyectado al completar Fase 1:** ~62/100 ⚠️  
**Score proyectado al completar Fase 2:** ~78/100 ✅

---

## Fase 1 — Fixes Críticos (Impacto alto / Esfuerzo bajo-medio) 🔴

> Estas acciones se pueden implementar en 1-2 días sin cambiar el stack.

### Fix 1 — Agregar Open Graph + Twitter Card en index.html
**Impacto:** Alto | **Esfuerzo:** 15 minutos | **Archivo:** `index.html`

Reemplazar el `<head>` actual por:

```html 
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary Meta -->
    <title>Kondor | Software Factory — Sistemas digitales para empresas en crecimiento</title>
    <meta name="description" content="Kondor es una software factory que diseña y desarrolla sistemas digitales para pymes en crecimiento. Ingeniería aplicada, criterio técnico y visión a largo plazo." />
    <link rel="canonical" href="https://kondor.io/" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/kondor.png" />
    <link rel="apple-touch-icon" href="/kondor.png" />

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
    <meta name="twitter:description" content="Sistemas digitales para empresas en crecimiento. Ingeniería con criterio." />
    <meta name="twitter:image" content="https://kondor.io/og-image.png" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

    <!-- Structured Data -->
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
      "founders": [
        { "@type": "Person", "name": "Lucas Legorburu", "jobTitle": "CEO & Co-Fundador" },
        { "@type": "Person", "name": "Joaquín E. Rodríguez", "jobTitle": "COO & Co-Fundador" },
        { "@type": "Person", "name": "Nicolás Pérez", "jobTitle": "CTO & Co-Fundador" },
        { "@type": "Person", "name": "Santiago Talavera", "jobTitle": "CMO & Co-Fundador" }
      ]
    }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Tareas adicionales de este fix:**
- [ ] Crear `public/og-image.png` (1200×630px) con logo Kondor + tagline + fondo oscuro de marca

---

### Fix 2 — Crear robots.txt y sitemap.xml
**Impacto:** Alto | **Esfuerzo:** 5 minutos | **Archivos:** `public/robots.txt`, `public/sitemap.xml`

**`public/robots.txt`:**
```
User-agent: *
Allow: /

# AI Crawlers — permitir indexación para AI search
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: https://kondor.io/sitemap.xml
```

**`public/sitemap.xml`:**
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

### Fix 3 — Alt text en fotos del equipo
**Impacto:** Medio | **Esfuerzo:** 5 minutos | **Archivo:** `src/components/TeamSection.jsx`

Cambiar la línea 157 de `TeamSection.jsx`:

```jsx
// ANTES:
<img src={img} alt="" className="..." />

// DESPUÉS:
<img src={img} alt={`${name}, ${role} en Kondor`} className="..." />
```

---

### Fix 4 — Crear llms.txt para AI Search
**Impacto:** Medio (creciente) | **Esfuerzo:** 10 minutos | **Archivo:** `public/llms.txt`

```
# Kondor — Software Factory

## About
Kondor es una software factory argentina fundada en 2024. Diseña y construye sistemas digitales para pequeñas y medianas empresas en crecimiento. Combinamos visión de producto, criterio técnico y buenas prácticas de ingeniería para construir soluciones claras, seguras y escalables.

## Services
- Desarrollo de software a medida
- Arquitectura de sistemas escalables y seguros
- Consultoría tecnológica y digital
- Plataformas de gestión para pymes
- Sistemas de pagos y comercialización
- Plataformas SaaS

## Products
- Maps Organización: plataforma en partnership
- Club La Federala: sistema de comercialización y control
- Club For Ever: sistema de pagos y gestión
- TakeOff: planificador de viajes (próximamente)

## Team
- Lucas Legorburu: CEO & Co-Fundador — estrategia y prioridades de negocio
- Joaquín E. Rodríguez: COO & Co-Fundador — visión de negocio y ejecución
- Nicolás Pérez: CTO & Co-Fundador — calidad técnica y experiencia de usuario
- Santiago Talavera: CMO & Co-Fundador — operación y crecimiento de mercado

## Contact
Email: kondorcorporate@gmail.com
LinkedIn: https://www.linkedin.com/company/kondorcorporate/
Instagram: https://www.instagram.com/kondor.io/
```

---

### Fix 5 — H2 del equipo más descriptivo
**Impacto:** Bajo-Medio | **Esfuerzo:** 2 minutos | **Archivo:** `src/components/TeamSection.jsx`

```jsx
// ANTES:
<h2 ...>Cuatro personas,<br /><span className="text-brand-accent">una dirección.</span></h2>

// DESPUÉS:
<h2 ...>El equipo fundador<br /><span className="text-brand-accent">de Kondor.</span></h2>
```

---

### Fix 6 — Agregar ID a AboutSection
**Impacto:** Bajo | **Esfuerzo:** 1 minuto | **Archivo:** `src/components/AboutSection.jsx`

```jsx
// ANTES:
<section className="relative py-20 lg:py-28 overflow-hidden">

// DESPUÉS:
<section id="nosotros" className="relative py-20 lg:py-28 overflow-hidden">
```

---

### Fix 7 — Favicon correcto
**Impacto:** Bajo | **Esfuerzo:** 5 minutos | **Archivos:** `index.html`, `public/`

El archivo `favicon.svg` referenciado en `index.html` no existe en `public/`. Opciones:
- Crear `public/favicon.svg` con el logo simplificado, o
- Cambiar la referencia en `index.html` a `/kondor.png` (ya existe)

---

## Fase 2 — Optimizaciones Importantes (Impacto alto / Esfuerzo medio) ⚠️

> Estas acciones requieren 1-2 semanas de trabajo.

### Fix 8 — Migrar a Next.js o agregar pre-rendering
**Impacto:** Muy Alto | **Esfuerzo:** Alto (3-5 días)

La arquitectura SPA sin SSR es el mayor bloqueador SEO. Opciones ordenadas por esfuerzo:

**Opción A (más fácil):** Agregar `vite-ssg` para generar HTML estático en build time:
```bash
npm install -D vite-ssg
USAR ESTA OPCION
```


---

### Fix 10 — Convertir imágenes a WebP
**Impacto:** Medio (Performance / CWV) | **Esfuerzo:** Bajo

```bash
# Instalar herramienta de conversión
npm install -g sharp-cli

# Convertir imágenes del equipo
npx sharp-cli --input public/lucas.jpeg --output public/lucas.webp
npx sharp-cli --input public/joaco.jfif --output public/joaco.webp
npx sharp-cli --input public/nicolas.png --output public/nicolas.webp
npx sharp-cli --input public/santi.jfif --output public/santi.webp
```

Actualizar referencias en `TeamSection.jsx` y agregar `loading="lazy"` a fotos del equipo.

---

### Fix 11 — Crear páginas legales (Política de privacidad y Términos de uso)
**Impacto:** Medio (E-E-A-T + legal) | **Esfuerzo:** Medio

Los links en el footer apuntan a `#` (no funcionan). Se necesitan al mínimo:
- Modal o ruta `/privacidad` con política de privacidad real
- Modal o ruta `/terminos` con términos de uso reales
- Si se usa Formspree para formularios, es obligatorio tener política de privacidad

---

## Fase 3 — Crecimiento Orgánico a Largo Plazo (1-3 meses) ✅

### Fix 15 — Google Search Console + Google Analytics
**Impacto:** Indirecto (monitoreo) | **Esfuerzo:** Bajo

- Registrar `kondorcorporate.com` en [Google Search Console](https://search.google.com/search-console)
- Enviar el sitemap: `https://kondor.io/sitemap.xml`
- Instalar Google Analytics 4 o Plausible (más liviano y privacy-first)

---

## Checklist de Implementación

### Semana 1 (Cambios en código — sin impacto en diseño)
- [ ] Fix 1: Actualizar `index.html` (OG, Twitter Card, Schema, Canonical, Title, Meta)
- [ ] Fix 2: Crear `public/robots.txt` y `public/sitemap.xml`
- [ ] Fix 3: Alt text en `TeamSection.jsx`
- [ ] Fix 4: Crear `public/llms.txt`
- [ ] Fix 5: H2 del equipo más descriptivo
- [ ] Fix 6: ID a AboutSection
- [ ] Fix 7: Favicon correcto
- [ ] Crear `public/og-image.png` (1200×630px)

### Semana 2-3 (Cambios con mayor esfuerzo)
- [ ] Fix 8: Evaluar y ejecutar pre-rendering o migración
- [ ] Fix 10: Convertir imágenes a WebP
- [ ] Fix 11: Crear páginas legales
- [ ] Fix 12: Configurar email de dominio propio

### Mes 2-3 (Crecimiento orgánico)
- [ ] Fix 9: Agregar contenido semántico a secciones
- [ ] Fix 13: Primer artículo de blog
- [ ] Fix 14: Conseguir primer testimonial con schema
- [ ] Fix 15: Registrar en GSC y enviar sitemap

---

## Score Proyectado por Fase

| Fase | Score proyectado | Delta |
|------|-----------------|-------|
| Actual | 33/100 🔴 | — |
| Tras Semana 1 (Fix 1-7) | ~58/100 ⚠️ | +25 pts |
| Tras Semana 2-3 (Fix 8-12) | ~72/100 ✅ | +14 pts |
| Tras Mes 2-3 (Fix 13-15) | ~85/100 ✅ | +13 pts |

---

*Generado por SEO Skill Agentic — 10 de abril de 2026*
