import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { StatCard } from './components/StatCard'
import { TaskCard } from './components/TaskCard'
import { TaskFilters } from './components/TaskFilters'
import { TaskForm } from './components/TaskForm'
import { createTask, deleteTask, getTasks, updateTask } from './services/taskApi'
import type { Task, TaskInput, TaskPriority, TaskStatus } from './types/task'
import './App.css'

type Feedback = {
  type: 'success' | 'error'
  message: string
}

type View = 'resumen' | 'tareas'

function getViewFromHash(): View {
  return window.location.hash === '#tareas' ? 'tareas' : 'resumen'
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
}

function App() {
  const [activeView, setActiveView] = useState<View>(getViewFromHash)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'todas'>('todas')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'todas'>('todas')
  const [busyTaskIds, setBusyTaskIds] = useState<number[]>([])

  useEffect(() => {
    function syncViewWithUrl() {
      setActiveView(getViewFromHash())
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    if (window.location.hash !== '#resumen' && window.location.hash !== '#tareas') {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#resumen`)
    }

    window.addEventListener('hashchange', syncViewWithUrl)
    return () => window.removeEventListener('hashchange', syncViewWithUrl)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    getTasks(controller.signal)
      .then((loadedTasks) => {
        setTasks(loadedTasks)
        setLoadError(false)
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(true)
          setFeedback({ type: 'error', message: getErrorMessage(error) })
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const hasActiveFilters =
    statusFilter !== 'todas' || priorityFilter !== 'todas' || normalizedSearchQuery !== ''

  const visibleTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesStatus = statusFilter === 'todas' || task.status === statusFilter
        const matchesPriority = priorityFilter === 'todas' || task.priority === priorityFilter
        const matchesSearch =
          normalizedSearchQuery === '' ||
          task.title.toLowerCase().includes(normalizedSearchQuery) ||
          (task.description ?? '').toLowerCase().includes(normalizedSearchQuery)

        return matchesStatus && matchesPriority && matchesSearch
      }),
    [normalizedSearchQuery, priorityFilter, statusFilter, tasks],
  )

  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((task) => task.status === 'pendiente').length,
      inProgress: tasks.filter((task) => task.status === 'en_progreso').length,
      completed: tasks.filter((task) => task.status === 'completada').length,
    }),
    [tasks],
  )

  async function refreshAfterMutation(successMessage: string, fallback?: () => void) {
    try {
      setTasks(await getTasks())
      setLoadError(false)
      setFeedback({ type: 'success', message: successMessage })
    } catch (error) {
      fallback?.()
      if (!fallback && tasks.length === 0) {
        setLoadError(true)
      }
      setFeedback({
        type: 'success',
        message: `${successMessage} No se pudo actualizar la lista: ${getErrorMessage(error)}`,
      })
    }
  }

  async function handleSave(input: TaskInput) {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, input)
        await refreshAfterMutation('Cambios guardados correctamente.', () => {
          setTasks((current) =>
            current.map((item) =>
              item.id === editingTask.id ? { ...input, id: editingTask.id } : item,
            ),
          )
        })
      } else {
        await createTask(input)
        await refreshAfterMutation('Tarea creada correctamente.')
      }

      setIsFormOpen(false)
      setEditingTask(null)
      return true
    } catch (error) {
      setFeedback({ type: 'error', message: getErrorMessage(error) })
      return false
    }
  }

  function openCreateForm() {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  function openEditForm(task: Task) {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    setBusyTaskIds((current) => [...current, task.id])
    try {
      await updateTask(task.id, {
        title: task.title,
        ...(task.description ? { description: task.description } : {}),
        priority: task.priority,
        status,
      })
      await refreshAfterMutation('Estado actualizado correctamente.', () => {
        setTasks((current) =>
          current.map((item) => (item.id === task.id ? { ...item, status } : item)),
        )
      })
    } catch (error) {
      setFeedback({ type: 'error', message: getErrorMessage(error) })
    } finally {
      setBusyTaskIds((current) => current.filter((id) => id !== task.id))
    }
  }

  async function handleDelete(task: Task) {
    const confirmed = window.confirm(`¿Eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`)
    if (!confirmed) return

    setBusyTaskIds((current) => [...current, task.id])
    try {
      await deleteTask(task.id)
      await refreshAfterMutation('Tarea eliminada correctamente.', () => {
        setTasks((current) => current.filter((item) => item.id !== task.id))
      })
    } catch (error) {
      setFeedback({ type: 'error', message: getErrorMessage(error) })
    } finally {
      setBusyTaskIds((current) => current.filter((id) => id !== task.id))
    }
  }

  async function reloadTasks() {
    setIsLoading(true)
    try {
      setTasks(await getTasks())
      setLoadError(false)
      setFeedback(null)
    } catch (error) {
      setLoadError(true)
      setFeedback({ type: 'error', message: getErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }

  function renderTaskList(tasksForView: Task[], hasActiveFilters = false) {
    if (isLoading) {
      return (
        <div className="state-panel" role="status">
          <span className="loading-spinner" aria-hidden="true" />
          <strong>Cargando tus tareas...</strong>
          <span>Estamos consultando el espacio de trabajo.</span>
        </div>
      )
    }

    if (loadError && tasks.length === 0) {
      return (
        <div className="state-panel" role="alert">
          <span className="empty-icon" aria-hidden="true">!</span>
          <strong>No pudimos cargar las tareas</strong>
          <span>Comprueba que la API esté disponible e inténtalo de nuevo.</span>
          <button
            className="button button-primary"
            type="button"
            onClick={() => void reloadTasks()}
          >
            Reintentar
          </button>
        </div>
      )
    }

    if (tasks.length === 0) {
      return (
        <div className="state-panel empty-panel">
          <span className="empty-icon" aria-hidden="true">✦</span>
          <strong>Aún no hay tareas</strong>
          <span>Crea la primera tarea para empezar a organizar el trabajo de tu equipo.</span>
          <button className="button button-primary" type="button" onClick={openCreateForm}>
            Crear primera tarea
          </button>
        </div>
      )
    }

    if (tasksForView.length === 0) {
      return (
        <div className="state-panel">
          <span className="empty-icon" aria-hidden="true">⌕</span>
          <strong>No encontramos tareas que coincidan</strong>
          <span>Prueba con otra búsqueda o ajusta los filtros de estado y prioridad.</span>
          {hasActiveFilters && (
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('todas')
                setPriorityFilter('todas')
              }}
            >
              Limpiar búsqueda y filtros
            </button>
          )}
        </div>
      )
    }

    return (
      <div className="task-grid">
        {tasksForView.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isBusy={busyTaskIds.includes(task.id)}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} />

      <main className="main-content">
        <header className="topbar">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">T</span>
            <span>TaskFlow</span>
          </div>
          <div className="topbar-meta">
            <span className="connection-indicator">
              <span aria-hidden="true" />
              API local
            </span>
            <span className="avatar" aria-label="Equipo">TF</span>
          </div>
        </header>

        <div className="page-content">
          {feedback && (
            <div className={`feedback feedback-${feedback.type}`} role="status">
              <span>{feedback.message}</span>
              <button
                type="button"
                className="feedback-close"
                aria-label="Cerrar mensaje"
                onClick={() => setFeedback(null)}
              >
                ×
              </button>
            </div>
          )}

          {activeView === 'resumen' ? (
            <>
              <section className="welcome-row" id="resumen">
                <div>
                  <p className="eyebrow">ESPACIO DE TRABAJO</p>
                  <h1>Tu equipo, en sintonía.</h1>
                  <p className="welcome-copy">Organiza el trabajo y mantén cada tarea en movimiento.</p>
                </div>
                <button className="button button-primary" type="button" onClick={openCreateForm}>
                  <span aria-hidden="true">+</span>
                  Nueva tarea
                </button>
              </section>

              <section className="stats-grid" aria-label="Estadísticas de tareas">
                <StatCard label="Total de tareas" value={stats.total} tone="violet" icon="01" />
                <StatCard label="Pendientes" value={stats.pending} tone="amber" icon="02" />
                <StatCard label="En progreso" value={stats.inProgress} tone="blue" icon="03" />
                <StatCard label="Completadas" value={stats.completed} tone="green" icon="04" />
              </section>

              <section className="tasks-section" aria-labelledby="quick-view-title">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">UN VISTAZO</p>
                    <h2 id="quick-view-title">Vista rápida</h2>
                    <p className="section-subtitle">
                      {tasks.length} {tasks.length === 1 ? 'tarea en total' : 'tareas en total'}
                    </p>
                  </div>
                  <a className="button button-secondary" href="#tareas">Ver todas las tareas</a>
                </div>
                <div className="quick-task-list">{renderTaskList(tasks.slice(0, 3))}</div>
              </section>
            </>
          ) : (
            <section className="tasks-section management-section" id="tareas">
              <div className="management-heading">
                <div>
                  <p className="eyebrow">ORGANIZA EL TRABAJO</p>
                  <h1>Gestión de tareas</h1>
                  <p className="welcome-copy">Consulta, filtra y actualiza las tareas de tu equipo.</p>
                </div>
                <button className="button button-primary" type="button" onClick={openCreateForm}>
                  <span aria-hidden="true">+</span>
                  Nueva tarea
                </button>
              </div>

              <div className="section-heading management-list-heading">
                <div>
                  <h2>Todas las tareas</h2>
                  <p className="section-subtitle">
                    {tasks.length} {tasks.length === 1 ? 'tarea en total' : 'tareas en total'}
                  </p>
                </div>
                <button
                  className="button button-secondary refresh-button"
                  type="button"
                  onClick={() => void reloadTasks()}
                  disabled={isLoading}
                >
                  <span aria-hidden="true">↻</span>
                  Actualizar
                </button>
              </div>

              <TaskFilters
                searchQuery={searchQuery}
                status={statusFilter}
                priority={priorityFilter}
                onSearchChange={setSearchQuery}
                onStatusChange={setStatusFilter}
                onPriorityChange={setPriorityFilter}
              />
              {renderTaskList(visibleTasks, hasActiveFilters)}
            </section>
          )}

          <footer className="page-footer">
            <span>TaskFlow · Hecho para que el trabajo fluya.</span>
            <span>Datos sincronizados con tu API local</span>
          </footer>
        </div>
      </main>

      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onClose={() => {
            setIsFormOpen(false)
            setEditingTask(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default App
