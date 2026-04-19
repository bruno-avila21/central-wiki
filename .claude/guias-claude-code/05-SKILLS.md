# Guia: Como crear Skills (.claude/skills/)

## Que son

Los skills son **workflows detallados paso a paso** que definen COMO ejecutar una tarea.
Son el "cerebro" detras de los commands: contienen toda la logica, reglas, templates
de output, integraciones y flujos de decision.

**Ubicacion:** `.claude/skills/{nombre}/SKILL.md`

Cada skill tiene su propia carpeta porque puede incluir archivos adicionales
(plantillas, ejemplos, schemas).

```
.claude/skills/
  code-review/
    SKILL.md               <-- Logica principal
  testing/
    SKILL.md               <-- Logica principal
    plantillas/            <-- Archivos auxiliares
      PLANTILLA_CRUD.md
      PLANTILLA_API.md
  desarrollo/
    SKILL.md
```

---

## Anatomia de un Skill

### Frontmatter (cabecera YAML)

```yaml
---
name: nombre-skill
description: >
  Descripcion detallada de que hace este skill.
  Trigger: Cuando se invoca y en que contexto.
metadata:
  author: nombre-equipo
  version: "1.0"
  scope: [proyecto1, proyecto2]
  auto_invoke:
    - "Frase que activa este skill"
    - "Otra frase trigger"
---
```

**Campos del frontmatter:**

| Campo | Obligatorio | Descripcion |
|-------|-------------|-------------|
| `name` | Si | Identificador unico (kebab-case) |
| `description` | Si | Que hace + cuando se invoca (trigger) |
| `metadata.author` | No | Equipo o persona que lo creo |
| `metadata.version` | No | Version del skill |
| `metadata.scope` | No | En que proyectos aplica |
| `metadata.auto_invoke` | No | Frases que activan el skill automaticamente |

### Cuerpo del Skill

```markdown
# Skill: [Nombre Descriptivo]

[Descripcion de que hace y contexto]

---

## Resumen del Flujo (N pasos)
\```
PASO 0: [nombre] -> [descripcion corta]
PASO 1: [nombre] -> [descripcion corta]
...
PASO N: [nombre] -> [descripcion corta]
\```

---

## PASO 0: [Nombre] (OBLIGATORIO)
[Instrucciones detalladas]

## PASO 1: [Nombre]
[Instrucciones detalladas]

...

## Formato de Output
\```markdown
[Template exacto del output esperado]
\```

---

## Integraciones utilizadas
- **[Sistema]**: [como se usa]
- **[Sistema]**: [como se usa]

---

## Reglas Criticas
[Reglas que NO se pueden violar]
```

---

## Principios para escribir un buen Skill

### 1. Flujo paso a paso numerado
El resumen del flujo al inicio es clave. Claude lo usa como checklist mental:

```
PASO 0: Crear tasks de tracking      -> TaskCreate por cada item
PASO 1: Obtener el PR               -> Gitea API
PASO 2: Leer archivos modificados   -> Solo funciones afectadas
PASO 3: Verificar checklist         -> 10 items en paralelo
PASO 4: Publicar resultado          -> Jira nota interna
```

### 2. Templates de output exactos
Definir **exactamente** como debe verse el resultado:

```markdown
## Formato del informe

\```markdown
# Code Review - [TICKET]

**Archivos:** [lista]
**Resultado:** Aprobado | Rechazado | Con observaciones

| Item | Estado |
|------|--------|
| Naming | OK / ISSUE |
| Arquitectura | OK / ISSUE |
...

## Observaciones (solo si hay)
[Detalle de cada hallazgo]

---
**Veredicto:** [resultado]
\```
```

### 3. Regla de respuesta minima
Si todo esta OK, respuesta minima. Solo detallar cuando hay hallazgos.
Esto ahorra tokens y tiempo:

```markdown
## REGLA CRITICA DE RESPUESTA

> Si el resultado es positivo y no hay hallazgos: respuesta MINIMA.
> NO explicar cada paso. Solo: resumen + resultado.
```

### 4. Integraciones documentadas
Listar que sistemas externos usa el skill y como:

```markdown
## Integraciones
- **Jira** (cloudId: xxx): lectura de ticket y publicacion de nota interna
- **Gitea** (owner: swf, repo: loan): lectura de PRs y archivos
- **Repo local** (ruta: D:\proyecto): lectura de codigo via Glob/Grep/Read
```

### 5. Clasificaciones y tablas de decision
Si el skill debe clasificar algo, dar una tabla clara:

