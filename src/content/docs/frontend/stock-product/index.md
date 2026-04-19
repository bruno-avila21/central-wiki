---
title: Stock Product
description: SaaS de gestión de inventario multi-tenant — monorepo con backend, dashboard, storefront y landing
wiki_managed: true
---

# Stock Product — SaaS de Inventario

Plataforma SaaS multi-tenant de gestión de inventario. Cada tenant tiene su propia base de datos PostgreSQL, marca personalizable y storefront ecommerce.

## Sub-proyectos

| Carpeta | Rol | Puerto dev |
|---------|-----|-----------|
| [`backend/`](/frontend/stock-product/backend) | API REST — Express + PostgreSQL, JWT, RBAC | 3001 |
| [`frontend/`](/frontend/stock-product/frontend) | Dashboard de administración — React 18 + Vite | 5173 |
| [`storefront/`](/frontend/stock-product/storefront) | Tienda ecommerce customer-facing, white-label | 3000 |
| [`landing/`](/frontend/stock-product/landing) | Landing page del SaaS (Vaultec) | 4173 |
| `n8n/` | Automatización de workflows | — |
| `packages/sdk` | SDK TypeScript `@stock-product/sdk` | — |
| `packages/create-sp-app` | CLI para crear nuevas instancias | — |

## Inicio rápido (Windows)

```bash
iniciar_proyecto.bat    # doble clic — levanta backend + frontend
detener_proyecto.bat    # libera puertos antes de cambiar de proyecto
```

Manual:

```bash
cd backend    && npm run dev   # :3001
cd frontend   && npm run dev   # :5173
cd storefront && npm run dev   # :3000
cd landing    && npm run dev   # :4173
```

## Convenciones globales (todo el monorepo)

| Prefijo | Uso | Ejemplo |
|---------|-----|---------|
| `i` | Variables internas / state | `iProducto`, `iCargando` |
| `e` | Props / parámetros externos | `eReq`, `eProducto` |
| `c` | Configuración | `cPuerto`, `cBaseUrl` |

- Async functions: sufijo `Async` — `cargarProductosAsync`
- Idioma: **español** para funciones, variables, archivos y tests
- Respuesta API estándar: `{ "exito": true, "datos": {} }` / `{ "exito": false, "mensaje": "..." }`
- Tests: Vitest, patrón AAA, descripciones en español, carpeta `__tests__/` al lado del fuente

## Arquitectura multi-tenant

```
acme.tuapp.com  →  X-Tenant-ID: acme  →  pool_acme (PostgreSQL)
demo.tuapp.com  →  X-Tenant-ID: demo  →  pool_demo (PostgreSQL)
localhost       →  VITE_TENANT_ID     →  pool local
```

- Master DB: tabla `tenants` con registro de cada tenant (slug, plan, db_url)
- Tenant DB: esquema dedicado por tenant (productos, ventas, usuarios, tema…)
- Pool LRU: máx 25 pools simultáneos en memoria
- **Firma crítica:** `consultarTodos(sql, params, pool)` — pool siempre **tercero**
- **Cache:** siempre `Map` con clave por tenant — nunca variable de módulo compartida

## Testing

```bash
cd backend    && npm test
cd frontend   && npm test
cd storefront && npm test
cd landing    && npm test
```
