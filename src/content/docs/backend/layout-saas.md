---
title: Layout SaaS
description: SaaS para gestionar y publicar sitios web de clientes a partir de templates parametrizables — Express + React + Railway
---

# Layout SaaS

SaaS para gestionar y publicar sitios web de clientes a partir de templates parametrizables.

## Apps

| App | Puerto | Descripción |
|-----|--------|-------------|
| `backend` | 3001 | Express + PostgreSQL |
| `frontend` | 5173 | Admin panel React |
| `layouts/gym-industrial` | 3000 | Template gym dark |

## Stack

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: React, Vite
- **Deploy**: Railway — 4 servicios: PostgreSQL plugin + backend + frontend + layouts
- **Assets**: Cloudinary

## Setup local

```bash
cp backend/.env.example backend/.env
# Completar DATABASE_URL, JWT_SECRET, CLOUDINARY_URL

cd backend && npm install && npm run migrate && npm run dev
cd frontend && npm install && npm run dev
cd layouts/gym-industrial && npm install && npm run dev
```

## Variables de entorno

```env
DATABASE_URL=       # PostgreSQL connection string
JWT_SECRET=         # Secret para JWT
CLOUDINARY_URL=     # URL de Cloudinary para assets
```

## Deploy

Railway — automático con push. 4 servicios configurados: PostgreSQL plugin, backend API, frontend admin panel, y el template de layouts.
