---
title: Stock Product
description: SaaS de gestión de inventario multi-tenant — monorepo con backend, dashboard, storefront y landing
wiki_managed: true
---

# Stock Product — Monorepo SaaS

Plataforma SaaS de gestión de inventario multi-tenant. Cada tenant tiene su propia base de datos PostgreSQL y puede personalizar completamente su marca y storefront.

## Sub-proyectos

| Carpeta | Rol | Puerto dev |
|---------|-----|-----------|
| `backend/` | API REST — Express + PostgreSQL, JWT, RBAC, multi-tenant | 3001 |
| `frontend/` | Dashboard de administración — React 18 + Vite | 5173 |
| `storefront/` | Tienda ecommerce customer-facing — React 18 + Vite | 3000 |
| `landing/` | Landing page del SaaS (Vaultec) — React 18 + Vite | 4173 |
| `n8n/` | Automatización de workflows | — |
| `packages/sdk` | SDK TypeScript `@stock-product/sdk` | — |
| `packages/create-sp-app` | CLI para crear nuevas instancias | — |

## Stack global

| Capa | Tecnología |
|------|------------|
| Backend | Node.js + Express, PostgreSQL (pool por tenant) |
| Frontend / Storefront | React 18, Vite, Tailwind CSS |
| Auth | JWT (access + refresh), RBAC por rol |
| Multi-tenant | `X-Tenant-ID` header → DB dedicada por tenant |
| Estilos | CSS variables `var(--color-*)` — sin inline styles |
| Testing | Vitest — patrón AAA, cobertura mínima: éxito + edge + error |
| CI/CD | GitHub Actions |
| Deploy | Railway (backend + storefront), Cloudflare R2 (uploads) |

## Inicio rápido (Windows)

```bash
# Forma rápida: doble clic en
iniciar_proyecto.bat     # levanta backend + frontend
detener_proyecto.bat     # libera puertos

# Manual
cd backend   && npm run dev   # :3001
cd frontend  && npm run dev   # :5173
cd storefront && npm run dev  # :3000
cd landing   && npm run dev   # :4173
```

## Convenciones de código (OBLIGATORIO en todo el monorepo)

| Prefijo | Uso | Ejemplo |
|---------|-----|---------|
| `i` | Variables internas / state | `iProducto`, `iCargando` |
| `e` | Props / params externos | `eReq`, `eProducto` |
| `c` | Configuración | `cPuerto`, `cBaseUrl` |

- Funciones async: sufijo `Async` — `cargarProductosAsync`
- Idioma: **español** para funciones, variables, archivos y tests
- Respuestas API: `{ "exito": true, "datos": {} }` / `{ "exito": false, "mensaje": "..." }`

## Multi-tenancy

```
acme.tuapp.com  → X-Tenant-ID: acme → pool_acme (DB)
demo.tuapp.com  → X-Tenant-ID: demo → pool_demo (DB)
localhost       → usa VITE_TENANT_ID o "demo"
```

**Reglas críticas:**
- Nunca hardcodear una DB específica — siempre usar `eReq.pool`
- Firma de helpers: `consultarTodos(sql, params, pool)` — pool siempre **tercero**
- Cache: usar `Map` con clave por tenant — nunca variable de módulo compartida

## Backend — endpoints principales

```
POST /api/auth/login               público
GET  /api/productos                JWT + RBAC
GET  /api/config/tema              público (CSS vars del tenant)
GET  /api/tienda-config            público (branding del tenant)
GET  /api/public/productos         catálogo público del tenant
POST /api/signup                   registro self-service
POST /api/webhooks/mercadopago     webhook MP
GET  /api/planes                   planes SaaS disponibles
/docs                              Scalar UI (OpenAPI)
```

## Migrations y provisioning

```bash
cd backend
npm run migrate          # migraciones en todos los tenants
npm run provision        # provisionar nuevo tenant
npm run migrate:r2       # migrar uploads locales → Cloudflare R2
npm run seed:presets     # cargar presets de tema
```

## Testing

```bash
cd backend   && npm test -- nombreArchivo
cd frontend  && npm test -- NombreComponente
cd storefront && npm test
cd landing   && npm test
```

## Documentación detallada

- [Storefront](/frontend/stock-product-storefront) — tienda ecommerce customer-facing, multi-tenant, white-label
- [Landing](/frontend/stock-product-landing) — landing del SaaS, configurable desde `config.js`
