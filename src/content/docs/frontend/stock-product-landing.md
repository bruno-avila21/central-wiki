---
title: Stock Product — Landing
description: Landing page del SaaS (Vaultec) — React + Vite, 100% configurable desde config.js
wiki_managed: true
---

# Landing

Landing page del SaaS, publicada bajo la marca **Vaultec**. Es una SPA React + Vite con todas las secciones configurables desde un único archivo `src/config.js` — sin tocar JSX para personalizarla.

## Stack

| Tecnología | Detalle |
|------------|---------|
| React | 18.3 |
| Vite | 5.3 |
| Estilos | CSS puro (sin Tailwind) |
| Testing | Vitest + Testing Library |

## Correr localmente

```bash
cd landing
npm install
npm run dev      # http://localhost:5173 (Vite default)
npm run preview  # http://localhost:4173 (build preview)
```

## Build y deploy

```bash
npm run build    # genera dist/
npm run start    # sirve el build (Railway-ready, puerto $PORT o 4173)
```

Deploy en Railway: conectar el repo y apuntar `rootDirectory` a `landing/`. Se deploya automáticamente en cada push.

## Secciones disponibles

Todas controladas desde `src/config.js` con `visible: true/false`:

| ID | Sección |
|----|---------|
| `nav` | Barra de navegación sticky |
| `hero` | Hero principal con headline animado |
| `marquee` | Marquee con features destacadas |
| `features` | Grid de features con íconos |
| `pricing` | Tabla de planes con destacado |
| `footerCta` | CTA final antes del footer |
| `footer` | Footer con links y copyright |

## Configuración — `src/config.js`

Todo el contenido se edita acá. No hay variables de entorno ni backend.

```js
export const config = {
  // Contraseña del panel de setup (acceso rápido en /setup)
  setupPassword: 'setup1234',

  brand: {
    nombre: 'VAULTEC',
    logo: null,          // URL o null para texto
    colors: {
      primary: '#4C3AE8',
      accent:  '#D4FF3F',
      bg:      '#FAFAF7',
      ink:     '#0A0A1E',
    }
  },

  // Secciones visibles (reordenable)
  sections: [
    { id: 'nav',       visible: true },
    { id: 'hero',      visible: true },
    { id: 'pricing',   visible: true },
    // ...
  ],

  // Contacto
  whatsapp: '+5491155550000',
  email: 'bruno@vaultec.com',

  // Hero
  heroLine1: 'Crezcamos',
  heroItalic: 'juntos.',
  heroDescripcion: '...',

  // Planes (array)
  planes: [
    { nombre: 'Starter', precio: '$15k', ... },
    { nombre: 'Pro',     precio: '$35k', featured: true, ... },
    { nombre: 'Enterprise', precio: 'Custom', ... },
  ],

  // Footer
  footerLinks: { producto: [...], empresa: [...], legal: [...] }
}
```

## Panel de setup

Disponible en `?setup=1` (o ruta `/setup`). Protegido por `setupPassword`. Permite editar colores y textos visualmente sin tocar el código — guarda en `localStorage` como override temporal.

## Estructura

```
landing/src/
├── App.jsx            # Orquestador de secciones
├── config.js          # Toda la configuración del sitio
├── presets.js         # Presets de temas alternativos
├── useConfig.js       # Hook que merge config + localStorage overrides
├── ContactModal.jsx   # Modal de contacto (WhatsApp / email)
├── SetupPanel.jsx     # Panel visual de configuración
├── index.css          # Variables CSS globales
├── setup.css          # Estilos del panel de setup
└── __tests__/         # Tests con Vitest + Testing Library
```

## Tests

```bash
cd landing
npm test           # Vitest
npm run test:watch # modo watch
```
