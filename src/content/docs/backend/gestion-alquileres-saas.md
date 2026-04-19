---
title: Gestión Alquileres SaaS
description: SaaS multi-tenant de gestión de alquileres — .NET 8 Clean Architecture + React 19 + PostgreSQL
wiki_managed: true
---

# Gestión Alquileres SaaS

SaaS multi-tenant para gestión de propiedades en alquiler. Automatiza cálculos de ajuste
por índices argentinos (ICL/IPC del BCRA/INDEC) y comunicación con inquilinos.

## Stack

| Capa | Tecnología | Versión |
|------|------------|---------|
| Backend | .NET 8 Web API, Clean Architecture | 8.0 |
| ORM | EF Core + PostgreSQL 16 | — |
| CQRS | MediatR + FluentValidation | — |
| Storage | MinIO (S3-compatible) | — |
| Frontend | React + TypeScript + Vite | 19 / 4 |
| Router | React Router | 7 |
| Server state | TanStack Query | 5 |
| Client state | Zustand | 5 |
| Formularios | React Hook Form + Zod | — |
| Infra dev | Docker Compose (postgres:16 + minio) | — |

## Correr localmente

```bash
# 1. Infraestructura (PostgreSQL + MinIO)
docker compose up -d

# 2. API (.NET 8)
cd api
dotnet build
dotnet ef database update --project src/GestionAlquileres.Infrastructure
dotnet run --project src/GestionAlquileres.API    # http://localhost:5000

# 3. Web (React 19)
cd web
pnpm install
pnpm dev    # http://localhost:5173
```

O desde la raíz:

```bash
./start.sh   # levanta todo
./stop.sh    # para todo
```

## Variables de entorno

**API** — `api/src/GestionAlquileres.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=gestion_alquileres;Username=appuser;Password=devpassword"
  },
  "JwtSettings": {
    "SecretKey": "clave_jwt_larga_y_aleatoria",
    "Issuer": "gestion-alquileres"
  },
  "Minio": {
    "Endpoint": "localhost:9000",
    "AccessKey": "minioadmin",
    "SecretKey": "minioadmin"
  }
}
```

**Web** — `web/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Arquitectura

```
api/src/
├── GestionAlquileres.Domain/         # Entidades, interfaces, enums
├── GestionAlquileres.Application/    # CQRS: Commands, Queries, Handlers, Validators
├── GestionAlquileres.Infrastructure/ # EF Core, repositorios, BCRA/INDEC clients, MinIO
└── GestionAlquileres.API/            # Controllers (solo MediatR.Send), Middleware

web/src/
├── features/{nombre}/                # Components, hooks, services, types por feature
├── shared/                           # api.ts, queryClient, authStore, UI components
├── portal-admin/                     # Rutas y páginas del panel admin
└── portal-inquilino/                 # Rutas y páginas del portal de inquilinos
```

## Multi-tenancy

- Discriminador: `OrganizationId` (Guid) en todas las entidades
- Se extrae del claim `org_id` del JWT en `BaseController` — nunca del request body
- EF Core filtra automáticamente con `HasQueryFilter` en `AppDbContext`

## Módulos

- **Contratos**: vigencia, monto, tipo de ajuste (ICL/IPC/Manual), frecuencia
- **Inquilinos**: portal individual con estado de cuenta y comprobantes
- **Propiedades**: inmuebles con documentos privados (URLs pre-firmadas MinIO, 5 min)
- **Ajuste automático**: scheduler mensual, sincronización de índices BCRA/INDEC
- **Transacciones**: historial de pagos, cargos y ajustes

## Lógica de ajuste (crítica)

- **ICL:** `NuevoAlquiler = AlquilerActual × (ICL_T / ICL_T-4)` (trimestral, 1 año atrás)
- **IPC:** acumula variación mensual según frecuencia del contrato
- Los índices se persisten en tabla `Indexes` ANTES de calcular
- Si API BCRA falla → último valor disponible + warning en logs

## Comandos útiles

```bash
# API — nueva migración
cd api && dotnet ef migrations add NombreMigracion --project src/GestionAlquileres.Infrastructure

# API — tests
cd api && dotnet test

# Web — build y lint
cd web && pnpm build && pnpm lint

# MinIO — consola web
# http://localhost:9001 (minioadmin / minioadmin)
```
