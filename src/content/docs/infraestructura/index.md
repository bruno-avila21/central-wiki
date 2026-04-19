---
title: Infraestructura
description: CI/CD, Docker, GitHub Actions y patrones de deploy del ecosistema
wiki_managed: true
---

# Infraestructura

Patrones de deploy, CI/CD y containerización compartidos por los proyectos del ecosistema.

## GitHub Actions — Flujo de deploy

### Wiki (central-wiki)

```
push a main
    │
    ├── build (Astro → dist/)
    └── deploy → GitHub Pages
```

Workflows: `deploy.yml` (build + pages), `sync-readmes.yml` (sincronización desde repos externos).

### Sync automático de documentación

Cada repo externo tiene `notify-wiki.yml`. Al cambiar el `README.md` en `main`/`master`:

```
README.md cambia en repo externo
    │
    └── notify-wiki.yml dispara repository_dispatch
            │
            └── sync-readmes.yml en central-wiki
                    │
                    ├── fetcha el README
                    ├── inyecta frontmatter Starlight si falta
                    └── hace commit y push → triggerea deploy
```

Repos que no tienen `wiki_managed: true` en su página del wiki se sobreescriben automáticamente.

## Docker

### Proyectos dockerizados

| Proyecto | Imagen base | Puerto |
|----------|-------------|--------|
| ecommerce-saas | `node:22-alpine` → `nginx:alpine` | 8080 |
| gestion-alquileres-saas | `mcr.microsoft.com/dotnet/aspnet:8.0` | 5000 |
| gestion-alquileres-saas (web) | `node:22-alpine` → `nginx:alpine` | 80 |

### Patrón multi-stage (SPA)

```dockerfile
# Stage 1 — build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
RUN npm run build

# Stage 2 — serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
```

Las variables `VITE_*` se pasan como `--build-arg` — se queman en build time, no son runtime.

### Docker Compose (desarrollo local)

`gestion-alquileres-saas` usa Compose para levantar PostgreSQL 16 + MinIO:

```bash
docker compose up -d   # postgres:16 en :5432, minio en :9000/:9001
./start.sh             # levanta todo (compose + dotnet + pnpm dev)
./stop.sh              # para todo
```

## Secretos y variables de entorno

| Secret | Usado en | Para qué |
|--------|----------|----------|
| `WIKI_SYNC_TOKEN` | todos los repos externos | dispara `repository_dispatch` en central-wiki |
| `GITHUB_TOKEN` | central-wiki | hace commit y push en sync-readmes.yml |
| `ANTHROPIC_API_KEY` | claude-agents, Investigador | llamadas a la API de Claude |

## Vercel Functions

`invitation-builder` y `simulador-credito` usan Vercel Functions (TypeScript) en la carpeta `api/`:

```
api/
├── bcra-tna.ts        # proxy a API del BCRA (simulador-credito)
├── mercadopago.ts     # checkout + webhook (invitation-builder)
└── supabase-admin.ts  # operaciones privilegiadas (invitation-builder)
```

Deploy automático via integración GitHub → Vercel en cada push al branch principal.
