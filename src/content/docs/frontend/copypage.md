---
title: CopyPage
description: Herramienta de escritorio para extraer contenido web y convertirlo a Markdown limpio, con Playwright para sitios con JavaScript
---

# CopyPage

Herramienta de escritorio para extraer contenido de cualquier página web y convertirlo a Markdown limpio, con soporte de Playwright para sitios con JavaScript.

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18 | UI |
| Vite | 5.x | Build tool |
| TypeScript | 5.x | Lenguaje |
| Express | 4.x | Backend API local |
| Playwright | 1.x | Scraping de sitios con JS |
| Turndown | 7.x | Conversión HTML → Markdown |
| @mozilla/readability | 0.5.x | Extracción de contenido limpio |
| Tailwind CSS | 3.x | Estilos |

## Funcionalidades

- **Scraping con Playwright**: soporta páginas con JavaScript, SPA y contenido lazy-loaded
- **Extracción inteligente**: usa Mozilla Readability para extraer solo el contenido relevante
- **Conversión a Markdown**: convierte HTML a Markdown con Turndown
- **SSE en tiempo real**: el progreso del scraping se transmite vía Server-Sent Events
- **Endpoint de polling**: `/api/result/:taskId` como fallback cuando SSE no está disponible

## Arquitectura

```
CopyPage/
├── server/
│   ├── index.ts          # Express server — POST /api/scrape, GET /api/events/:id, GET /api/result/:id
│   └── browser-service.ts # Playwright + Readability + Turndown
└── src/
    ├── App.tsx           # UI principal
    ├── pages/            # Páginas de la app
    ├── components/       # Componentes React
    └── types.ts          # Tipos compartidos
```

## Correr localmente

```bash
pnpm install
pnpm setup         # instala Chromium para Playwright
pnpm dev           # inicia server (puerto 3001) + cliente Vite (puerto 5173)
```

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/scrape` | Inicia job de scraping, retorna `{ taskId }` |
| `GET` | `/api/events/:taskId` | Stream SSE del progreso |
| `GET` | `/api/result/:taskId` | Poll del resultado final (fallback) |
| `GET` | `/api/health` | Health check |

## Build

```bash
pnpm build    # compila TypeScript + Vite → dist/
pnpm preview  # previsualiza el build
```
