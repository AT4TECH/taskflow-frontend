---
name: validar-frontend-taskflow
description: Valida el frontend de TaskFlow cuando se solicite revisar React, TypeScript, lint, compilación, navegación, estados de la interfaz o integración con FastAPI. Informa hallazgos sin aplicar correcciones.
---

# Validar el frontend de TaskFlow

1. Trabaja desde la raíz del frontend y lee `AGENTS.md`. Revisa `package.json` para confirmar qué ejecutan los comandos del proyecto. Si npm y las dependencias locales están disponibles, ejecuta por separado `npm run lint` y `npm run build`. Registra el resultado de ESLint y el de la compilación de TypeScript y Vite. Ten en cuenta que la compilación genera artefactos. Si faltan requisitos o el alcance impide generar esos artefactos, registra la comprobación como no ejecutada.
2. Revisa `src/types/task.ts`, `src/App.tsx` y los componentes pertinentes de `src/components/`. Comprueba la coherencia de los tipos, las props, los formularios y los valores de estado y prioridad. Verifica que los enlaces a `#resumen` y `#tareas` coincidan con la lógica que sincroniza la vista con la URL.
3. Contrasta `src/services/taskApi.ts` con los tipos y el contrato documentado en `AGENTS.md`. Revisa métodos, rutas, cuerpos JSON, validación de respuestas y manejo de errores. Consulta `vite.config.ts` para comprobar cómo llega la solicitud a FastAPI y qué origen debe permitir CORS. Distingue lo comprobado en el código de lo observado con la API activa.
4. Comprueba que la interfaz distinga carga, error con reintento cuando corresponda, lista vacía y filtros sin coincidencias. Si el entorno permite una prueba manual, abre ambas vistas en el navegador y comprueba los estados que puedan reproducirse. Cualquier creación, edición, cambio de estado o eliminación requiere datos de prueba autorizados. Si no hay navegador, API o datos adecuados, indica qué escenarios manuales quedaron sin ejecutar.

## Límites

Valida e informa. No corrijas los hallazgos ni modifiques el código, la configuración o el contrato HTTP. No instales dependencias sin autorización ni ejecutes scripts externos o comandos destructivos. No cambies de rama ni hagas commits o push.

## Informe

Clasifica cada comprobación como **aprobada**, **fallida** o **no ejecutada**. Indica si fue una revisión de código, un comando o una prueba manual. Incluye la evidencia pertinente, como el comando y su resultado, el archivo y la línea o el comportamiento observado. Explica las limitaciones y el motivo de cada comprobación no ejecutada.
