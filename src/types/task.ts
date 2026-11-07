export type TaskPriority = 'baja' | 'media' | 'alta'
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada'

export type Task = {
  id: number
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
}

export type TaskInput = Omit<Task, 'id'>

export const priorityLabels: Record<TaskPriority, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
}

export const statusLabels: Record<TaskStatus, string> = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
}