```markdown
| Tipo | Cuando aplica |
|------|---------------|
| BUG_CODIGO | Mensajes de error, stacktrace |
| CONSULTA | Preguntas sin error confirmado |
| MEJORA | Nuevo requerimiento |
| SCRIPT | Corregir dato puntual en BD |
```

### 6. Plantillas auxiliares
Si el skill genera diferentes tipos de output, poner plantillas en subcarpetas:

```
skills/testing/
  SKILL.md
  plantillas/
    PLANTILLA_CRUD.md          # Tests para operaciones CRUD
    PLANTILLA_API.md           # Tests para integracion de APIs
    PLANTILLA_CALCULO.md       # Tests para logica de calculo
```

---

## Skill completo de ejemplo

```markdown
---
name: generar-tests
description: >
  Genera tests unitarios o de integracion para un modulo.
  Trigger: Al pedir tests, generar tests, o testear codigo.
metadata:
  author: mi-equipo
  version: "1.0"
  scope: [mi-proyecto]
  auto_invoke:
    - "Generar tests"
    - "Crear tests unitarios"
    - "Testear modulo"
---

# Skill: Generar Tests

Genera tests para el modulo indicado, eligiendo la plantilla correcta
segun el tipo de codigo (CRUD, API, calculo, flujo de negocio).

---

## Resumen del Flujo

\```
PASO 0: Analizar codigo target        -> Leer archivos, identificar tipo
PASO 1: Seleccionar plantilla         -> CRUD / API / Calculo / Negocio
PASO 2: Generar tests                 -> Seguir plantilla seleccionada
PASO 3: Ejecutar tests                -> npm test / dotnet test
PASO 4: Corregir si fallan            -> Max 3 iteraciones
PASO 5: Reportar resultado            -> Tests OK/FAIL + coverage
\```

---

## PASO 0: Analizar codigo target

Leer los archivos del modulo a testear. Identificar:
- Funciones publicas (a testear)
- Dependencias externas (a mockear)
- Tipo de codigo:

| Tipo | Indicadores |
|------|-------------|
| CRUD | create/read/update/delete, prisma/repository calls |
| API | HTTP calls, fetch/axios, request/response |
| Calculo | math operations, business rules, transformations |
| Negocio | multi-step workflows, state machines |

## PASO 1: Seleccionar plantilla

Usar la plantilla de `.claude/skills/generar-tests/plantillas/`:
- `PLANTILLA_CRUD.md` para operaciones de datos
- `PLANTILLA_API.md` para integraciones HTTP
- `PLANTILLA_CALCULO.md` para logica pura
- `PLANTILLA_NEGOCIO.md` para flujos complejos

## PASO 2: Generar tests

Seguir la estructura de la plantilla. Cada test debe:
- Nombre descriptivo: `should_[accion]_when_[condicion]`
- Arrange / Act / Assert claro
- Un assertion por test (idealmente)
- Mockear dependencias externas

## PASO 3: Ejecutar

\```bash
npm run test -- --run [archivo]
\```

## PASO 4: Corregir

Si fallan: analizar error, corregir test (no el codigo fuente), re-ejecutar.
**Maximo 3 iteraciones.** Si no pasa, reportar como FAIL.

## PASO 5: Reportar

\```markdown
## Tests Generados - [modulo]

| Test | Resultado |
|------|-----------|
| should_create_when_valid_input | PASS |
| should_fail_when_missing_field | PASS |
...

**Total:** X tests, Y passed, Z failed
**Coverage:** XX%
\```

---

## Reglas
1. No modificar codigo fuente para hacer pasar tests
2. Mockear TODAS las dependencias externas (BD, APIs, filesystem)
3. Maximo 3 iteraciones de correccion
4. Nombres de test en ingles con formato should_X_when_Y
```

---

## Diferencia entre Skill invocable por usuario y Skill interno

### Skill invocable por usuario
Se lista en el sistema como disponible. El usuario lo puede llamar con `/nombre`.
Necesita `auto_invoke` en el frontmatter para matching automatico.

### Skill interno (solo usado por commands/agents)
No se lista al usuario. Solo es llamado por un command o agente.
No necesita `auto_invoke`.

Ambos tienen la misma estructura. La diferencia es si aparecen en la
lista de skills disponibles.

---

## Errores comunes

| Error | Solucion |
|-------|----------|
| Skill sin pasos numerados | Claude no sabe el orden de ejecucion |
| No definir template de output | Output inconsistente entre ejecuciones |
| No limitar iteraciones | Loops infinitos de correccion |
| Logica demasiado simple para un skill | Ponerla directo en el command |
| No documentar integraciones | Claude no sabe que tools/APIs usar |
| Plantillas sin ejemplo concreto | Claude improvisa la estructura |
| auto_invoke demasiado generico | Se activa cuando no deberia |
