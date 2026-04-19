---
title: Stock Product
description: Sistema de gestión de inventario con trazabilidad de precios y análisis de ganancias
wiki_managed: true
---

# Stock Product - Sistema de Gestión de Inventario

Sistema de gestión de inventario con trazabilidad histórica de precios, comparativa de proveedores y análisis de ganancias.

## 🚀 Características

- **CRUD de Productos**: Gestión completa con nombre, marca, stock y categoría
- **Cálculo de Margen**: Precio de venta automático basado en % de ganancia
- **Desglose por Pack**: Cálculo de costo y precio unitario para productos en pack
- **Historial de Precios**: Registro automático de cambios con comparativas
- **Comparativa de Proveedores**: Análisis de precios por proveedor
- **Alertas de Stock**: Notificaciones de productos con stock bajo
- **Reportes**: Gráficas de ventas y análisis de rentabilidad

## 📦 Tecnologías

| Componente | Tecnología |
|------------|------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Base de Datos | SQLite (better-sqlite3) |
| Gráficas | Recharts |
| Íconos | Lucide React |

## 🚀 Inicio Rápido (Windows)
¡La forma más fácil de correr el proyecto!

1.  Busca el archivo **`iniciar_proyecto.bat`** en la carpeta principal.
2.  Dale doble clic.
3.  Se abrirán dos ventanas negras (terminales) y el proyecto estará listo.

---

## 🛠️ Instalación Manual
Si prefieres hacerlo paso a paso:

### Requisitos previos
- Node.js 18+
- npm o yarn

### Backend

```bash
cd backend
npm install
npm run dev
```

El servidor iniciará en `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación iniciará en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
stock-product/
├── backend/
│   ├── database/
│   │   ├── esquema.sql
│   │   └── inventario.db
│   ├── src/
│   │   ├── config/
│   │   │   └── baseDatos.js
│   │   ├── controladores/
│   │   │   ├── productosControlador.js
│   │   │   ├── historialControlador.js
│   │   │   ├── ventasControlador.js
│   │   │   ├── proveedoresControlador.js
│   │   │   └── categoriasControlador.js
│   │   ├── rutas/
│   │   │   ├── productosRutas.js
│   │   │   ├── historialRutas.js
│   │   │   ├── ventasRutas.js
│   │   │   ├── proveedoresRutas.js
│   │   │   └── categoriasRutas.js
│   │   ├── servicios/
│   │   │   └── servicioPrecios.js
│   │   └── app.js
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── componentes/
    │   │   ├── Layout/
    │   │   ├── Productos/
    │   │   ├── Historial/
    │   │   └── UI/
    │   ├── paginas/
    │   │   ├── Dashboard.jsx
    │   │   ├── Productos.jsx
    │   │   ├── Ventas.jsx
    │   │   ├── Proveedores.jsx
    │   │   └── Reportes.jsx
    │   ├── servicios/
    │   │   └── api.js
    │   ├── utils/
    │   │   └── calculosPrecios.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## 🔌 API Endpoints

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Listar productos |
| GET | `/api/productos/:id` | Obtener producto |
| POST | `/api/productos` | Crear producto |
| PUT | `/api/productos/:id` | Actualizar producto |
| DELETE | `/api/productos/:id` | Eliminar producto |
| POST | `/api/productos/actualizar-precio` | Actualizar precio (con historial) |
| GET | `/api/productos/stock-bajo` | Productos con stock bajo |

### Historial
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/historial/:productoId` | Historial de un producto |
| GET | `/api/historial/:productoId/comparativa` | Comparativa última compra |
| GET | `/api/historial/:productoId/estadisticas` | Estadísticas completas |

### Ventas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/ventas` | Listar ventas |
| POST | `/api/ventas` | Registrar venta |
| GET | `/api/ventas/resumen` | Resumen por período |

### Proveedores
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/proveedores` | Listar proveedores |
| POST | `/api/proveedores` | Crear proveedor |
| PUT | `/api/proveedores/:id` | Actualizar proveedor |
| DELETE | `/api/proveedores/:id` | Eliminar proveedor |
| GET | `/api/proveedores/:id/estadisticas` | Estadísticas del proveedor |

### Categorías
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categorias` | Listar categorías |
| POST | `/api/categorias` | Crear categoría |
| PUT | `/api/categorias/:id` | Actualizar categoría |
| DELETE | `/api/categorias/:id` | Eliminar categoría |

## 📊 Base de Datos

### Tablas principales

- **productos**: Información actual de productos
- **historial_precios**: Registro histórico de precios de compra
- **ventas**: Registro de ventas realizadas
- **proveedores**: Datos de proveedores
- **categorias**: Categorías de productos

## 🎨 Convenciones de Código

- **Variables internas**: Prefijo `i` (ej: `iProducto`, `iCargando`)
- **Variables externas/props**: Prefijo `e` (ej: `eProducto`, `eGuardar`)
- **Funciones async**: Sufijo `Async` (ej: `cargarDatosAsync`, `obtenerProductosAsync`)
- **Idioma**: Español para nombres de funciones y variables

## 📝 Licencia

MIT
