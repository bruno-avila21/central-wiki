---
title: Simulador de Crédito
description: API REST + demo web para simulación de cuotas y condiciones de créditos
wiki_managed: true
---

# Simulador de Crédito

Herramienta para calcular cuotas, intereses y condiciones de créditos en pesos argentinos. Incluye API REST para integraciones y una demo web estática para uso directo.

## Stack

| Capa | Tecnología |
|------|------------|
| API | Node.js + Express |
| Demo web | HTML + CSS + JS vanilla |
| Cálculos | Sistema francés / alemán / americano |
| Deploy | Railway / Render / VPS |

## Qué calcula

- Cuota fija (sistema francés)
- Amortización variable (sistema alemán)
- Interés al vencimiento (sistema americano)
- TNA → TEM → CFT
- Tabla de amortización mes a mes
- Comparativa entre sistemas

## API Endpoints

### `POST /api/simular`

```json
{
  "monto": 500000,
  "tna": 95,
  "plazo": 12,
  "sistema": "frances"
}
```

Respuesta:

```json
{
  "cuota": 68432.50,
  "totalIntereses": 321190,
  "totalPagar": 821190,
  "cft": 142.3,
  "tabla": [
    { "mes": 1, "cuota": 68432.50, "capital": 27682.50, "interes": 40750, "saldo": 472317.50 },
    ...
  ]
}
```

### `GET /api/tasas`

Devuelve las tasas de referencia actuales (Badlar, UVA, etc.).

## Correr localmente

```bash
git clone git@github.com:bruno-avila21/simulador-credito.git
cd simulador-credito

# API
cd api
npm install
npm run dev   # http://localhost:3001

# Demo web (en otra terminal)
cd demo
npx serve .   # http://localhost:3000
```

## Variables de entorno

```env
PORT=3001
NODE_ENV=development

# Opcional: si fetchás tasas de una fuente externa
TASAS_API_URL=https://api.bcra.gob.ar
TASAS_API_KEY=tu_api_key
```

## Deploy

```bash
# Railway (recomendado)
# 1. Conectar repo en railway.app
# 2. Setear variables de entorno en el dashboard
# 3. Deploy automático en cada push a main

# Manual en VPS
cd api
npm install --production
PORT=3001 node src/index.js

# Con PM2
pm2 start src/index.js --name simulador-credito -e PORT=3001
```

## Estructura

```
simulador-credito/
├── api/
│   ├── src/
│   │   ├── routes/
│   │   │   └── simular.js     # endpoint principal
│   │   ├── services/
│   │   │   ├── frances.js     # cálculo sistema francés
│   │   │   ├── aleman.js      # cálculo sistema alemán
│   │   │   └── americano.js
│   │   └── index.js
│   └── package.json
└── demo/
    ├── index.html
    ├── style.css
    └── app.js
```
