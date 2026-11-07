import type { Task, TaskStatus } from '../types/task'
import { priorityLabels, statusLabels } from '../types/task'

type TaskCardProps = {
  task: Task
  isBusy: boolean
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange: (task: Task, status: TaskStatus) => void
}

export function TaskCard({
  task,
  isBusy,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  return (
    <article className={`task-card${task.status === 'completada' ? ' task-card-completed' : ''}`}>
      <div className="task-card-heading">
        <span className={`priority-badge priority-${task.priority}`}>
          <span aria-hidden="true">●</span>
          Prioridad {priorityLabels[task.priority]}
        </span>
        <div className="task-actions">
          <button
            type="button"
            className="icon-button"
            aria-label={`Editar ${task.title}`}
            onClick={() => onEdit(task)}
            disabled={isBusy}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m13.8 3.2 3 3-9.4 9.4-3.8.8.8-3.8 9.4-9.4Z" />
              <path d="m11.9 5.1 3 3" />
            </svg>
          </button>
          <button
            type="button"
            className="icon-button danger-action"
            aria-label={`Eliminar ${task.title}`}
            onClick={() => onDelete(task)}
            disabled={isBusy}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4.5 6h11M8 6V4h4v2m-6 0 .7 10h6.6L14 6m-4 3v4m2-4v4" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>
      <p className={`task-description${task.description ? '' : ' task-description-empty'}`}>
        {task.description || 'Sin descripción'}
      </p>

      <div className="task-card-footer">
        <span className={`status-pill status-${task.status}`}>
          <span className="status-dot" aria-hidden="true" />
          {statusLabels[task.status]}
        </span>
        <label className="status-select-label">
          <span className="visually-hidden">Cambiar estado de {task.title}</span>
          <select
            value={task.status}
            onChange={(event) => onStatusChange(task, event.target.value as TaskStatus)}
            disabled={isBusy}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En progreso</option>
            <option value="completada">Completada</option>
          </select>
        </label>
      </div>
    </article>
  )
}
