# Guia: Como crear AGENTS.md

## Que es

`AGENTS.md` es un archivo de instrucciones **por aplicacion o modulo** dentro del monorepo.
Mientras que `CLAUDE.md` es el mapa general, `AGENTS.md` es el manual detallado
de como escribir codigo en esa app especifica.

**Ubicacion:** En la raiz de cada app o modulo:
```
proyecto/
  CLAUDE.md                  <-- General
  backend/AGENTS.md          <-- Detalle del backend
  frontend/AGENTS.md         <-- Detalle del frontend
  mobile/AGENTS.md           <-- Detalle de la app mobile
```

Claude Code carga automaticamente el `AGENTS.md` del directorio donde esta trabajando.
Ademas, los agentes (`.claude/agents/`) lo leen explicitamente antes de generar codigo.

---

## Para que sirve (vs CLAUDE.md)

| Aspecto | CLAUDE.md | AGENTS.md |
|---------|-----------|-----------|
| Alcance | Todo el proyecto | Una app/modulo |
| Nivel de detalle | Alto nivel | Codigo concreto con ejemplos |
| Contenido tipico | Arquitectura, build commands, reglas | Patrones de codigo, templates, forbidden patterns |
| Quien lo lee | Claude siempre | Claude + agentes cuando trabajan en esa app |
| Tamano recomendado | 80-150 lineas | 200-500+ lineas (puede ser extenso) |

---

## Estructura recomendada (template)

```markdown
# AGENTS.md -- [Nombre App]

## Rol
Sos un senior [stack] engineer trabajando en [app].
Tu objetivo es implementar [tipo de trabajo] siguiendo los patrones establecidos.

## Stack
- [Framework] [version]
- [Lenguaje] [version]
- [ORM/DB]
- [State management]
- [UI library]

## Arquitectura del Proyecto

### Estructura de carpetas
\```
src/
  Controllers/    -- [responsabilidad]
  Services/       -- [responsabilidad]
  Models/         -- [responsabilidad]
  ...
\```

### Patron principal: [nombre]
[Descripcion del patron con codigo de ejemplo]

## Patrones de Codigo (con ejemplos)

### Patron 1: [nombre]
\```[lang]
// Template que Claude debe seguir
[codigo ejemplo completo y funcional]
\```

### Patron 2: [nombre]
\```[lang]
[codigo ejemplo]
\```

## Naming Conventions (detallado)

| Que | Convencion | Ejemplo |
|-----|-----------|---------|
| Servicios | [patron] | `ObtenerClientes` |
| Interfaces | [patron] | `IObtenerClientes` |
| DTOs | [patron] | `ClienteRequestFront` |
| ...  | ... | ... |

## Reglas Criticas (MUST/NEVER)

1. **NUNCA** [cosa prohibida] -- [por que]
2. **SIEMPRE** [cosa obligatoria] -- [por que]
3. ...

## Forbidden Patterns (lista de anti-patrones)

\```[lang]
// MAL - NO HACER ESTO
[codigo malo]

// BIEN - HACER ESTO
[codigo correcto]
\```

## Hooks y Utilidades Disponibles

| Hook/Util | Para que | Ejemplo |
|-----------|----------|---------|
| `useTenantConfig()` | Config del tenant | `const { config } = useTenantConfig()` |
| `useTitulos()` | Textos UI | `const textos = useTitulos()` |
| ...  | ... | ... |

## Testing
[Frameworks, patrones, como correr tests]

## Al Finalizar (checklist)
- [ ] Compila sin errores
- [ ] Lint sin warnings
- [ ] No hay `any` en TS
- [ ] Naming correcto
- [ ] [reglas especificas del proyecto]
```

---

## Principios para escribir un buen AGENTS.md

### 1. Codigo de ejemplo > descripcion en prosa
Claude aprende mejor de ejemplos concretos que de explicaciones abstractas.
En vez de "los servicios usan inyeccion de dependencias", mostrar:

```csharp
[ScopedService(ServiceType = typeof(IObtenerRecurso))]
public class ObtenerRecurso : IObtenerRecurso
{
    private readonly GetData<RequestLoan, ResponseLoan> iGetData;

    public ObtenerRecurso(HttpClient eHttpClient)
    {
        iGetData = new GetData<RequestLoan, ResponseLoan>(eHttpClient);
    }
}
```

### 2. Tablas de naming > listas de texto
Las tablas son mas escanables:

| Direccion | Patron | Ubicacion |
|-----------|--------|-----------|
| Frontend -> Backend | `{Dominio}RequestFront` | `Models/Request/` |
| Backend -> API externa | `Request{Dominio}Loan` | `Models/Request/` |
| API externa -> Backend | `Response{Dominio}Loan` | `Models/Response/` |

### 3. Forbidden patterns explicitos
No alcanza con decir "no hardcodear". Mostrar el antes y despues:

```tsx
// MAL
<h2>Bienvenido al sistema</h2>
<div style={{ color: '#FF0000' }}>Error</div>

// BIEN
<h2>{textos.bienvenida}</h2>
<div className="error-message">Error</div>
```

### 4. Hooks/utilidades como referencia
Si el proyecto tiene hooks o utilidades, listarlos con su proposito.
Claude los va a usar en vez de reinventar la rueda.

### 5. Largo esta bien
A diferencia del CLAUDE.md (que debe ser conciso), AGENTS.md puede ser extenso
porque se carga solo cuando se trabaja en esa app. Tu frontend AGENTS.md
tiene 5600+ lineas y funciona perfecto.

### 6. Secciones de regionalizacion/i18n
Si el proyecto soporta multiples regiones/idiomas, documentar las reglas
de validacion por region con tablas claras.

---

## Errores comunes

| Error | Solucion |
|-------|----------|
| No poner ejemplos de codigo | Agregar templates completos copiables |
| Reglas sin "por que" | Agregar la razon: "NUNCA usar axios directo -- para centralizar headers y error handling" |
| No documentar los hooks disponibles | Claude crea hooks duplicados o usa patrones manuales |
| Mezclar reglas de varias apps | Un AGENTS.md por app, con sus propias reglas |
| No incluir checklist final | Claude no valida su propio output |
| No documentar las diferencias entre apps | Claude aplica patrones del backend en el frontend |

---

## Ejemplo minimo para una API Node.js

```markdown
# AGENTS.md -- API

## Rol
Senior Node.js/TypeScript engineer. Implementas endpoints REST siguiendo los patrones del proyecto.

## Patron de endpoint
\```typescript
// routes/user.routes.ts
router.post('/users', validate(createUserSchema), async (req, res, next) => {
  try {
    const result = await userService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});
\```

## Patron de servicio
\```typescript
// services/user.service.ts
export const userService = {
  create: async (data: CreateUserInput): Promise<User> => {
    return prisma.user.create({ data });
  }
};
\```

## Naming
| Que | Patron | Ejemplo |
|-----|--------|---------|
| Routes | kebab-case | `user-profile.routes.ts` |
| Services | camelCase | `userService.create()` |
| Schemas | camelCase + Schema | `createUserSchema` |
| Types | PascalCase | `CreateUserInput` |

## Reglas
1. NUNCA acceder a `prisma` fuera de services
2. SIEMPRE validar con Zod en el router (middleware `validate()`)
3. NUNCA catchear errores en el service -- dejar que suba al error handler
4. SIEMPRE usar transacciones para operaciones multi-tabla

## Forbidden Patterns
\```typescript
// MAL: query raw
const users = await prisma.$queryRaw`SELECT * FROM users`;

// BIEN: Prisma client
const users = await prisma.user.findMany({ where: { active: true } });
\```
```
