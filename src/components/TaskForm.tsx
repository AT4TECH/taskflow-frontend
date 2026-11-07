import { useState, type FormEvent } from 'react'
import type { Task, TaskInput, TaskPriority, TaskStatus } from '../types/task'

type TaskFormProps = {
  task: Task | null
  onClose: () => void
  onSave: (task: TaskInput) => Promise<boolean>
}

export function TaskForm({ task, onClose, onSave }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'media')
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'pendiente')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    const saved = await onSave({
      title: title.trim(),
      ...(description.trim() ? { description: description.trim() } : {}),
      priority,
      status,
    })
    setIsSaving(false)
    if (saved) onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">{task ? 'ACTUALIZA LOS DETALLES' : 'ORGANIZA TU TRABAJO'}</p>
            <h2 id="task-form-title">{task ? 'Editar tarea' : 'Nueva tarea'}</h2>
          </div>
          <button
            className="icon-button modal-close"
            type="button"
            aria-label="Cerrar formulario"
            onClick={onClose}
            disabled={isSaving}
          >
            ×
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Título <span className="required-mark">*</span></span>
            <input
              autoFocus
              required
              maxLength={160}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ej. Preparar presentación del proyecto"
            />
          </label>
          <label className="form-field">
            <span>Descripción <span className="optional-label">Opcional</span></span>
            <textarea
              rows={4}
              maxLength={1000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Añade contexto o próximos pasos..."
            />
          </label>
          <div className="form-fields-row">
            <label className="form-field">
              <span>Prioridad</span>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as TaskPriority)}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </label>
            <label className="form-field">
              <span>Estado</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as TaskStatus)}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En progreso</option>
                <option value="completada">Completada</option>
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button className="button button-secondary" type="button" onClick={onClose} disabled={isSaving}>
              Cancelar
            </button>
            <button className="button button-primary" type="submit" disabled={isSaving || !title.trim()}>
              {isSaving ? 'Guardando...' : task ? 'Guardar cambios' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
