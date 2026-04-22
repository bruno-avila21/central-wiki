---
title: Promiedos Local
description: Herramienta personal de fútbol en vivo — backend REST API + app Tauri + app Flutter (Windows/Android)
wiki_managed: true
---

# Promiedos Local

Herramienta personal para seguir resultados de fútbol en vivo, ver fixtures, standings y estadísticas head-to-head — sin publicidad, sin paywalls.

El proyecto tiene tres implementaciones separadas:

- **Futbol-Promiedos/backend/** — API REST standalone (v1.0, activa)
- **Futbol/** — App de escritorio completa Tauri 2 + React 19 (referencia)
- **Futbol-Promiedos/flutter_app/** — App Flutter multiplataforma (Windows + Android, v1.0)

---

## Backend API (v1.0) — `Futbol-Promiedos/backend/`

API REST Python con scrapers Playwright para consumir datos de promiedos.com.ar.

### Tech stack

| Capa | Tecnología |
|------|-----------|
| Lenguaje | Python 3.14 |
| Framework | FastAPI + uvicorn |
| Scraping | Playwright (sync) |
| Scheduler | APScheduler 3.x (BackgroundScheduler) |
| Base de datos | SQLite + WAL mode |
| Validación | Pydantic v2 |
| Tests | pytest + pytest-asyncio + httpx |

### Arquitectura

```
[APScheduler] ──► [LiveScraper/FixtureScraper] ──► [SQLite]
                                                        │
                                              [FastAPI :8000]
                                                        │
                              ┌─────────────────────────┤
                              ▼                         ▼
                   GET /matches/live           GET /standings
                   GET /matches/today          GET /teams
                   GET /matches?date=&league=  GET /h2h/{a}/{b}
                                               GET /status
```

### Scrapers

| Scraper | Descripción |
|---------|-------------|
| `base_scraper.py` | Base con `try_selectors()` + multi-fallback selector pattern |
| `live_scraper.py` | Partidos en vivo — `_get_match_rows()` itera selectores alternativos |
| `fixture_scraper.py` | Fixture por fecha — `navigate(date)` → `/fixture/{date}` |
| `standings_scraper.py` | Tabla de posiciones con `avg_points` y `relegation_zone` |
| `h2h_scraper.py` | Head-to-head entre dos equipos — normaliza orden con `min/max` |

### Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/matches/live` | Partidos en vivo desde SQLite |
| `GET` | `/matches/today` | Partidos del día |
| `GET` | `/matches` | Partidos filtrados por `date=` y `league=` |
| `GET` | `/standings` | Tabla de posiciones (`season=` opcional, default "2025") |
| `GET` | `/teams` | Lista de equipos registrados |
| `GET` | `/h2h/{team_a_id}/{team_b_id}` | Historial head-to-head (orden normalizado) |
| `GET` | `/status` | Estado del scraper — último run por tipo, tamaño DB |

### Estructura del proyecto

```
backend/
├── api/
│   ├── routes/
│   │   ├── matches.py     # GET /matches/*
│   │   ├── standings.py   # GET /standings
│   │   ├── h2h.py         # GET /teams, /h2h
│   │   └── status.py      # GET /status
│   └── schemas.py         # Modelos Pydantic v2
├── scrapers/
│   ├── base_scraper.py
│   ├── live_scraper.py
│   ├── fixture_scraper.py
│   ├── standings_scraper.py
│   └── h2h_scraper.py
├── database/              # connection.py + schema.sql
├── tests/                 # 35 tests (unit + API)
│   └── fixtures/          # HTML de prueba por scraper
├── config.py
├── main.py                # create_app() + lifespan (APScheduler)
└── requirements.txt
```

### Desarrollo local

```bash
cd Futbol-Promiedos/backend
pip install -r requirements.txt
playwright install chromium
uvicorn backend.main:app --port 8000 --reload

# Tests
PYTHONPATH=$(pwd) python -m pytest tests/ -v  # 35 tests
```

### Notas de implementación

- `_get_match_rows()` / `_get_rows()` itera todos los selectores de fallback — nunca hardcodea `[0]`.
- `league` se extrae de `data-league` o `try_selectors()` — nunca default hardcodeado.
- El H2H SQL normaliza el orden de equipos: `MIN(team_a_id) = min(a,b)` y `MAX(team_b_id) = max(a,b)`.
- `_today()` como función de módulo permite monkeypatching en tests.
- SQLite en modo WAL permite reads concurrentes mientras el scraper escribe.
- **Tag:** `backend-v1.0`
- **Selectores calibrados:** CSS Modules con clases hasheadas → `[class*='...']`. Iteración en dos niveles: grupo de liga → filas de partido. `match_id` desde href. Standings en `/league/liga-profesional/hc`, tabla `.destinations` detectada por header "Promedios". Relegation via inline style `rgb(230,16,52)`. H2H en páginas de partido (`/game/{slug}/{id}`), requiere click en "VER MÁS", fecha `DD/MM/YYYY` → ISO. Fixture URL: `/games/DD-MM-YYYY`.

---

## App de escritorio — `Futbol/`

Implementación completa con UI Tauri 2 + React 19.

### Tech stack

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

### Arquitectura

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

### Módulos clave

- **scraper/engine.py** — Lee selectores desde `selectors.json` en runtime. Si el sitio cambia, solo actualizar el JSON.
- **scraper/interceptor.py** — Captura URLs `.m3u8` interceptando la red del browser Playwright.
- **scraper/scheduler.py** — Refresco cada 60s live, cada 5min sin partidos.
- **api/routes/stream.py** — Proxy HLS que reescribe 100% de las URLs de segmentos.

### Tests

- **Python:** 20 tests (17 unit + 3 integration)
- **UI (vitest):** 13 tests (client, MatchCard, VideoPlayer, StandingsTable)

### Notas de implementación

- **playwright-stealth** requiere `setuptools < 67`.
- **Tailwind v4** requiere `@tailwindcss/vite` — no PostCSS.
- El proxy HLS reescribe: master playlist → variant playlists → segmentos `.ts`.
- **Selectores CSS Modules:** promiedos.com.ar usa Next.js con clases hasheadas. Todos los selectores usan `[class*='...']` para matchear el prefijo estable. El match_id se extrae del último segmento del `href` (no de un atributo `data-*`). El marcador es un único campo `"X - Y"` (no separado por equipo), y la columna de goles en la tabla tiene formato `"17:7"` (gf:ga separado por `:`). Iteración en dos niveles: grupo de liga → filas de partido.

---

## App Flutter — `Futbol-Promiedos/flutter_app/`

App multiplataforma (Windows + Android) que consume el backend REST. Tag `flutter-v1.0`.

### Tech stack

| Capa | Tecnología |
|------|-----------|
| Lenguaje | Dart 3.11.5 |
| Framework | Flutter 3.41.7 |
| Estado | Riverpod 2.5 (`flutter_riverpod`) |
| HTTP | `http` 1.2 |
| Persistencia | `shared_preferences` 2.2 (base URL del backend) |
| UI | Material 3 + `shimmer` 3.0 + `dropdown_search` 5.0 |
| Tests | `flutter_test` + `mockito` 5.4 + `build_runner` |

### Arquitectura

```
[Flutter UI] ──HTTP──► [Backend FastAPI]
     │
     └─ Riverpod providers → ApiClient (base URL desde SharedPreferences)
```

### Estructura

```
flutter_app/
├── lib/
│   ├── core/
│   │   ├── theme.dart          # AppColors (dark tokens)
│   │   ├── api_client.dart     # HTTP cliente base
│   │   └── providers.dart      # apiClientProvider + baseUrlProvider
│   ├── features/
│   │   ├── today/              # Partidos del día (match_card, league_filter)
│   │   ├── standings/          # Tabla (standings_row con relegation flag)
│   │   ├── h2h/                # Head-to-head (dual dropdown + dominance_bar)
│   │   └── settings/           # Base URL configurable
│   ├── shared/
│   │   ├── models/             # Match, Standing, Team, H2HRecord
│   │   └── widgets/            # ShimmerLoader, ErrorState
│   └── main.dart               # ProviderScope + MaterialApp + 4-tab Scaffold
├── test/                       # 6 files, 8 tests (api_client, providers, models)
├── windows/                    # Flutter Windows runner
├── android/                    # Flutter Android project
└── pubspec.yaml
```

### Pestañas

| Tab | Pantalla | Datos consumidos |
|-----|----------|------------------|
| Hoy | Partidos del día + filtro de ligas + live badge con pulse | `GET /matches/today` |
| Promedios | Tabla de posiciones ordenada | `GET /standings?season=` |
| H2H | Head-to-head con dominance bar + records | `GET /teams` + `GET /h2h/{a}/{b}` |
| Config | Base URL del backend (persiste en SharedPreferences) | — |

### Desarrollo local

```bash
cd Futbol-Promiedos/flutter_app
flutter pub get
flutter test                    # 8/8 tests
flutter analyze                 # 0 issues
flutter run -d windows          # requiere VS Community con "Desktop development with C++"
```

### Notas de implementación

- El tema oscuro usa tokens centralizados en `AppColors` (background `#0D0D0D`, primary `#00C853`, liveBadge `#F44336`).
- Live badge animado con `AnimationController` pulsando alpha.
- La base URL default es `http://localhost:8000` (backend standalone). Se cambia desde la pestaña Config.
- `flutter create --platforms windows,android` — iOS/macOS/Linux/Web NO habilitados.
- **Tag:** `flutter-v1.0`
