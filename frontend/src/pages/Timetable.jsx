import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getFlights } from '../api/flightApi'
import FlightTable from '../components/FlightTable'
import Select from '../components/Select'
import Spinner from '../components/Spinner'
import LoadingBar from '../components/LoadingBar'

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'SCHEDULED', label: 'Scheduled', dot: 'bg-slate-400' },
  { value: 'BOARDING', label: 'Boarding', dot: 'bg-amber-500' },
  { value: 'DEPARTED', label: 'Departed', dot: 'bg-sky-500' },
  { value: 'IN_AIR', label: 'In air', dot: 'bg-indigo-500' },
  { value: 'LANDED', label: 'Landed', dot: 'bg-emerald-500' },
  { value: 'DELAYED', label: 'Delayed', dot: 'bg-orange-500' },
  { value: 'CANCELLED', label: 'Cancelled', dot: 'bg-red-500' },
]

export default function Timetable() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const data = await getFlights()
        if (!active) return
        setFlights(data)
        setError(null)
      } catch {
        if (active) setError('Unable to reach the flight service.')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    const interval = setInterval(load, 30000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return flights
      .filter((f) => statusFilter === 'ALL' || f.status === statusFilter)
      .filter((f) => {
        if (!term) return true
        return [
          f.flightNumber,
          f.originCode,
          f.originCity,
          f.destinationCode,
          f.destinationCity,
        ]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(term))
      })
      .sort((a, b) =>
        (a.scheduledDeparture || '').localeCompare(b.scheduledDeparture || '')
      )
  }, [flights, statusFilter, search])

  return (
    <>
      <LoadingBar active={loading} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Departures
        </h1>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live
        </span>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
          className="w-full sm:w-52"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search flight, route or city..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 caret-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:max-w-xs"
        />
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-red-200 bg-red-50 p-12 text-center text-sm text-red-700 shadow-sm"
        >
          {error}
        </motion.div>
      ) : (
        <FlightTable flights={filtered} />
      )}
      </motion.div>
    </>
  )
}
