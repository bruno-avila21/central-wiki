# Guia: Optimizacion de Consumo de Tokens

## Por que importa

Cada token cuesta dinero y contexto. Claude Code tiene una ventana de contexto
limitada (~200K tokens en la mayoria de los modelos). Si la llenas con basura
(node_modules, instrucciones repetidas, archivos enormes), queda menos espacio
para el codigo que realmente importa.

**Objetivo:** Maximizar la relacion signal/noise en cada sesion.

---

## 1. .claudeignore (ya cubierto en 08-CLAUDEIGNORE.md)

**Ahorro estimado:** 30-50K tokens por sesion.

---

## 2. Skills: no re-leer, centralizar con mini-resumen

### El problema

Cada vez que un command invoca un skill, Claude lee el SKILL.md completo.
Si tenes 14 skills con un promedio de 500 lineas, y en una sesion se invocan 3:

```
3 skills x 500 lineas x ~4 tokens/linea = 6,000 tokens
```

Peor aun: si las skills tienen secciones duplicadas (validacion de repo, encoding,
severity tables), esas lineas se leen multiples veces.

### La solucion: indice de skills con mini-resumen

Crear un archivo `.claude/skills/SKILLS-INDEX.md` que Claude lea UNA sola vez
al inicio. Contiene un mini-resumen de cada skill para que sepa cual invocar
sin tener que leer todos:

```markdown
# Skills Index

Indice de skills disponibles. Leer el SKILL.md completo SOLO cuando se vaya a ejecutar.

| Skill | Archivo | Que hace (1 linea) | Parametros |
|-------|---------|---------------------|------------|
| code-review | skills/code-review/SKILL.md | Code review de PR con checklist de 10 items | PR number |
| code-review-batch | skills/code-review-batch/SKILL.md | Review paralelo de multiples PRs/tickets | Lista de tickets |
| analisis-tecnico | skills/analisis-tecnico/SKILL.md | Investiga ticket Jira, clasifica y genera informe AT | Ticket ID |
| desarrollo | skills/desarrollo/SKILL.md | Orquesta dev fullstack (backend+frontend) | Doc/Figma/texto |
| empaquetado-version | skills/empaquetado-version/SKILL.md | Compila, comprime y sube version a SFTP | Interactivo |
| merge-pr | skills/merge-pr/SKILL.md | Mergea PR resolviendo conflictos | PR number |
| merge-conflicts | skills/merge-conflicts/SKILL.md | Resuelve conflictos de merge inteligentemente | Branch |
| testing-unitario | skills/testing-unitario/SKILL.md | Genera tests unitarios NUnit/Vitest | Modulo |
| testing-integracion | skills/testing-integracion/SKILL.md | Genera tests de integracion HTTP | Endpoint |
| scripts-bd | skills/scripts-bd/SKILL.md | Genera scripts SQL con nomenclatura | Tabla/operacion |
| excepciones | skills/excepciones/SKILL.md | Crea jerarquia de excepciones .NET | Dominio |
| vbnet | skills/vbnet/SKILL.md | Patrones de codigo VB.NET legacy | — |
| postman-collection | skills/postman-collection/SKILL.md | Genera colecciones Postman desde API | Clase API |
| jira-notainterna | skills/jira-notainterna/SKILL.md | Publica nota interna en Jira | Ticket + texto |
```

### Como referenciarlo

En CLAUDE.md agregar:
```markdown
## Skills disponibles
Ver `.claude/skills/SKILLS-INDEX.md` para el indice de skills.
Leer el SKILL.md completo SOLO al momento de ejecutar el skill.
```

---

## 3. Extraer secciones compartidas (DRY para skills)

### El problema detectado en tu proyecto

| Seccion duplicada | Aparece en | Lineas desperdiciadas |
|-------------------|------------|----------------------|
| Validacion de repositorio (PASO 0) | code-review, code-review-batch, merge-pr, merge-conflicts | ~80 lineas x 4 = 320 |
| Reglas de encoding | code-review, code-review-batch | ~50 lineas x 2 = 100 |
| Tablas de severidad | 5+ skills | ~15 lineas x 5 = 75 |
| "NUNCA asumas repo" warning | 4 skills | ~10 lineas x 4 = 40 |
| **Total duplicado** | | **~535 lineas** (~2,100 tokens) |

### La solucion: archivo de secciones compartidas

Crear `.claude/skills/_shared/` con fragmentos reutilizables:

```
.claude/skills/
  _shared/
    validacion-repo.md          # PASO 0 comun de validacion de repo
    reglas-encoding.md          # Reglas de encoding de archivos
    severidad.md                # Tabla de severidades
    reglas-jira.md              # Como publicar en Jira
  code-review/
    SKILL.md                    # Referencia: "Ver _shared/validacion-repo.md"
  merge-pr/
    SKILL.md                    # Referencia: "Ver _shared/validacion-repo.md"
```

En cada SKILL.md, reemplazar la seccion duplicada por:

```markdown
## PASO 0: Validacion de Repositorio

Seguir las instrucciones de `.claude/skills/_shared/validacion-repo.md`
```

**Ahorro:** Claude lee la seccion compartida 1 vez en lugar de N veces.

---

## 4. AGENTS.md: mantener conciso, separar lo extenso

### El problema

Tu `LoanEcommerceFront/AGENTS.md` tiene 5,600+ lineas.
Cuando Claude lo carga, consume ~22,000 tokens solo en ese archivo.
Muchas secciones solo son relevantes para tareas especificas.

### La solucion: AGENTS.md core + archivos satelite

