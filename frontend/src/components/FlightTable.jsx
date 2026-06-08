import { motion } from 'framer-motion'
import StatusBadge from './StatusBadge'

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
]

function parseDate(value) {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function formatTime(value) {
  const d = parseDate(value)
  if (!d) return '--:--'
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

function formatDay(value) {
  const d = parseDate(value)
  if (!d) return ''
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]}`
}

function TimeCell({ value }) {
  return (
    <div className="leading-tight">
      <div className="font-mono text-base font-semibold text-slate-900">
        {formatTime(value)}
      </div>
      <div className="text-xs text-slate-500">{formatDay(value)}</div>
    </div>
  )
}

export default function FlightTable({ flights, onEdit, onDelete }) {
  const hasActions = Boolean(onEdit || onDelete)

  if (!flights || flights.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">
        No flights to display.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="no-scrollbar overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Flight</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Departure</th>
              <th className="px-4 py-3">Arrival</th>
              <th className="px-4 py-3">Gate</th>
              <th className="px-4 py-3">Aircraft</th>
              <th className="px-4 py-3">Status</th>
              {hasActions && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {flights.map((flight, index) => (
              <motion.tr
                key={flight.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                  delay: Math.min(index * 0.04, 0.4),
                }}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <span className="font-mono font-semibold text-slate-900">
                    {flight.flightNumber}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="font-mono font-medium text-slate-900">
                    {flight.originCode} <span className="text-slate-400">&rarr;</span>{' '}
                    {flight.destinationCode}
                  </div>
                  <div className="text-xs text-slate-500">
                    {flight.originCity} &ndash; {flight.destinationCity}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <TimeCell value={flight.scheduledDeparture} />
                </td>
                <td className="px-4 py-3">
                  <TimeCell value={flight.scheduledArrival} />
                </td>
                <td className="px-4 py-3 font-mono text-slate-700">
                  {flight.gate || <span className="text-slate-400">&mdash;</span>}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {flight.aircraftType || (
                    <span className="text-slate-400">&mdash;</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={flight.status} />
                </td>
                {hasActions && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(flight)}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(flight.id)}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
