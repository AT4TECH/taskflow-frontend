# Plan inicial del frontend de TaskFlow

## Alcance

Construir una interfaz educativa para gestionar tareas de un equipo pequeño con React, TypeScript y CSS. No se añadirán bibliotecas, autenticación, servicios externos ni datos simulados. Todos los datos visibles como tareas procederán de la API FastAPI.

## Arquitectura

- `src/types/task.ts`: tipos de tarea, prioridad y estado, limitados a los campos confirmados por el contrato.
- `src/services/taskApi.ts`: comunicación HTTP con `fetch` nativo, validación de respuestas y errores explícitos.
- `src/components/`: componentes reutilizables para navegación, estadísticas, filtros, tarjetas y formulario.
- `src/App.tsx`: carga de tareas, filtros, coordinación de acciones y mensajes de estado.
- `src/App.css` y `src/index.css`: estilos de componentes, diseño responsive y estilos globales.
- `docs/plan-inicial-frontend.md`: este plan técnico revisado.

## Contrato de API

La API local está en `http://127.0.0.1:8000`. Se utilizarán únicamente estos endpoints:

- `GET /tasks`
- `POST /tasks`
- `GET /tasks/{task_id}`
- `PUT /tasks/{task_id}`
- `DELETE /tasks/{task_id}`

Los únicos campos de tarea usados serán `id`, `title`, `description`, `priority` y `status`. Los valores de prioridad son `baja`, `media` y `alta`; los estados son `pendiente`, `en_progreso` y `completada`. El backend no estuvo disponible para inspección, por lo que la implementación se basará en este contrato confirmado, sin asumir campos adicionales.

El cliente centralizará las llamadas con `fetch`, enviará JSON para crear y editar, verificará los códigos HTTP y comunicará los errores. Tras cada mutación exitosa solicitará de nuevo la lista para mostrar los datos confirmados por el servidor. Una mutación no se presentará como exitosa antes de recibir una respuesta HTTP correcta.

## Interfaz y componentes

- Barra lateral de navegación con entrada al tablero y acceso a tareas.
- Encabezado en español con el nombre TaskFlow y acción para crear una tarea.
- Cuatro tarjetas de estadísticas: total, pendientes, en progreso y completadas.
- Filtros combinables por estado y prioridad.
- Tarjetas de tarea con título, descripción opcional, indicadores de prioridad y estado, selector de estado y acciones de editar y eliminar.
- Formulario modal compartido para crear y editar; el título es obligatorio.
- Confirmación del navegador antes de eliminar.
- Estados de carga, error, éxito, lista vacía y ausencia de resultados para los filtros.

## Diseño y adaptación

Se usará CSS propio con apariencia SaaS profesional: paleta clara, acento azul-violeta, bordes suaves, espaciado consistente e indicadores diferenciados por prioridad y estado. En escritorio habrá navegación lateral y una cuadrícula de estadísticas; en pantallas pequeñas la navegación, filtros y tarjetas se reorganizarán para mantener la legibilidad y evitar desbordamiento horizontal.

## Verificación

- `npm run build`: validación de tipos TypeScript y compilación de Vite.
- `npm run lint`: ESLint del proyecto.
- Revisión manual de los flujos conectados a FastAPI: carga, creación, edición, cambio de estado, eliminación, filtros, lista vacía y errores.

No existe actualmente un runner de pruebas unitarias en las dependencias, por lo que no se añadirá uno para esta implementación.

## Comandos de ejecución en Windows CMD

Desde la carpeta `taskflow-frontend`:

```cmd
npm run dev
npm run build
npm run lint
```

La API debe estar activa en `http://127.0.0.1:8000` y permitir mediante CORS el origen del servidor Vite.

## Riesgos y supuestos

- No se pudo consultar el OpenAPI ni `GET /tasks` porque el backend local no estaba accesible.
- La integración usa el contrato confirmado: `GET /tasks` devuelve una lista de tareas y las respuestas HTTP exitosas indican que la mutación fue aceptada; la lista se vuelve a cargar para reflejar el estado persistido.
- FastAPI debe habilitar CORS para el origen local del frontend.
- Se utiliza el diálogo de confirmación nativo del navegador para eliminar tareas.
