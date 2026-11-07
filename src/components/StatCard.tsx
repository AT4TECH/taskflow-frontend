type StatCardProps = {
  label: string
  value: number
  tone: 'violet' | 'amber' | 'blue' | 'green'
  icon: string
}

export function StatCard({ label, value, tone, icon }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        <span className={`stat-icon stat-icon-${tone}`} aria-hidden="true">{icon}</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-caption">En tu espacio de trabajo</span>
    </article>
  )
}
