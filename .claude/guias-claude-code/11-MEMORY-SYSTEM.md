# Guia: Sistema de Memoria de Claude Code

## Que es

Claude Code tiene un sistema de **memoria persistente basado en archivos**.
Entre sesiones, Claude puede recordar cosas sobre vos, tus preferencias,
el proyecto y decisiones pasadas.

**Ubicacion:** `~/.claude/projects/{project-hash}/memory/`

La memoria se guarda en archivos `.md` con frontmatter YAML y un indice `MEMORY.md`.

---

## Por que importa

Sin memoria, cada sesion de Claude empieza de cero:
- No recuerda que sos senior dev y no necesitas explicaciones basicas
- No recuerda que preferis respuestas cortas sin emojis
- No recuerda que el deploy del jueves rompio algo
- No recuerda que te dijo "no uses any" 5 veces

**Con memoria:** Claude acumula contexto entre sesiones y mejora con el tiempo.

---

## Tipos de memoria

### 1. User (sobre vos)
```markdown
---
name: user-role
description: Rol y expertise del usuario principal
type: user
---

Senior fullstack dev, 5 anios de experiencia en .NET y React.
Prefiere respuestas directas sin explicaciones basicas.
Conoce bien el patron N-Layer y Redux Toolkit.
```

**Cuando se guarda:** Cuando Claude aprende algo sobre tu rol, experiencia o preferencias.
**Como se usa:** Para calibrar el nivel de detalle de las respuestas.

### 2. Feedback (como trabajar)
```markdown
---
name: feedback-no-summaries
description: No resumir al final de cada respuesta
type: feedback
---

No agregar resumen al final de cada respuesta, el usuario lee el diff.

**Why:** El usuario lo pidio explicitamente, las respuestas largas le molestan.
**How to apply:** Terminar con la accion, no con un parrafo de cierre.
```

**Cuando se guarda:** Cuando corriges a Claude ("no hagas esto", "si, asi esta bien").
**Como se usa:** Para no repetir los mismos errores en futuras sesiones.

### 3. Project (estado del proyecto)
```markdown
---
name: project-merge-freeze
description: Freeze de merges a partir del 2026-04-10 por release mobile
type: project
---

Merge freeze desde 2026-04-10 para release cut del equipo mobile.

**Why:** El equipo mobile corta rama de release y no quieren cambios que rompan.
**How to apply:** Alertar si se intenta mergear algo no critico despues de esa fecha.
```

**Cuando se guarda:** Decisiones de proyecto, deadlines, estados temporales.
**Como se usa:** Para contextualizar sugerencias con la realidad del proyecto.

### 4. Reference (donde buscar)
```markdown
---
name: ref-jira-project
description: Bugs del pipeline se trackean en Linear proyecto INGEST
type: reference
---

Pipeline bugs en Linear proyecto "INGEST".
Dashboard de oncall: grafana.internal/d/api-latency
Documentacion de la API: Confluence space "LOAN-API"
```

**Cuando se guarda:** Cuando descubris donde vive informacion externa.
**Como se usa:** Para saber donde buscar sin preguntar.

---

## Estructura de archivos

```
~/.claude/projects/{project-hash}/memory/
  MEMORY.md                    # Indice (siempre cargado en contexto)
  user_role.md                 # Memoria tipo user
  user_preferences.md          # Memoria tipo user
  feedback_no_summaries.md     # Memoria tipo feedback
  feedback_testing_real_db.md  # Memoria tipo feedback
  project_merge_freeze.md      # Memoria tipo project
  ref_jira_linear.md           # Memoria tipo reference
```

### MEMORY.md (indice)

```markdown
- [User Role](user_role.md) — Senior fullstack, .NET + React, respuestas directas
- [Preferences](user_preferences.md) — Sin emojis, sin resumen final, respuestas cortas
- [No summaries](feedback_no_summaries.md) — No resumir al final de cada respuesta
- [Real DB tests](feedback_testing_real_db.md) — Tests de integracion contra BD real, no mocks
- [Merge freeze](project_merge_freeze.md) — Freeze desde 2026-04-10 por release mobile
- [Jira/Linear refs](ref_jira_linear.md) — Donde trackear bugs y consultar dashboards
```

**Reglas del indice:**
- Maximo 200 lineas (se trunca despues)
- Una linea por memoria, < 150 caracteres
- Link al archivo + hook de una linea
- Sin frontmatter, sin contenido largo

### Archivo de memoria individual

```markdown
---
name: nombre-descriptivo
description: Descripcion de una linea (usada para decidir relevancia)
type: user | feedback | project | reference
---

Contenido de la memoria.

Para feedback y project, incluir:
**Why:** Razon (por que se guardo esto)
**How to apply:** Como usarlo en futuras sesiones
```

---

## Como activar y usar

### Guardar memoria manualmente
Decile a Claude: "Recorda que prefiero respuestas cortas sin resumir al final"
Claude crea el archivo y actualiza MEMORY.md.

### Consultar memoria
Decile: "Que recordas de mis preferencias?"
Claude lee MEMORY.md y los archivos relevantes.

### Olvidar algo
Decile: "Olvidate de la regla del merge freeze, ya paso"
Claude borra el archivo y la entrada del indice.

### Se guarda automaticamente cuando:
- Te corriges ("no, no hagas eso") → feedback memory
- Mencionas tu rol ("soy data scientist") → user memory
- Hablas de estado del proyecto ("el deploy del jueves rompio X") → project memory
- Mencionas recursos externos ("los bugs estan en Linear") → reference memory

---

## Que NO guardar en memoria

| No guardar | Por que |
|------------|---------|
| Patrones de codigo, arquitectura | Se leen del CLAUDE.md/AGENTS.md actual |
| Git history, commits recientes | `git log` es mas preciso |
| Fixes o soluciones a bugs | El fix esta en el codigo, el context en el commit |
| Contenido ya en CLAUDE.md | Duplicado innecesario |
| Tareas en progreso | Usar Tasks en vez de memoria |
| Planes de implementacion | Usar Plan mode en vez de memoria |

---

## Buenas practicas

### 1. Pocas memorias de alta calidad > muchas memorias vagas
```
MAL:  "El usuario trabajo en el backend hoy"
BIEN: "Senior .NET dev, prefiere async/await sobre Task.Run, respuestas en español"
```

### 2. Feedback con Why + How to apply
```
MAL:  "No usar mocks"
BIEN: "Tests de integracion contra BD real, no mocks.
       Why: Un mock escondia un bug de migracion en produccion.
       How to apply: En tests que tocan datos, usar BD SQLite en memoria."
```

### 3. Fechas absolutas, no relativas
```
MAL:  "El freeze es el jueves"
BIEN: "Merge freeze desde 2026-04-10"
```

### 4. Limpiar memorias obsoletas
Las memorias de tipo `project` caducan rapido. Revisar periodicamente
y eliminar las que ya no aplican.

### 5. No sobrecargar el indice
MEMORY.md tiene limite de 200 lineas. Priorizar memorias de alto impacto.

---

## Setup para proyecto nuevo

1. La carpeta de memoria se crea automaticamente la primera vez que Claude guarda algo
2. No necesitas crear nada manualmente
3. Las primeras sesiones, decile cosas como:
   - "Soy [tu rol], con experiencia en [X]"
   - "Prefiero respuestas [cortas/detalladas]"
   - "En este proyecto usamos [patron especifico]"
   - "Los tickets estan en [sistema]"
4. Claude va a ir construyendo tu perfil sesion a sesion
