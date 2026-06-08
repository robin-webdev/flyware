const STATUS_STYLES = {
  SCHEDULED: 'bg-slate-100 text-slate-600 ring-slate-200',
  BOARDING: 'bg-amber-100 text-amber-700 ring-amber-200',
  DEPARTED: 'bg-sky-100 text-sky-700 ring-sky-200',
  IN_AIR: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
  LANDED: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  DELAYED: 'bg-orange-100 text-orange-700 ring-orange-200',
  CANCELLED: 'bg-red-100 text-red-700 ring-red-200',
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.SCHEDULED
  const label = (status || 'SCHEDULED').replace('_', ' ')

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${style}`}
    >
      {label}
    </span>
  )
}
