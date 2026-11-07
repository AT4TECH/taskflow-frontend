import type { TaskPriority, TaskStatus } from '../types/task'

type TaskFiltersProps = {
  searchQuery: string
  status: TaskStatus | 'todas'
  priority: TaskPriority | 'todas'
  onSearchChange: (value: string) => void
  onStatusChange: (status: TaskStatus | 'todas') => void
  onPriorityChange: (priority: TaskPriority | 'todas') => void
}

export function TaskFilters({
  searchQuery,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) {
  return (
    <div className="filters-bar" aria-label="Filtros y búsqueda de tareas">
      <span className="filter-title">
        <span aria-hidden="true">☷</span>
        Filtrar por
      </span>
      <label className="filter-control filter-control-search">
        <span>Buscar</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Título o descripción"
          aria-label="Buscar tareas por título o descripción"
          autoComplete="off"
        />
      </label>
      <label className="filter-control">
        <span>Estado</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as TaskStatus | 'todas')}
        >
          <option value="todas">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_progreso">En progreso</option>
          <option value="completada">Completada</option>
        </select>
      </label>
      <label className="filter-control">
        <span>Prioridad</span>
        <select
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value as TaskPriority | 'todas')}
        >
          <option value="todas">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </label>
    </div>
  )
}
