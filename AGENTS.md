# AGENTS.md — TaskFlow Frontend

## Propósito del repositorio

Este repositorio contiene la interfaz web de TaskFlow, una aplicación para gestionar tareas.

El frontend permite consultar y filtrar tareas, visualizar estadísticas, crear y editar tareas mediante formularios, cambiar su estado desde las tarjetas y eliminarlas. Las operaciones sobre las tareas utilizan la API REST de TaskFlow, desarrollada con FastAPI.

## Stack tecnológico

- React para construir la interfaz.
- TypeScript para el tipado estático.
- Vite como herramienta de desarrollo y compilación.
- CSS para los estilos visuales.
- ESLint para el análisis estático.
- npm para gestionar dependencias.
- Fetch API para la comunicación HTTP con el backend.

## Comandos del proyecto

Ejecutar desde la raíz del repositorio.

Instalar dependencias:

```cmd
npm install
```

Iniciar el servidor de desarrollo:

```cmd
npm run dev
```

Comprobar la compilación:

```cmd
npm run build
```

Ejecutar el análisis estático:

```cmd
npm run lint
```

## Organización del código

- `src/App.tsx`: estructura principal de la aplicación y coordinación de vistas.
- `src/App.css`: estilos de la aplicación.
- `src/index.css`: estilos globales.
- `src/main.tsx`: punto de entrada de React.
- `src/components/`: componentes reutilizables de la interfaz.
- `src/services/taskApi.ts`: comunicación HTTP con el backend.
- `src/types/task.ts`: tipos de datos de las tareas.
- `public/`: recursos estáticos.
- `docs/`: documentación y planes del proyecto.

## Reglas de arquitectura

1. Mantener los componentes visuales reutilizables en `src/components/`.
2. Centralizar las solicitudes HTTP en `src/services/taskApi.ts` y mantener los componentes visuales libres de lógica HTTP.
3. Mantener las definiciones compartidas de tipos en `src/types/task.ts`.
4. Conservar la navegación y las funcionalidades existentes. La navegación utiliza los fragmentos `#resumen` y `#tareas`, y `src/App.tsx` sincroniza la vista con la URL.

## Convenciones del equipo

- Usar TypeScript para los componentes y la lógica de la aplicación.
- Usar `PascalCase` para los nombres de componentes React.
- Usar `camelCase` para variables y funciones.
- Mantener componentes pequeños, legibles y con responsabilidades claras.
- Utilizar nombres descriptivos para propiedades y funciones.
- Conservar una interfaz coherente con el diseño actual de TaskFlow.
- Trabajar en ramas independientes creadas desde `main`.
- Utilizar nombres de rama como `feat/nombre-de-la-mejora`, `fix/nombre-del-error` o `chore/nombre-de-la-tarea`.
- Utilizar mensajes de commit descriptivos, por ejemplo `feat: agregar busqueda de tareas`.

## Integración con el backend

La URL base de FastAPI está definida en `src/services/taskApi.ts` como `http://127.0.0.1:8000`. Vite no tiene un proxy configurado, así que el navegador se conecta directamente a la API. FastAPI debe permitir mediante CORS el origen real del frontend, normalmente `http://localhost:5173`.

### Contrato HTTP del cliente

- `GET /tasks` devuelve un arreglo de tareas. `POST /tasks` crea una tarea.
- `GET /tasks/{id}` consulta una tarea individual, `PUT /tasks/{id}` la actualiza y `DELETE /tasks/{id}` la elimina. El servicio exporta la consulta individual, aunque la interfaz actual carga las tareas mediante la consulta de lista.
- `POST` y `PUT` envían JSON con `title`, `priority`, `status` y, cuando corresponde, `description`. El cuerpo omite `id`.
- Los estados son `pendiente`, `en_progreso` y `completada`. Las prioridades son `baja`, `media` y `alta`.
- `description` es opcional según `src/types/task.ts`. Al leer una tarea, el servicio admite una descripción de tipo cadena, ausente o con valor `null`. En los dos últimos casos omite el campo del objeto resultante.

Conservar la compatibilidad con el contrato de FastAPI. Coordinar con el backend cualquier cambio en métodos, rutas, campos o valores admitidos.

### Actualización de la lista y manejo de errores

Tras crear, editar, cambiar el estado o eliminar una tarea con éxito, `App.tsx` vuelve a solicitar la lista con `GET /tasks`. Si falla la recarga, informa que la operación se completó y que la lista no pudo actualizarse. En edición, cambio de estado y eliminación, aplica localmente el cambio sobre la tarea existente. En creación, conserva la lista previa sin agregar una tarea con un ID inventado.

Si falla la operación, la interfaz muestra el error. Si falla la carga y no hay tareas disponibles, ofrece reintentar. Mantener diferenciados los estados de carga, error, lista vacía y filtros sin coincidencias. Evitar mostrar información ficticia como si proviniera del backend.

## Verificaciones

- Ejecutar `npm run lint` y `npm run build` antes de finalizar una implementación.
- Cuando se modifiquen flujos de datos, verificar manualmente el flujo afectado con FastAPI activo. Comprobar la operación, la actualización de la lista y los estados de error pertinentes.
- En revisiones de solo lectura, informar qué verificaciones se ejecutaron, cuáles se omitieron y por qué.

## Restricciones de seguridad

- No publicar credenciales, tokens ni archivos `.env`.
- No modificar configuraciones de producción sin autorización.
- No eliminar funcionalidades existentes sin aprobación.
- No reemplazar el diseño completo cuando la solicitud sea una mejora puntual.
- No introducir dependencias externas sin justificar su necesidad.
- No modificar archivos ajenos a la solicitud sin autorización.
- No ejecutar comandos destructivos sin aprobación.

## Trabajo con agentes de IA

1. Leer este archivo y revisar los componentes relacionados con la solicitud. Las inspecciones de solo lectura pueden realizarse sin aprobación.
2. Antes de cualquier edición, presentar un plan con el alcance, los archivos afectados y las verificaciones previstas. Esperar la aprobación explícita del usuario antes de editar.
3. Modificar únicamente los archivos aprobados.
4. Aplicar las verificaciones correspondientes e informar los resultados y las limitaciones encontradas.
5. Obtener autorización explícita para crear un pull request y otra autorización explícita para fusionarlo.

Para las solicitudes del taller, implementar los cambios en la rama independiente asignada y usar un pull request para integrarlos a `main`, con las autorizaciones indicadas.
