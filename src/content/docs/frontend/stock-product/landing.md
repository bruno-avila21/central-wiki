---
title: Landing
description: Landing page del SaaS (Vaultec) — React + Vite, 100% configurable desde config.js
wiki_managed: true
---

# Landing

Landing page del SaaS publicada bajo la marca **Vaultec**. SPA React + Vite con todas las secciones configurables desde `src/config.js` — sin tocar JSX para personalizarla.

## Stack

| Tecnología | Detalle |
|------------|---------|
| React | 18.3.1 |
| Vite | 5.4 |
| Estilos | CSS puro (sin Tailwind) |
| Testing | Vitest + Testing Library |

## Correr localmente

```bash
cd landing
npm install
npm run dev      # http://localhost:5173
npm run preview  # http://localhost:4173 (build preview)
```

## Build y deploy

```bash
npm run build    # genera dist/
npm run start    # sirve el build (Railway: $PORT o 4173)
```

Deploy en Railway: apuntar `rootDirectory` a `landing/`. Se deploya en cada push a main.

## Variables de entorno

No requiere variables de entorno. Todo se configura en `src/config.js`.

## Secciones disponibles

Controladas desde `config.js` con `visible: true/false` y reordenables:

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

Todo el contenido del sitio vive acá:

```js
export const config = {
  setupPassword: 'setup1234',      // contraseña del panel de setup

  brand: {
    nombre: 'VAULTEC',
    logo: null,                    // URL o null (usa texto)
    colors: {
      primary: '#4C3AE8',
      accent:  '#D4FF3F',
      bg:      '#FAFAF7',
      ink:     '#0A0A1E',
    }
  },

  sections: [
    { id: 'nav',      visible: true },
    { id: 'hero',     visible: true },
    { id: 'marquee',  visible: true },
    { id: 'features', visible: true },
    { id: 'pricing',  visible: true },
    { id: 'footerCta',visible: true },
    { id: 'footer',   visible: true },
  ],

  whatsapp: '+5491155550000',
  email: 'bruno@vaultec.com',
  whatsappMensaje: 'Hola, me interesa saber más sobre Vaultec',

  heroLine1: 'Crezcamos',
  heroItalic: 'juntos.',
  heroDescripcion: '...',

  planes: [
    { nombre: 'Starter',   precio: '$15k', featured: false },
    { nombre: 'Pro',       precio: '$35k', featured: true  },
    { nombre: 'Enterprise',precio: 'Custom', featured: false },
  ],

  footerLinks: {
    producto: [...],
    empresa: [...],
    legal: [...],
  }
}
```

## Panel de setup

Accesible con `?setup=1` en la URL. Protegido por `setupPassword`. Permite editar colores y textos visualmente sin tocar código. Los cambios se guardan en `localStorage` como override temporal.

## Estructura

```
landing/src/
├── App.jsx            # Orquestador de secciones
├── config.js          # Toda la configuración del sitio
├── presets.js         # Presets de temas alternativos
├── useConfig.js       # Hook: config + localStorage overrides
├── ContactModal.jsx   # Modal de contacto (WhatsApp / email)
├── SetupPanel.jsx     # Panel visual de configuración
├── index.css          # Variables CSS globales
├── setup.css          # Estilos del panel de setup
└── __tests__/         # Tests con Vitest + Testing Library
```

## Testing

```bash
cd landing
npm test              # Vitest run
npm run test:watch    # Modo watch
```
