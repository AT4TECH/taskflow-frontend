type SidebarProps = {
  activeView: 'resumen' | 'tareas'
}

export function Sidebar({ activeView }: SidebarProps) {
  return (
    <aside className="sidebar">
      <a className="sidebar-brand" href="#resumen" aria-label="TaskFlow, ir al resumen">
        <span className="brand-mark" aria-hidden="true">T</span>
        <span>TaskFlow</span>
      </a>

      <div className="sidebar-label">MENÚ PRINCIPAL</div>
      <nav className="side-nav" aria-label="Navegación principal">
        <a
          className={`side-nav-link${activeView === 'resumen' ? ' active' : ''}`}
          href="#resumen"
          aria-current={activeView === 'resumen' ? 'page' : undefined}
        >
          <span className="nav-icon" aria-hidden="true">▦</span>
          Resumen
        </a>
        <a
          className={`side-nav-link${activeView === 'tareas' ? ' active' : ''}`}
          href="#tareas"
          aria-current={activeView === 'tareas' ? 'page' : undefined}
        >
          <span className="nav-icon" aria-hidden="true">☷</span>
          Tareas
        </a>
      </nav>

      <div className="sidebar-bottom">
        <div className="team-card">
          <span className="team-icon" aria-hidden="true">✦</span>
          <div>
            <strong>Pequeño equipo</strong>
            <span>Un paso a la vez</span>
          </div>
        </div>
        <span className="sidebar-version">TU ESPACIO DE TRABAJO</span>
      </div>
    </aside>
  )
}
