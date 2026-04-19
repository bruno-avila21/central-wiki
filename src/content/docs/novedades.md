---
title: Qué hay de nuevo
description: Registro de novedades y actualizaciones del ecosistema de proyectos
wiki_managed: true
---

# Qué hay de nuevo

Registro cronológico de lo más relevante que se fue sumando al ecosistema.

---

## Abril 2026

### Wiki — Rediseño UI Deep Space
Nuevo tema visual completo: paleta **Deep Space** (fondo casi negro + violeta `#7c3aed`), estilo Minimal Sharp (sin glass effects, tipografía dominante) y animaciones Emil Kowalski (`slideInLeft` + `fadeUpIn` con spring easing). Soporte completo de light mode con variante violeta profesional.

### Wiki — Sweep de documentación
Revisión y corrección de todas las páginas del wiki contra el código fuente real: **invitation-builder** (React 19, Supabase, MercadoPago, Vercel Functions), **simulador-credito** (widget IIFE/ESM dual-build, Vite library mode), **discord-bot** (comandos corregidos, tareas programadas), **AgentSync** (soporte QA y AF).

### claude-agents — Perfiles QA y AF documentados
Se agregaron al wiki los 5 agentes de AF (Análisis Funcional) y 5 agentes de QA con sus respectivas skills y comandos.

### Wiki centralizada en GitHub Pages
Se creó este portal de documentación usando **Astro Starlight** con sincronización automática desde los READMEs de cada proyecto via GitHub Actions. Todos los repos tienen un workflow `notify-wiki.yml` que dispara el sync cuando cambia el README.

### AgentSync — Catálogo de MCPs
Nueva pestaña en la app que lista todos los MCPs declarados en el repo de prompts. Cada MCP muestra estado instalado/no instalado/actualizable, versión actual vs. disponible, y permite instalar, reinstalar o actualizar con un clic.

### AgentSync — Variables de entorno por MCP
Las tarjetas del catálogo ahora tienen una sección colapsable para configurar las variables de entorno requeridas por cada MCP, directamente desde la UI.

### AgentSync — Soporte multi-área
Se extendió la funcionalidad para los equipos de QA y Administración y Finanzas (AF).

---

## Proyectos activos

| Proyecto | Última actividad | Estado |
|----------|-----------------|--------|
| AgentSync | Abril 2026 | Activo |
| claude-agents | Abril 2026 | Activo |
| stock-product | 2025 | Mantenimiento |
| bingo-quiniela | 2025 | Estable |
| invitaciones | 2025 | Estable |
| discord-bot | 2025 | Estable |
| ecommerce-saas | 2025 | Estable |
| gestion-alquileres-saas | 2025 | Estable |
| simulador-credito | 2025 | Estable |
| Investigador | 2025 | Estable |
