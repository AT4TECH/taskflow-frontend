import type { Task, TaskInput, TaskPriority, TaskStatus } from '../types/task'

const API_BASE_URL = 'http://127.0.0.1:8000'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseTask(value: unknown): Task {
  if (!isRecord(value)) {
    throw new Error('La API devolvió una tarea con un formato no válido.')
  }

  const { id, title, description, priority, status } = value
  const validPriority: TaskPriority[] = ['baja', 'media', 'alta']
  const validStatus: TaskStatus[] = ['pendiente', 'en_progreso', 'completada']

  if (
    typeof id !== 'number' ||
    !Number.isFinite(id) ||
    typeof title !== 'string' ||
    (description !== undefined && description !== null && typeof description !== 'string') ||
    typeof priority !== 'string' ||
    !validPriority.includes(priority as TaskPriority) ||
    typeof status !== 'string' ||
    !validStatus.includes(status as TaskStatus)
  ) {
    throw new Error('La API devolvió una tarea con campos o valores no válidos.')
  }

  return {
    id,
    title,
    ...(typeof description === 'string' ? { description } : {}),
    priority: priority as TaskPriority,
    status: status as TaskStatus,
  }
}

async function request(path: string, init?: RequestInit) {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw new Error(
      'No se pudo conectar con la API. Comprueba que FastAPI esté ejecutándose y que CORS esté habilitado.',
      { cause: error },
    )
  }

  if (!response.ok) {
    const details = await response.text()
    throw new Error(
      details
        ? `La API respondió con error (${response.status}): ${details}`
        : `La API respondió con error (${response.status}).`,
    )
  }

  return response
}

export async function getTasks(signal?: AbortSignal): Promise<Task[]> {
  const response = await request('/tasks', { signal })
  const data: unknown = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('La respuesta de GET /tasks debe ser una lista de tareas.')
  }

  return data.map(parseTask)
}

export async function getTask(taskId: number, signal?: AbortSignal): Promise<Task> {
  const response = await request(`/tasks/${taskId}`, { signal })
  return parseTask(await response.json())
}

export async function createTask(task: TaskInput): Promise<void> {
  await request('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
}

export async function updateTask(taskId: number, task: TaskInput): Promise<void> {
  await request(`/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
}

export async function deleteTask(taskId: number): Promise<void> {
  await request(`/tasks/${taskId}`, { method: 'DELETE' })
}
