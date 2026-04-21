---
title: Promiedos Local
description: Herramienta personal de escritorio para seguir resultados de fútbol en vivo y reproducir streams HLS
wiki_managed: true
---

# Promiedos Local

Herramienta personal de escritorio para seguir resultados de fútbol en vivo, ver standings y reproducir streams de video — sin publicidad, sin paywalls.

## Tech stack

| Capa | Tecnología |
|------|-----------|
| Scraper | Python 3.12 + Playwright (async) + playwright-stealth |
| Scheduler | APScheduler 3.x |
| Backend | FastAPI + uvicorn + aiosqlite |
| Proxy HLS | httpx (async, streaming) |
| Base de datos | SQLite (un solo archivo local) |
| UI Desktop | Tauri 2 + React 19 + TypeScript |
| Estilos | Tailwind CSS v4 |
| Video | Video.js 8 + HLS.js |
| Tests | pytest (Python) + vitest + Testing Library (UI) |

## Arquitectura

**Invariante principal:** La UI nunca hace requests a sitios externos. Todo el tráfico pasa por `localhost:8765`.

```
[Playwright Scraper] ──► [SQLite cache] ◄── [FastAPI :8765]
[Playwright Interceptor] ──► [SQLite streams]       │
                                                     ▼
                                         [React UI localhost:1420]
                                                     │
                                           /stream proxy HLS
                                                     │
                                         [Video.js reproduce]
```

### Módulos

- **scraper/engine.py** — Scrapea resultados y standings. Lee selectores desde `selectors.json` en runtime. Si el sitio cambia, solo actualizar el JSON.
- **scraper/interceptor.py** — Captura URLs `.m3u8` interceptando la red del browser Playwright. Lazy: solo corre cuando el usuario clickea "Ver".
- **scraper/scheduler.py** — APScheduler: refresco cada 60s si hay partidos live, cada 5min si no.
- **api/routes/stream.py** — Proxy HLS que reescribe todas las URLs de segmentos `.ts` y playlists `.m3u8` anidadas para que pasen por el proxy. Video.js nunca contacta el CDN directamente.

### TTL de cache

| Tabla | TTL |
|-------|-----|
| matches (live) | 90 seg |
| matches (programado) | 15 min |
| standings | 15 min |
| streams | 4 horas |

## Estructura del proyecto

```
promiedos-local/
├── scraper/           # engine.py, interceptor.py, scheduler.py, selectors.json
├── api/               # FastAPI app + routes + db.py + models.py
├── database/          # schema.sql
├── ui/                # Tauri 2 + React 19
│   ├── src/           # components, pages, hooks, api client
│   └── src-tauri/     # Rust shell, tauri.conf.json
└── tests/             # unit + integration (30 tests)
```

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/matches` | Partidos del día desde SQLite |
| `GET` | `/api/standings?league=` | Tabla de posiciones |
| `POST` | `/api/streams/capture` | Lanza interceptor para capturar m3u8 |
| `GET` | `/stream?url=` | Proxy HLS (reescribe URLs de segmentos) |
| `GET` | `/health` | Healthcheck |

## Páginas UI

- **Home (`/`)** — Grid de partidos filtrable por liga. Badge LIVE pulsante. Botón "Ver" solo en partidos en vivo. Polling 60s.
- **Live (`/live/:matchId`)** — Lanza captura de stream al navegar → VideoPlayer con HLS.js. Muestra marcador en tiempo real.
- **Standings (`/standings`)** — Tabla de posiciones por liga con diferencia de gol coloreada.

## Desarrollo local

```bash
# Backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
uvicorn api.main:app --port 8765 --reload

# UI (en otra terminal)
cd ui
npm install
npm run dev

# Tests
pytest tests/ -v          # 17 tests Python
cd ui && npm run test     # 13 tests UI
```

## Notas de implementación

- **playwright-stealth** requiere `setuptools < 67` (usa `pkg_resources` removido en setuptools 82+).
- **Tailwind v4** requiere el plugin `@tailwindcss/vite` — no usa PostCSS.
- El proxy HLS reescribe 100% de las URLs: master playlist → variant playlists → segmentos `.ts`. Video.js nunca ve una URL de CDN.
- `selectors.json` es el único archivo a editar si cambia el HTML del sitio fuente.
