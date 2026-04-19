---
title: Stock Product
description: Documentación de stock-product
---

# Stock Product — SaaS de Gestión de Inventario

Plataforma SaaS multi-tenant de gestión de inventario con ecommerce customer-facing, sistema de temas white-label y billing integrado con MercadoPago.

## Sub-proyectos

| Carpeta | Descripción | Puerto dev |
|---------|-------------|-----------|
| `backend/` | API REST — Express + PostgreSQL, JWT, RBAC | 3001 |
| `frontend/` | Dashboard de administración — React 18 + Vite | 5173 |
| `storefront/` | Tienda ecommerce customer-facing, multi-tenant | 3000 |
| `landing/` | Landing page del SaaS (Vaultec) | 4173 |
| `n8n/` | Automatización de workflows | — |
| `packages/sdk` | SDK TypeScript `@stock-product/sdk` | — |
| `packages/create-sp-app` | CLI para crear nuevas instancias | — |

## Stack

| Capa | Tecnología |
|------|------------|
| Backend | Node.js + Express, PostgreSQL (pool por tenant) |
| Admin Dashboard | React 18, Vite, Tailwind CSS, React Router v6 |
| Storefront | React 18, Vite, Framer Motion, Tailwind CSS |
| Landing | React 18, Vite, CSS puro |
| Auth | JWT (7 días), RBAC (ADMIN/VENDEDOR), Google OAuth |
| Storage | Cloudflare R2 (compatible S3) |
| Emails | Resend |
| Pagos | MercadoPago (suscripciones SaaS) |
| Monitoring | Sentry |
| Testing | Vitest (unit) + Playwright (E2E) |

## Inicio rápido (Windows)

```bash
# Doble clic en:
iniciar_proyecto.bat    # levanta backend + frontend
detener_proyecto.bat    # libera puertos
```

## Instalación manual

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (dashboard)
cd frontend && npm install && npm run dev

# Storefront
cd storefront && npm install && npm run dev

# Landing
cd landing && npm install && npm run dev
```

## Arquitectura multi-tenant

Cada tenant tiene su propia base de datos PostgreSQL. El tenant se resuelve desde el header `X-Tenant-ID` en el backend, y desde el subdominio en el storefront:

```
admin.acme.tuapp.com  →  tenant: acme
acme.tuapp.com        →  storefront del tenant acme
localhost             →  tenant: demo (dev)
```

## Variables de entorno

Ver `.env.example` en cada sub-proyecto. Variables clave del backend:

```env
PORT=3001
DATABASE_URL=postgres://...     # Master DB (Railway)
JWT_SECRET=...
R2_ACCOUNT_ID=...              # Cloudflare R2
MP_ACCESS_TOKEN=...            # MercadoPago
RESEND_API_KEY=...             # Emails
```

## Comandos operacionales

```bash
cd backend
npm run migrate          # Migrations en todos los tenants
npm run provision        # Registrar nuevo tenant
npm run migrate:r2       # Migrar uploads locales → R2
npm run seed:presets     # Cargar presets de tema
```

## Convenciones de código

| Prefijo | Uso | Ejemplo |
|---------|-----|---------|
| `i` | Variables internas | `iProducto`, `iCargando` |
| `e` | Props / params externos | `eReq`, `eProducto` |
| `c` | Configuración | `cPuerto`, `cBaseUrl` |

- Async: sufijo `Async` — `cargarProductosAsync()`
- Idioma: **español** para funciones, variables, archivos
- Respuesta API: `{ "exito": true, "datos": {} }`
- Tests: Vitest, patrón AAA, `__tests__/` al lado del fuente

## Endpoints principales

```
POST /api/auth/login           Autenticación
GET  /api/productos            Catálogo (JWT)
GET  /api/public/productos     Catálogo público (sin auth)
GET  /api/config/tema          Tema CSS del tenant
GET  /api/tienda-config        Branding del tenant
POST /api/signup               Registro self-service
GET  /api/planes               Planes SaaS
GET  /api/salud                Health check
GET  /docs                     API docs (Scalar UI)
```

## Documentación completa

Disponible en el [wiki centralizado](https://bruno-avila21.github.io/central-wiki/).
