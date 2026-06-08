import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  getFlights,
  createFlight,
  updateFlight,
  deleteFlight,
} from '../api/flightApi'
import FlightTable from '../components/FlightTable'
import FlightForm from '../components/FlightForm'

export default function Admin() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  async function fetchFlights() {
    try {
      const data = await getFlights()
      setFlights(
        [...data].sort((a, b) =>
          (a.scheduledDeparture || '').localeCompare(b.scheduledDeparture || '')
        )
      )
      setError(null)
    } catch {
      setError('Unable to reach the flight service.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlights()
  }, [])

  function openAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(flight) {
    setEditing(flight)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
  }

  async function handleSubmit(flight) {
    setSaving(true)
    try {
      if (editing) {
        await updateFlight(editing.id, flight)
      } else {
        await createFlight(flight)
      }
      closeModal()
      await fetchFlights()
    } catch {
      setError('Failed to save the flight. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this flight? This cannot be undone.')) return
    try {
      await deleteFlight(id)
      await fetchFlights()
    } catch {
      setError('Failed to delete the flight. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Admin <span className="text-slate-400">&middot;</span> Manage Flights
        </h1>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          Add Flight
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">
          Loading flights...
        </div>
      ) : (
        <FlightTable
          flights={flights}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="no-scrollbar fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm sm:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white shadow-xl"
            >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editing ? 'Edit Flight' : 'Add Flight'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path
                    strokeLinecap="round"
                    d="M5 5l10 10M15 5L5 15"
                  />
                </svg>
              </button>
            </div>
            <div className="px-6 py-6">
              <fieldset disabled={saving} className="min-w-0">
                <FlightForm
                  initialFlight={editing}
                  onSubmit={handleSubmit}
                  onCancel={closeModal}
                />
              </fieldset>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
