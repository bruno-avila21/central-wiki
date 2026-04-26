---
title: MediaVault
description: Media Center personal con integración TMDB, biblioteca local con watcher y streaming HLS — backend Node.js/TypeScript + frontend Next.js
---

# MediaVault

Media Center personal tipo Plex/Stremio, construido para PC y móvil. Integra metadatos de TMDB, gestiona una biblioteca local de videos con detección automática de archivos y soporta streaming HLS con motor de búsqueda de fuentes.

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | 20+ | Runtime |
| Express | 4.x | API HTTP |
| TypeScript | 5.x | Lenguaje |
| Prisma | 5.x | ORM |
| SQLite | — | Base de datos local |
| chokidar | 3.x | File watcher (biblioteca local) |
| Zod | 3.x | Validación de inputs |
| Vitest | 2.x | Tests (unit + integración) |
| Next.js | 14.x | Frontend (App Router) |
| TailwindCSS | 3.x | Estilos — design tokens custom |
| SWR | 2.x | Data fetching + cache |
| Framer Motion | 11.x | Animaciones y transiciones |
| Video.js + hls.js | 8.x / 1.x | Player HLS |
| TMDB API | v3 | Metadatos de películas y series |

## Correr localmente

```bash
# API (puerto 3001)
cd api && npm install
cp .env.example .env   # completar TMDB_API_KEY
npm run dev

# Web (puerto 3000) — en otra terminal
cd web && npm install
npm run dev

# Migraciones (desde la raíz del repo)
npx prisma migrate dev
```

Abrí `http://localhost:3000` y agregá una carpeta de biblioteca desde `/settings`.

## Variables de entorno

```env
TMDB_API_KEY=           # API key de TMDB (themoviedb.org)
TMDB_LANGUAGE=es-AR     # Idioma para metadatos (default: es-AR)
PORT=3001               # Puerto del servidor (default: 3001)
DATABASE_URL=file:./prisma/mediavault.db

# Phase 3 — HLS Search
JACKETT_URL=            # opcional — activa JackettProvider si presente
JACKETT_API_KEY=        # opcional
JACKETT_INDEXERS=all    # default "all"
STREAMS_TIMEOUT_MS=5000 # default 5000
```

## Comandos

```bash
# API
cd api && npm run dev        # tsx watch — hot reload
cd api && npm run build      # tsc → dist/
cd api && npm run test       # vitest run (69 tests)
cd api && npm run lint       # tsc --noEmit (strict)

# Web
cd web && npm run dev        # next dev (puerto 3000)
cd web && npm run build      # next build
cd web && npm run test       # vitest run (50 tests)
cd web && npm run lint       # tsc --noEmit

# Prisma
npx prisma migrate dev       # nueva migración
npx prisma studio            # explorador BD visual
```

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/tmdb/search?q=&year=` | Buscar en TMDB |
| `GET` | `/api/media` | Listar toda la biblioteca |
| `GET` | `/api/media/:id` | Detalle de un medio |
| `POST` | `/api/media` | Agregar medio manual |
| `DELETE` | `/api/media/:id` | Eliminar medio |
| `POST` | `/api/media/:id/refresh` | Refrescar metadatos TMDB |
| `GET` | `/api/library/folders` | Listar carpetas monitoreadas |
| `POST` | `/api/library/folders` | Agregar carpeta a la biblioteca |
| `DELETE` | `/api/library/folders/:id` | Quitar carpeta |
| `POST` | `/api/library/scan` | Escanear todas las carpetas |
| `GET` | `/api/progress/:mediaId` | Obtener progreso de reproducción |
| `PUT` | `/api/progress/:mediaId` | Guardar progreso (segundos + episodio) |
| `GET` | `/api/stream/:fileId` | Stream del archivo local (Range headers) |
| `GET` | `/api/streams?title=&type=&year=&quality=&season=&episode=` | Buscar streams externos (Jackett + YTS) |
| `GET` | `/api/events` | SSE — actualizaciones de biblioteca en tiempo real |

## Arquitectura

```
Peliculas-Series/
├── api/
│   ├── src/
│   │   ├── routes/          # Validación Zod + llamada al service (sin lógica)
│   │   ├── services/        # Lógica de negocio (tmdb, media, library, progress)
│   │   │   └── streams/     # Phase 3 — aggregator + registry + providers/{jackett,yts}
│   │   ├── middleware/      # Error handler global
│   │   ├── utils/           # filename-parser (función pura)
│   │   ├── schemas/         # Schemas Zod (library, progress, streams)
│   │   ├── app.ts           # Factory createApp() — monta routers
│   │   └── server.ts        # Entry point — puerto + initWatchers()
│   └── tests/
│       ├── unit/            # filename-parser, tmdb, media, progress, library
│       └── integration/     # media routes, library routes, progress routes
├── prisma/
│   └── schema.prisma        # 4 modelos: Media, LocalFile, WatchProgress, LibraryFolder
└── web/                     # Next.js 14 (App Router)
    ├── app/                 # Rutas: /, /media/[id], /player/[mediaId]/[fileId], /settings
    ├── components/          # layout, home, media, player, ui
    ├── lib/
    │   ├── api.ts           # Typed fetch client
    │   └── hooks/           # useMedia, useMediaDetail, useProgress (SWR)
    ├── types/api.ts         # Tipos espejando la API
    └── tests/unit/          # Tests de componentes y hooks
```

## Fases de desarrollo

| Fase | Estado | Descripción |
|------|--------|-------------|
| 1 — API Foundation | Completa | Express + Prisma + TMDB + Library watcher + Stream |
| 2 — UI Next.js | Completa | Home, Detail, Player (Video.js + hls.js), Settings con SSE |
| 3 — HLS Search Engine | Completa | Plugin StreamProvider (Jackett + YTS), endpoint + UI con copy-to-clipboard |
| 4 — PWA | Pendiente | Manifest + Service Worker — instalable en móvil |
| 5 — Android | Pendiente | Capacitor APK |

## Tests

```bash
cd api && npm run test       # 69 tests — unit + integration (prisma/test.db aislada)
cd web && npm run test       # 50 tests — componentes + hooks SWR (jsdom)
```
