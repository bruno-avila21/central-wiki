---
title: Ecommerce SaaS
description: Plataforma de e-commerce multi-tenant dockerizada con Nginx
wiki_managed: true
---

# Ecommerce SaaS

Plataforma de e-commerce dockerizada con Nginx como reverse proxy. Arquitectura multi-servicio lista para alojar tiendas online con panel de administración y API propia.

## Stack

| Capa | Tecnología |
|------|------------|
| Orquestación | Docker Compose |
| Proxy | Nginx |
| Backend API | Node.js / Express |
| Base de datos | MySQL / PostgreSQL |
| Frontend | React / Next.js |
| Deploy | VPS con Docker |

## Arquitectura

```
Internet
    │
  Nginx (puerto 80/443)
    ├── /api  → backend:3001
    └── /     → frontend:3000
```

## Variables de entorno

Crear un archivo `.env` en la raíz:

```env
# Base de datos
DB_HOST=db
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=admin
DB_PASSWORD=tu_password_segura

# Backend
NODE_ENV=production
JWT_SECRET=clave_secreta_larga_y_aleatoria
PORT=3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost/api

# Email (para notificaciones de pedidos)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu@gmail.com
SMTP_PASS=app_password_de_gmail
```

## Correr localmente

```bash
git clone git@github.com:bruno-avila21/ecommerce-saas.git
cd ecommerce-saas
cp .env.example .env
# Completar .env

docker compose up -d
```

- Frontend: `http://localhost`
- API: `http://localhost/api`
- Adminer (DB): `http://localhost:8080`

## Comandos útiles

```bash
# Ver logs en vivo
docker compose logs -f

# Reiniciar un servicio
docker compose restart backend

# Parar todo
docker compose down

# Parar y borrar volúmenes (cuidado: borra la DB)
docker compose down -v

# Reconstruir imágenes
docker compose up -d --build
```

## Deploy en producción (VPS)

```bash
# En el servidor (Ubuntu/Debian)
apt install docker.io docker-compose-plugin -y

git clone git@github.com:bruno-avila21/ecommerce-saas.git
cd ecommerce-saas
cp .env.example .env
# Editar .env con valores de producción

docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Para HTTPS: agregar Certbot + configurar Nginx con el dominio real.
