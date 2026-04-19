# Mejoras Sugeridas sobre el Setup Actual

Analisis de tu configuracion actual en el proyecto ecommerce con sugerencias
para mejorarla y tener en cuenta en futuros proyectos.

---

## 1. Falta settings.json en .claude/

**Que falta:** No hay un `.claude/settings.json` configurado.

**Que podrias agregar:**

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(dotnet build*)",
      "Bash(npm run*)",
      "Bash(git status*)",
      "Bash(git log*)",
      "Bash(git diff*)"
    ]
  },
  "hooks": {
    "PreToolCall": [
      {
        "matcher": "Edit",
        "command": "echo 'Editing file...'"
      }
    ],
    "PostToolCall": [
      {
        "matcher": "Bash(npm run build*)",
        "command": "echo 'Build completed'"
      }
    ]
  }
}
```

**Beneficio:** Auto-aprobar herramientas seguras para no tener que confirmar cada lectura/busqueda.
Los hooks pueden automatizar acciones pre/post (ej: lint automatico despues de edit).

---

## 2. AGENTS.md del frontend ecommerce es MUY largo (5600+ lineas)

**Problema:** Con 5600+ lineas, hay riesgo de que Claude resuma/pierda detalles al cargarlo.

**Sugerencia:** Dividirlo en secciones que se carguen segun necesidad:

```
LoanEcommerceFront/
  AGENTS.md                    # Core: 200 lineas max (arquitectura + reglas criticas)
  AGENTS-components.md         # Patrones de componentes
  AGENTS-redux.md              # Patrones de Redux
  AGENTS-tenant.md             # Sistema multi-tenant
  AGENTS-testing.md            # Testing patterns
```

El AGENTS.md principal referencia a los otros:
```markdown
## Documentacion detallada
- Componentes: ver `AGENTS-components.md`
- Redux: ver `AGENTS-redux.md`
```

Los agentes leen el principal + el especifico segun la tarea.

---

## 3. Commands que son solo wrappers de skills

**Observacion:** Muchos commands solo dicen "invocar skill X":

```markdown
## Ejecucion
Este command invoca el skill `code-review`.
```

**Sugerencia:** Esto esta bien como patron, pero podrias unificar.
Si un command solo apunta a un skill sin agregar nada, el skill podria
ser directamente invocable sin command intermedio. Evalua caso por caso:

- **Mantener command separado** cuando: tiene deteccion de modo, parametros complejos, tabla de subagentes
- **Eliminar command** cuando: es literalmente solo "Skill: nombre"

---

## 4. No hay agente de testing dedicado

**Observacion:** Tenes commands de testing (`testing-unitario.md`, `testing-integracion.md`)
pero no hay un agente de testing en `.claude/agents/`.

**Sugerencia:** Agregar un `agente-testing.md` que:
- Sepa generar tests para .NET (NUnit/xUnit) y React (Vitest)
- Entienda los patrones de mocking del proyecto
- Pueda correr tests y corregir iterativamente
- Sea llamado por el orquestador como Oleada 4 (post-compilacion)

---

## 5. No hay skill de refactoring

**Sugerencia:** Un `/refactor` que:
1. Analice el codigo actual
2. Identifique code smells
3. Proponga cambios
4. Ejecute con validacion de compilacion
5. Verifique que no rompio tests

---

## 6. Skills sin versionado consistente

**Observacion:** Algunos skills tienen `version: "2.1"`, otros `"1.0"`, y otros no tienen.

**Sugerencia:** Mantener version en todos. Ayuda a trackear cuando cambio un skill
y si los commands estan sincronizados con la ultima version.

---

## 7. Falta documentacion de MCP servers utilizados

**Observacion:** Los skills referencian Jira, Gitea, y potencialmente Figma MCP,
pero no hay un lugar central que documente que MCP servers estan configurados.

**Sugerencia:** Agregar al CLAUDE.md o en un archivo dedicado:

```markdown
## MCP Servers Configurados

| Server | Proposito | Config |
|--------|-----------|--------|
| Gitea | PRs, releases, archivos | owner: swf |
| Jira | Tickets, notas internas | cloudId: xxx |
| Figma | Disenos de referencia | — |
```

---

## 8. El orquestador no tiene manejo de errores entre oleadas

**Observacion:** Si el agente-backend falla, el orquestador no define que hacer.
Las oleadas 2 y 3 se ejecutarian con un backend incompleto.

**Sugerencia:** Agregar al orquestador:

```markdown
## Manejo de Errores entre Oleadas

- Si Oleada 1 (backend) falla: DETENER. Reportar errores. No lanzar Oleada 2.
- Si Oleada 2 (frontend) falla: Intentar Oleada 3 (compilacion) de todas formas
  para obtener la lista completa de errores.
- Si Oleada 3 (compilacion) falla: Reportar errores al usuario con archivos afectados.
```

---

## 9. No hay hook de pre-commit / pre-push integrado

**Sugerencia:** Configurar un hook en settings.json que corra lint antes de cada commit:

```json
{
  "hooks": {
    "PreToolCall": [
      {
        "matcher": "Bash(git commit*)",
        "command": "cd LoanEcommerceFront && npm run lint"
      }
    ]
  }
}
```

---

## 10. Falta un command de "setup" para nuevos devs

**Sugerencia:** Un `/setup` que:
1. Verifique prerequisitos (Node, .NET, etc.)
2. Instale dependencias (`npm ci` en cada frontend, `dotnet restore`)
3. Configure env files
4. Verifique que todo compila
5. Resuma el estado del proyecto

---

## Resumen de prioridades

| Mejora | Impacto | Esfuerzo |
|--------|---------|----------|
| settings.json con permisos | Alto | Bajo |
| Dividir AGENTS.md largo | Alto | Medio |
| Manejo de errores en orquestador | Alto | Bajo |
| Documentar MCP servers | Medio | Bajo |
| Agente de testing | Medio | Medio |
| Versionado de skills | Bajo | Bajo |
| Command /setup | Medio | Medio |
| Command /refactor | Bajo | Medio |
| Hook pre-commit | Bajo | Bajo |
| Eliminar commands wrapper | Bajo | Bajo |