```
LoanEcommerceFront/
  AGENTS.md                    # Core: 150-200 lineas
  AGENTS-componentes.md        # Detalle de patrones de componentes
  AGENTS-redux.md              # Detalle de Redux/state
  AGENTS-tenant.md             # Sistema multi-tenant completo
  AGENTS-testing.md            # Patrones de testing
  AGENTS-css.md                # Sistema de CSS variables
```

**AGENTS.md core** contiene:
1. Rol y stack (5 lineas)
2. Estructura de carpetas (15 lineas)
3. Reglas criticas TOP 10 (30 lineas)
4. Naming conventions tabla (20 lineas)
5. Indice de archivos satelite (10 lineas)
6. Forbidden patterns (20 lineas)
7. Checklist "Al Finalizar" (10 lineas)

**Total: ~110 lineas** vs 5,600. Ahorro: **95% de tokens**.

Los agentes leen el core siempre, y los satelites solo cuando la tarea lo requiere:
- Creando componente? Lee AGENTS-componentes.md
- Tocando Redux? Lee AGENTS-redux.md
- Configurando tenant? Lee AGENTS-tenant.md

---

## 5. CLAUDE.md: no duplicar lo que esta en AGENTS.md

### Principio

CLAUDE.md = **mapa de alto nivel** (que existe, donde, reglas globales)
AGENTS.md = **manual detallado** (como escribir codigo en esa app)

Si algo esta en AGENTS.md, no repetirlo en CLAUDE.md. Solo referenciar:

```markdown
## Per-App Standards
- `LoanEcommerce/AGENTS.md` — Backend patterns (.NET 8, C#)
- `LoanEcommerceFront/AGENTS.md` — Frontend patterns (React, TS)
```

---

## 6. Agentes: no copiar, referenciar

### Mal (duplica contenido del AGENTS.md en el agente)
```markdown
# Agente Backend

## Naming Conventions
- Metodos en español PascalCase: ObtenerCliente
- Interfaces: IObtenerCliente
- Privadas: prefijo i
- Parametros: prefijo e
[... 50 lineas copiadas del AGENTS.md ...]
```

### Bien (referencia)
```markdown
# Agente Backend

## Instrucciones
1. **Leer documentacion:** `LoanEcommerce/AGENTS.md`
2. Seguir todos los patrones y naming de ese archivo.
```

**Ahorro:** 50-200 lineas por agente que no se duplican.

---

## 7. Commands: mantener minimos

Un command deberia ser 20-60 lineas maximo. La logica va en el skill.

### Mal (command de 200 lineas con toda la logica)
```markdown
# Code Review

## Paso 1: Obtener PR
[... 30 lineas de instrucciones ...]

## Paso 2: Leer archivos
[... 40 lineas ...]

## Paso 3: Checklist
[... 80 lineas ...]
```

### Bien (command minimo que apunta al skill)
```markdown
# Code Review

Code review de un PR.

## Parametros
- Numero de PR (ej: 991)

## Ejecucion
Skill: code-review
```

---

## 8. Lectura selectiva de archivos

### Instruccion clave para skills y agentes

Agregar esta regla en los skills que leen mucho codigo:

```markdown
## Regla de lectura minima

- Leer SOLO las funciones/metodos afectados, NO archivos completos
- Usar Read con offset+limit para leer rangos especificos
- Usar Grep para encontrar la linea exacta antes de leer
- Si un archivo tiene 500+ lineas, NUNCA leer completo
```

Tu skill de code-review ya hace esto bien:
> "Optimizado para minimo consumo de tokens: solo lee las funciones afectadas, no archivos completos."

Replicar este patron en TODOS los skills.

---

## 9. Respuestas minimas cuando todo esta OK

Agregar en cada skill que genera output:

```markdown
## REGLA DE RESPUESTA MINIMA

> Si el resultado es positivo y no hay hallazgos: respuesta MINIMA.
> NO explicar cada paso. NO describir que hace cada archivo.
> Solo: tabla resumen + resultado.
```

Tu code-review ya lo tiene. Falta en: testing, desarrollo, merge-pr.

**Ahorro:** Un code review "todo OK" pasa de 500 tokens a 50 tokens de output.

---

## 10. Resumen de ahorros estimados

| Optimizacion | Tokens ahorrados por sesion | Esfuerzo |
|-------------|----------------------------|----------|
| .claudeignore | 30,000-50,000 | 5 min |
| Skills index (no re-leer) | 3,000-6,000 | 15 min |
| DRY secciones compartidas | 2,000-4,000 | 30 min |
| AGENTS.md core + satelites | 15,000-20,000 | 1 hora |
| No duplicar en CLAUDE.md | 1,000-2,000 | 10 min |
| Agentes referencian, no copian | 1,000-3,000 | 15 min |
| Commands minimos | 500-1,000 | 10 min |
| Lectura selectiva | 5,000-10,000 | 15 min |
| Respuestas minimas | 1,000-3,000 | 10 min |
| **TOTAL** | **58,500-99,000** | **~2.5 horas** |

Con estas optimizaciones, cada sesion consume **~60-100K tokens menos**.
En 20 sesiones semanales: **1.2M-2M tokens/semana ahorrados**.

---

## Checklist rapido para proyecto nuevo

- [ ] Crear `.claudeignore` con node_modules, .git, bin, obj, dist, imagenes
- [ ] CLAUDE.md < 150 lineas (mapa general, no manual)
- [ ] AGENTS.md core < 200 lineas (separar satelites si crece)
- [ ] Skills con `SKILLS-INDEX.md` en el indice
- [ ] Secciones compartidas en `_shared/`
- [ ] Agentes referencian AGENTS.md, no copian
- [ ] Commands < 60 lineas, logica en skills
- [ ] Regla "lectura minima" en skills que leen codigo
- [ ] Regla "respuesta minima" en skills que generan output
- [ ] settings.json con permisos auto-aprobados para tools de lectura
