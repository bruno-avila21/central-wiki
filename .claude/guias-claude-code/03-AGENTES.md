# Guia: Como crear Agentes (.claude/agents/)

## Que son

Los agentes son **subagentes especializados** que Claude Code puede lanzar para ejecutar
tareas concretas. Cada agente tiene un rol, un modelo asignado, y un set de instrucciones
que define exactamente como debe trabajar.

**Ubicacion:** `.claude/agents/{nombre}.md`

Los agentes se invocan de dos formas:
1. **Por el orquestador:** Un agente principal delega trabajo a subagentes
2. **Directo por el usuario:** Con `@agente-nombre` en el chat o cuando Claude decide que necesita uno

---

## Anatomia de un agente

```markdown
---
name: nombre-del-agente
description: >
  Descripcion de una a tres lineas que explica que hace este agente,
  en que contexto se usa y que tipo de tareas resuelve.
model: sonnet | opus | haiku
---

# Agente: [Nombre Descriptivo]

[Rol en segunda persona: "Implementas...", "Compilas...", "Revisas..."]

## Instrucciones

1. **Leer documentacion:**
   \```
   [ruta/AGENTS.md]
   \```

2. **Parametros que recibe:**
   - [Parametro 1]: descripcion
   - [Parametro 2]: descripcion

---

## Artefactos a Generar (en orden)

### 1. [Artefacto]
Ubicacion: `ruta/`
\```[lang]
[template de codigo]
\```

### 2. [Artefacto]
...

---

## Reglas Criticas

1. **NUNCA [cosa]** -- razon
2. **SIEMPRE [cosa]** -- razon

## Al Finalizar

Reportar:
- Archivos creados/modificados
- [Metricas relevantes]
```

---

## Frontmatter (cabecera YAML)

El frontmatter es **obligatorio** y define metadata del agente:

```yaml
---
name: agente-backend          # Identificador unico (kebab-case)
description: >                # Descripcion (usado para matching automatico)
  Implementa backend .NET 8 C# para Ecommerce: interfaces, servicios,
  DTOs, controllers y configuracion.
model: sonnet                 # Modelo a usar: opus | sonnet | haiku
---
```

### Que modelo elegir

| Modelo | Cuando usarlo | Costo |
|--------|---------------|-------|
| **opus** | Orquestadores, tareas complejas que requieren razonamiento profundo, planificacion | Alto |
| **sonnet** | Implementacion de codigo, compilacion, tareas bien definidas | Medio |
| **haiku** | Tareas simples, busquedas, validaciones rapidas | Bajo |

**Regla practica:** El orquestador en `opus`, los ejecutores en `sonnet`.

---

## Tipos de agentes (patrones comunes)

### 1. Orquestador
Coordina multiples subagentes. No escribe codigo directamente.

```markdown
---
name: orquestador
description: Coordina el desarrollo completo de funcionalidades
model: opus
---

# Agente Orquestador

## Fase 1: Analisis
- Que apps se tocan
- Que artefactos generar

## Fase 2: Plan (OBLIGATORIO antes de codigo)
- Listar artefactos por app
- Definir orden de ejecucion

## Fase 3: Ejecucion con Subagentes
### Oleada 1: Backend
Lanzar `agente-backend` con: [parametros]

### Oleada 2: Frontend (PARALELO)
Lanzar `agente-frontend` con: [parametros]

### Oleada 3: Compilacion
Lanzar `agente-compilacion`

## Fase 4: Validacion Final
- [ ] Backend compila
- [ ] Frontend compila
- [ ] Lint sin warnings
```

**Clave del orquestador:**
- Define **oleadas** (waves) para controlar la secuencia
- Backend siempre antes que frontend (el frontend necesita los endpoints)
- Frontends en **paralelo** si son independientes
- Compilacion al final como validacion

### 2. Ejecutor de Implementacion
Escribe codigo en una app/stack especifico.

```markdown
---
name: agente-backend
description: Implementa backend [stack]
model: sonnet
---

# Agente: Backend

## Instrucciones
1. Leer documentacion: `app/AGENTS.md`
2. Parametros del orquestador: [lista]

## Artefactos a Generar (en orden)
### 1. Interface
### 2. DTOs
### 3. Service (implementacion)
### 4. Configuracion
### 5. Controller/Route

## Reglas Criticas
[Lista de MUST/NEVER]

## Al Finalizar
Reportar: [que reportar]
```

**Clave del ejecutor:**
- Siempre empieza leyendo el AGENTS.md de la app
- Artefactos en **orden de dependencia** (interface antes que implementacion)
- Templates de codigo copiables
- Reglas criticas especificas del stack

### 3. Ejecutor de Compilacion/Validacion
Compila, corre lint y tests. Corrige errores iterativamente.

```markdown
---
name: agente-compilacion
description: Compila y valida el proyecto
model: sonnet
---

# Agente: Compilacion

## Paso 1: Backend
\```bash
dotnet build proyecto.sln
\```
Si hay errores: analizar, corregir, re-ejecutar.

## Paso 2: Frontend
\```bash
npm run lint    # CERO warnings
npm run build
\```

## Reglas
1. Lint DEBE pasar con CERO warnings
2. Maximo 5 iteraciones de correccion
3. Solo corregir errores de compilacion -- no tocar codigo funcional

## Al Finalizar
Reportar: BUILD OK/FAILED por cada app
```

**Clave del compilador:**
- Limite de iteraciones (evita loops infinitos)
- Solo arregla errores de compilacion, no refactoriza
- Reporta estado claro por app

### 4. Ejecutor de Review/Analisis
No escribe codigo nuevo, analiza codigo existente.

```markdown
---
name: agente-review
description: Code review de PRs
model: sonnet
---

# Agente: Code Review

## Checklist
1. [ ] Naming conventions
2. [ ] Arquitectura (capas correctas)
3. [ ] Seguridad (connections cerradas, etc.)
4. [ ] Tests

## Formato de reporte
[Template del reporte]
```

---

## Buenas practicas

### 1. Un agente = una responsabilidad
No mezclar "implementar backend" con "compilar". Separar en agentes distintos.

### 2. El agente debe saber que reportar
Siempre incluir seccion "Al Finalizar" con que datos devolver al orquestador.

### 3. Templates > instrucciones vagas
Dar codigo de ejemplo que el agente pueda copiar y adaptar.

### 4. Referenciar AGENTS.md, no copiar
El agente debe LEER el AGENTS.md de la app, no duplicar su contenido.
Esto evita desincronizacion.

### 5. Parametros explicitos
Documentar que datos el agente espera recibir del orquestador:
- Endpoints requeridos
- DTOs a crear
- Diseno de referencia
- Reglas de negocio

### 6. Reglas criticas cortas y numeradas
Las reglas deben ser escanables:
```
1. NUNCA usar HttpClient directo -- siempre GetData<T,R>
2. SIEMPRE [ScopedService] en servicios
3. Prefijo `i` internas, `e` parametros
```

---

## Errores comunes

| Error | Consecuencia |
|-------|-------------|
| Poner todo en un solo agente | Se confunde y mezcla responsabilidades |
| No definir el modelo | Usa el default (puede ser mas caro de lo necesario) |
| No poner "Al Finalizar" | No reporta y el orquestador no sabe si termino bien |
| Copiar AGENTS.md dentro del agente | Se desincroniza cuando actualizas AGENTS.md |
| No limitar iteraciones del compilador | Loop infinito de correccion |
| Orquestador sin fases | Ejecuta todo de golpe sin planificar |
