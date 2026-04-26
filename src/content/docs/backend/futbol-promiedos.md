---
title: Promiedos Flutter
description: App multiplataforma Windows/Android para seguir partidos de fútbol en vivo — Python FastAPI + Flutter 3
---

# Promiedos Flutter

App multiplataforma (Windows + Android) para seguir partidos de fútbol en vivo, con backend Python y app Flutter.

## Apps

| App | Descripción |
|-----|-------------|
| `backend/` | FastAPI + SQLite + scrapers (API-Football + Promiedos fallback) |
| `flutter_app/` | Flutter 3 — app Windows/Android con scores en vivo y logos de equipos |

## Stack

- **Backend**: Python 3.12, FastAPI, SQLAlchemy, APScheduler, API-Football, Playwright
- **Frontend**: Flutter 3 (Dart), soporte Windows + Android
- **DB**: SQLite (`promiedos.db`)

## Arquitectura

- Scheduler automático que sincroniza partidos del día, resultados en vivo y standings
- Scrapers con fallback: API-Football (quota: 100 req/día) → Promiedos web scraping
- La app Flutter muestra logos de equipos, scores en tiempo real y fixtures
- Endpoint `/api/status` para monitorear el estado del scheduler y quotas

## Setup

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Variables de entorno
API_FOOTBALL_KEY=tu_key_aqui

# Servidor
uvicorn backend.main:app --port 8000 --reload
```

### Flutter App

```bash
cd flutter_app
flutter pub get
flutter run -d windows     # Windows desktop
flutter run -d android     # Android
flutter test               # Tests (8/8)
```

## API Endpoints

| Ruta | Descripción |
|------|-------------|
| `GET /api/matches` | Partidos del día |
| `GET /api/matches/live` | Partidos en vivo |
| `GET /api/standings` | Tabla de posiciones |
| `GET /api/h2h` | Head-to-head entre equipos |
| `GET /api/status` | Estado del scheduler y quotas |

## Estructura

```
Futbol-Promiedos/
├── backend/
│   ├── api/              # FastAPI routes
│   ├── scrapers/         # FixtureScraper, LiveScraper, StandingsScraper
│   ├── clients/          # API-Football client
│   ├── database/         # Modelos SQLAlchemy + conexión
│   ├── sources/          # Configuración de fuentes
│   └── sync.py           # Lógica de sincronización
└── flutter_app/
    ├── lib/
    │   ├── core/         # Config, tema, red
    │   ├── features/     # Matches, standings, h2h
    │   └── shared/       # Widgets compartidos
    └── test/             # Tests Flutter (8/8 passing)
```

## Tags

- `flutter-v1.0` — primera versión estable con 8/8 tests pasando
- `backend-v1.0` — backend API estable con API-Football + fallback Promiedos
