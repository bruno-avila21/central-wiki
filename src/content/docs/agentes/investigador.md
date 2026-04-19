---
title: Investigador
description: Agente Claude Code para investigación profunda y análisis de información
wiki_managed: true
---

# Investigador

Agente de IA construido sobre Claude Code que automatiza investigaciones: analiza fuentes, sintetiza información y produce reportes estructurados. Ideal para research de mercado, análisis de competidores, documentación técnica y due diligence.

## Qué hace

- Investiga un tema usando búsqueda web + lectura de URLs
- Sintetiza múltiples fuentes en un reporte coherente
- Detecta contradicciones entre fuentes y las señala
- Genera reportes en Markdown con secciones, citas y conclusiones
- Puede iterar sobre preguntas de seguimiento

## Cómo usarlo

```bash
# Desde Claude Code
/investigar "¿Qué frameworks de agentes IA existen en 2025?"

# Como script directo
node investigador.js --tema "frameworks agentes IA 2025" --profundidad alta
```

### Parámetros

| Parámetro | Descripción | Default |
|-----------|-------------|---------|
| `--tema` | Pregunta o tema a investigar | requerido |
| `--profundidad` | `baja`, `media`, `alta` | `media` |
| `--formato` | `markdown`, `json`, `txt` | `markdown` |
| `--out` | Archivo de salida | stdout |

## Variables de entorno

```env
ANTHROPIC_API_KEY=sk-ant-...
```

## Setup

```bash
git clone git@github.com:bruno-avila21/Investigador.git
cd Investigador
npm install
cp .env.example .env
# Agregar ANTHROPIC_API_KEY en .env
```

## Ejemplo de salida

```markdown
# Investigación: Frameworks de agentes IA en 2025

## Resumen ejecutivo
...

## Hallazgos principales
### LangChain / LangGraph
...

### AutoGen (Microsoft)
...

## Comparativa
| Framework | Lenguaje | Multiagente | Última versión |
|-----------|----------|-------------|----------------|
...

## Conclusiones
...

## Fuentes
1. https://...
2. https://...
```

## Cómo funciona internamente

```
Input del usuario
      │
  Planificador  ← descompone el tema en subtemas
      │
  Buscador      ← WebSearch por subtema
      │
  Lector        ← WebFetch de URLs relevantes
      │
  Sintetizador  ← Claude analiza y une todo
      │
  Formateador   ← produce el reporte final
```
