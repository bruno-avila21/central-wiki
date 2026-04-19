---
title: Invitaciones
description: Builder de invitaciones digitales personalizadas con editor visual
wiki_managed: true
---

# Invitation Builder

Herramienta para crear invitaciones digitales personalizadas. El usuario completa un formulario con los datos del evento, previsualiza la tarjeta en tiempo real y puede compartir o imprimir la invitación.

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | React 18 |
| Build tool | Vite |
| Estilos | CSS Modules / Tailwind CSS |
| Lenguaje | JavaScript (ESM) |
| Deploy | GitHub Pages / Netlify |

## Qué hace

- Formulario de datos del evento (nombre, fecha, lugar, etc.)
- Preview en vivo de la invitación mientras escribís
- Múltiples plantillas de diseño para elegir
- Exportar como imagen o PDF
- Sin backend — todo en el browser

## Correr localmente

```bash
git clone git@github.com:bruno-avila21/invitaciones.git
cd invitaciones
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Variables de entorno

No requiere variables de entorno. Es 100% frontend estático.

## Build y deploy

```bash
# Build estático
npm run build
# Los archivos quedan en dist/

# Preview del build
npm run preview

# Deploy manual a GitHub Pages
npm run deploy   # si está configurado gh-pages en package.json
```

## Estructura

```
invitaciones/
├── src/
│   ├── components/
│   │   ├── Form/         # campos del formulario
│   │   ├── Preview/      # previsualización de la invitación
│   │   └── Templates/    # plantillas de diseño
│   ├── hooks/
│   │   └── useInvitacion.js
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── assets/           # imágenes y fuentes
└── vite.config.js
```
