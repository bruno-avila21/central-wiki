---
title: Promiedos Local (Tauri)
description: Herramienta de escritorio para seguir resultados de fútbol en vivo y reproducir streams — Python FastAPI + Tauri 2 + React
---

# Promiedos Local (Tauri)

Herramienta de escritorio para seguir resultados de fútbol en vivo y reproducir streams. Versión con UI nativa en Tauri 2 + React 19.

## Apps

| App | Descripción |
|-----|-------------|
| `scraper/` | Python 3.12 + Playwright — scraping de resultados y captura de streams m3u8 |
| `api/` | FastAPI + aiosqlite — API local + proxy HLS |
| `ui/` | Tauri 2 + React 19 + TypeScript — interfaz de escritorio nativa |
| `database/schema.sql` | Schema SQLite |

## Stack

- **Backend**: Python 3.12, FastAPI, aiosqlite, Playwright, httpx
- **Frontend**: Tauri 2, React 19, TypeScript, Vite
- **DB**: SQLite (`promiedos.db`)

## Arquitectura

- La UI solo habla con `localhost:8765`. Nunca hace requests directos a sitios externos.
- `scraper/engine.py` lee `selectors.json` en runtime — si cambia el sitio, solo actualizar el JSON.
- `api/routes/stream.py` es un proxy HLS que reescribe URLs de segmentos `.ts` y `.m3u8` anidados.

## Setup y Dev

### Backend Python

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium

# Servidor
uvicorn api.main:app --port 8765 --reload

# Tests
pytest tests/ -v
```

### UI Tauri

```bash
cd ui
npm install
npm run tauri dev     # dev con hot reload
npm run tauri build   # build de producción
npm run test          # Vitest
```

## Estructura

```
Futbol/
├── api/          # FastAPI routes, proxy HLS
├── scraper/      # Playwright scraping engine + selectors.json
├── database/     # Schema SQLite + conexión
├── sources/      # Fuentes de datos (leagues, streams)
├── tests/        # pytest
└── ui/           # Tauri 2 + React 19
    └── src-tauri/ # Configuración Rust de Tauri
```

## Reglas críticas

- NUNCA hardcodear CSS selectors en `engine.py` — siempre usar `selectors.json`
- NUNCA hacer requests a sitios externos desde la UI — todo pasa por `localhost:8765`
- SIEMPRE async/await en Python (aiosqlite, httpx async, playwright async)
- NUNCA commitear `promiedos.db`
