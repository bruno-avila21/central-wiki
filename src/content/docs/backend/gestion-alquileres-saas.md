---
title: Gestión Alquileres SaaS
description: Sistema SaaS para gestión de propiedades en alquiler con API REST y frontend
wiki_managed: true
---

# Gestión Alquileres SaaS

Sistema web para gestionar propiedades en alquiler. Permite registrar propietarios, inquilinos, contratos, pagos y generar reportes de ocupación y deudas.

## Stack

| Capa | Tecnología |
|------|------------|
| Orquestación | Docker Compose |
| Backend | Node.js + Express (API REST) |
| Base de datos | MySQL |
| Frontend | React |
| Proxy | Nginx |
| Deploy | VPS con Docker |

## Módulos

- **Propiedades**: CRUD de inmuebles con fotos y características
- **Contratos**: vigencia, monto, ajustes por inflación (ICL)
- **Pagos**: registro de cobros, estado de cuenta por inquilino
- **Reportes**: deudas pendientes, ocupación mensual, ingresos por período
- **Alertas**: contratos por vencer, pagos atrasados

## Variables de entorno

```env
# Base de datos
DB_HOST=db
DB_PORT=3306
DB_NAME=alquileres
DB_USER=admin
DB_PASSWORD=password_segura

# Backend
JWT_SECRET=clave_jwt_larga
NODE_ENV=production
PORT=3001

# Frontend
REACT_APP_API_URL=http://localhost/api
```

## Correr localmente

```bash
git clone git@github.com:bruno-avila21/gestion-alquileres-saas.git
cd gestion-alquileres-saas
cp .env.example .env
# Completar .env

./start.sh
# o manualmente:
docker compose up -d
```

- App: `http://localhost`
- API: `http://localhost/api`

## Comandos

```bash
# Logs
docker compose logs -f

# Correr migraciones de DB
docker compose exec backend npm run migrate

# Seed de datos de prueba
docker compose exec backend npm run seed

# Backup de la base de datos
docker compose exec db mysqldump -u admin -p alquileres > backup.sql
```

## Deploy en producción

```bash
# Clonar en el servidor
git clone git@github.com:bruno-avila21/gestion-alquileres-saas.git
cd gestion-alquileres-saas

# Configurar variables de producción
cp .env.example .env
nano .env

# Levantar
docker compose up -d --build
```

## Estructura

```
gestion-alquileres-saas/
├── backend/
│   ├── src/
│   │   ├── routes/          # propiedades, contratos, pagos
│   │   ├── controllers/
│   │   ├── models/
│   │   └── middleware/
│   ├── migrations/
│   └── package.json
├── frontend/
│   └── src/
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── start.sh
```
