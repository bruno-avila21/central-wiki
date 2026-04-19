---
title: Invitation Builder
description: Builder de invitaciones digitales con editor visual, Supabase, MercadoPago y Vercel Functions
wiki_managed: true
---

# Invitation Builder

Builder de invitaciones digitales personalizadas. Editor visual en dos paneles (control + preview en vivo),
múltiples plantillas, exportación HTML standalone, pagos con MercadoPago y almacenamiento en Supabase.
Deploy en Vercel con Serverless Functions para el backend.

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19 | UI |
| Vite | 8.x | Build tool |
| Tailwind CSS | 4.x | Estilos (`@tailwindcss/vite`) |
| Supabase | 2.x | Auth + DB + Storage |
| MercadoPago | 2.x | Pagos |
| @vercel/og | 0.11.x | OG images dinámicas |
| qrcode.react | 4.x | QR codes |
| Vercel | — | Deploy + Serverless Functions |

## Correr localmente

```bash
npm install
cp .env.example .env.local
# Completar variables de entorno
npm run dev     # http://localhost:5174
```

## Variables de entorno

```env
# Frontend (Vite)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_PAYMENT_REQUIRED=false
VITE_UPLOAD_API=

# Backend (Vercel Functions en /api)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=
MP_PRICE_ARS=
APP_URL=
PAYMENT_REQUIRED=
```

## Arquitectura

### Layout dos paneles
- **Panel izquierdo (420px):** selector de plantilla, colores, fuentes, secciones, galería, textos
- **Panel derecho:** preview en vivo con toggle desktop/mobile

### Estado centralizado
`config` en `App.jsx` sin librería externa. Handlers con prefijo `i*` (mutan estado) y `e*` (efectos externos).

### Vercel Functions (`/api`)
| Endpoint | Función |
|----------|---------|
| `create-preference.js` | Crea preferencia de pago MercadoPago |
| `mp-webhook.js` | Webhook de MercadoPago |
| `og-image.jsx` | Genera OG image dinámica |

## Estructura

```
src/
  App.jsx               # Hub de estado
  LivePreview.jsx       # Preview con FULL_BLEED_IDS
  SectionRenderer.jsx   # Orquesta secciones + Intersection Observer
  exportUtils.js        # generateProductionHTML() — HTML standalone
  templatePresets.js    # Presets + getDefaultConfig() + defaultSections
  components/
    sections/           # HeroSection, CountdownSection, GallerySection, etc.
    controls/           # Paneles del control panel
  styles/
    variables.css       # ÚNICA fuente de variables CSS
api/
  create-preference.js  # Vercel Function — MercadoPago
  mp-webhook.js         # Vercel Function — Webhook
  og-image.jsx          # Vercel Function — OG image
```

## Build y deploy

```bash
npm run build     # → dist/
npm run preview   # preview del build
```

Deploy automático en Vercel con cada push a `main`.
