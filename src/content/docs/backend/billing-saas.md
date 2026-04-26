---
title: Billing SaaS
description: Herramienta interna de facturación con Kill-Switch Cloudflare
---

# Billing SaaS

Herramienta interna de facturación para agencias y freelancers. Gestiona clientes, suscripciones recurrentes, facturas PDF, y tiene un Kill-Switch para suspender servicios de clientes morosos vía Cloudflare Page Rules.

## Stack

| Capa | Tecnología |
|---|---|
| Backend | .NET 8 — Clean Architecture (Domain / Application / Infrastructure / WebAPI) |
| Worker | .NET 8 Background Service — genera facturas y dispara suspensiones automáticas |
| Frontend | React 18 + Vite 5 + TypeScript + shadcn/ui (Tailwind v4) + TanStack Query v5 |
| Base de datos | PostgreSQL + Entity Framework Core 8 (code-first, migraciones automáticas) |
| PDF | QuestPDF |
| Kill-Switch | Cloudflare Page Rules API |
| Deploy | Railway (billing-api + billing-worker + billing-frontend + PostgreSQL) |

## Arquitectura

```
browser → billing-frontend (nginx) → billing-api (.NET 8)
                                           ↓
                                      PostgreSQL
                                           ↑
                              billing-worker (background)
                                    ↓
                            Cloudflare API (Kill-Switch)
```

El worker corre en su propio contenedor y comparte la misma base de datos que la API. Se encarga de:
- Generar facturas al vencimiento de cada ciclo de facturación
- Encolar ítems de suspensión en la cola de aprobación
- Ejecutar las acciones aprobadas

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Autenticación JWT |
| GET/POST | `/api/clients` | Gestión de clientes |
| GET/POST/DELETE | `/api/subscriptions` | Suscripciones |
| GET | `/api/invoices` | Facturas |
| GET | `/api/invoices/{id}/pdf` | Descargar PDF |
| POST | `/api/invoices/{id}/mark-paid` | Marcar como pagada |
| GET | `/api/execution-list/pending` | Cola de aprobación |
| POST | `/api/execution-list/{id}/approve` | Aprobar acción |
| POST | `/api/execution-list/{id}/reject` | Rechazar acción |
| POST | `/api/kill-switch/activate` | Activar suspensión Cloudflare |
| POST | `/api/kill-switch/deactivate` | Desactivar suspensión |
| GET | `/health` | Health check |
| GET | `/suspended` | Página de suspensión (estática) |

## Variables de entorno

### billing-api y billing-worker

```env
ConnectionStrings__DefaultConnection=Host=...;Database=billing_saas;Username=postgres;Password=...
Jwt__Secret=<mínimo 32 caracteres aleatorios>
Jwt__Issuer=billing-api
Jwt__Audience=billing-client
Cloudflare__ApiToken=<token con permiso Zone → Page Rules → Edit>
Cloudflare__SuspensionUrl=https://<url-billing-api>/suspended
Cors__AllowedOrigins__0=https://<url-billing-frontend>
```

### billing-frontend (build arg)

```env
VITE_API_URL=https://<url-billing-api>
```

## Desarrollo local

### Requisitos

- .NET 8 SDK
- Node.js 22+
- PostgreSQL (local o Docker)

### Backend

```bash
# Crear el archivo de variables (copiar y completar)
cp .env.example .env

# Correr con dotnet watch (aplica migraciones al iniciar)
cd src/BillingSaas.WebAPI
dotnet watch run
```

La API queda en `http://localhost:5000`. Swagger disponible en `/swagger`.

### Frontend

```bash
cd frontend
cp .env.example .env.local   # editar VITE_API_URL=http://localhost:5000
npm install
npm run dev                  # http://localhost:5173
```

### Tests

```bash
# Tests del backend (18 tests)
dotnet test

# Tests del frontend (5 tests — interceptor behavior)
cd frontend && npm test
```

## Kill-Switch — Configuración

El Kill-Switch requiere que el dominio del cliente esté gestionado en Cloudflare.

### Obtener el Cloudflare Zone ID

1. Entrar a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Seleccionar la zona (dominio) del cliente
3. En el panel derecho → **Zone ID** (hash de 32 caracteres)

### Crear el API Token

1. Perfil → **API Tokens** → **Create Token**
2. Template: **Custom Token**
3. Permiso: `Zone → Page Rules → Edit`
4. Zone Resources: todas o las específicas
5. Copiar el token (solo se muestra una vez) → `Cloudflare__ApiToken`

### Flujo de suspensión

1. Al crear una suscripción, ingresar el **Zone ID** de Cloudflare
2. El cliente también debe tener un **Dominio** cargado
3. Desde Kill-Switch → Activar → Cloudflare crea una Page Rule que redirige `*dominio.com/*` a `/suspended`
4. Al reactivar, se elimina la Page Rule

## Deploy en Railway

El proyecto tiene `railway.toml` con los 3 servicios + PostgreSQL.

```toml
billing-api     → src/BillingSaas.WebAPI/Dockerfile
billing-worker  → src/BillingSaas.Worker/Dockerfile
billing-frontend → frontend/Dockerfile  (nginx + Vite build)
```

### Pasos

1. Nuevo proyecto en Railway → **Deploy from GitHub** → repo `billing-saas`
2. Configurar **Root Directory**: `billing-saas`
3. Agregar servicio **PostgreSQL**
4. Configurar env vars en cada servicio (ver arriba)
5. El `billing-api` corre las migraciones automáticamente al iniciar

### CORS en producción

Actualizar la variable en `billing-api`:
```
Cors__AllowedOrigins__0=https://<url-billing-frontend>.railway.app
```

## Estructura del proyecto

```
billing-saas/
├── src/
│   ├── BillingSaas.Domain/          # Entidades, enums, interfaces
│   ├── BillingSaas.Application/     # CQRS (MediatR), validadores, servicios
│   ├── BillingSaas.Infrastructure/  # EF Core, Cloudflare, QuestPDF, JWT
│   ├── BillingSaas.WebAPI/          # Minimal API endpoints, middleware
│   └── BillingSaas.Worker/          # Background service
├── frontend/
│   ├── src/
│   │   ├── api/           # axios client + API files
│   │   ├── features/      # clients, subscriptions, invoices, kill-switch
│   │   ├── pages/         # páginas por ruta
│   │   └── components/    # layout + shadcn/ui
│   └── Dockerfile
├── railway.toml
└── .env.example
```
