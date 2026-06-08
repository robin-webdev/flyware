import { useState } from 'react'
import Select from './Select'

const STATUS_OPTIONS = [
  { value: 'SCHEDULED', label: 'Scheduled', dot: 'bg-slate-400' },
  { value: 'BOARDING', label: 'Boarding', dot: 'bg-amber-500' },
  { value: 'DEPARTED', label: 'Departed', dot: 'bg-sky-500' },
  { value: 'IN_AIR', label: 'In air', dot: 'bg-indigo-500' },
  { value: 'LANDED', label: 'Landed', dot: 'bg-emerald-500' },
  { value: 'DELAYED', label: 'Delayed', dot: 'bg-orange-500' },
  { value: 'CANCELLED', label: 'Cancelled', dot: 'bg-red-500' },
]

function toInputValue(iso) {
  if (!iso) return ''
  // Backend sends LocalDateTime like "2026-06-08T06:15:00"; input wants "2026-06-08T06:15"
  return iso.slice(0, 16)
}

function toIso(inputValue) {
  if (!inputValue) return null
  // Normalise to full LocalDateTime with seconds for the backend
  return inputValue.length === 16 ? `${inputValue}:00` : inputValue
}

const EMPTY = {
  flightNumber: '',
  originCode: '',
  originCity: '',
  destinationCode: '',
  destinationCity: '',
  scheduledDeparture: '',
  scheduledArrival: '',
  status: 'SCHEDULED',
  gate: '',
  aircraftType: '',
}

export default function FlightForm({ initialFlight, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => {
    if (!initialFlight) return EMPTY
    return {
      flightNumber: initialFlight.flightNumber || '',
      originCode: initialFlight.originCode || '',
      originCity: initialFlight.originCity || '',
      destinationCode: initialFlight.destinationCode || '',
      destinationCity: initialFlight.destinationCity || '',
      scheduledDeparture: toInputValue(initialFlight.scheduledDeparture),
      scheduledArrival: toInputValue(initialFlight.scheduledArrival),
      status: initialFlight.status || 'SCHEDULED',
      gate: initialFlight.gate || '',
      aircraftType: initialFlight.aircraftType || '',
    }
  })
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!form.flightNumber.trim()) next.flightNumber = 'Flight number is required.'
    if (!form.originCode.trim()) next.originCode = 'Origin code is required.'
    if (!form.originCity.trim()) next.originCity = 'Origin city is required.'
    if (!form.destinationCode.trim())
      next.destinationCode = 'Destination code is required.'
    if (!form.destinationCity.trim())
      next.destinationCity = 'Destination city is required.'
    if (!form.scheduledDeparture)
      next.scheduledDeparture = 'Departure time is required.'
    if (!form.scheduledArrival) next.scheduledArrival = 'Arrival time is required.'
    if (
      form.scheduledDeparture &&
      form.scheduledArrival &&
      form.scheduledDeparture >= form.scheduledArrival
    ) {
      next.scheduledArrival = 'Departure must be before arrival.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      ...initialFlight,
      flightNumber: form.flightNumber.trim(),
      originCode: form.originCode.trim().toUpperCase(),
      originCity: form.originCity.trim(),
      destinationCode: form.destinationCode.trim().toUpperCase(),
      destinationCity: form.destinationCity.trim(),
      scheduledDeparture: toIso(form.scheduledDeparture),
      scheduledArrival: toIso(form.scheduledArrival),
      status: form.status,
      gate: form.gate.trim() || null,
      aircraftType: form.aircraftType.trim() || null,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        <Field
          label="Flight number"
          error={errors.flightNumber}
          value={form.flightNumber}
          onChange={(v) => update('flightNumber', v)}
          placeholder="FW1042"
          mono
        />
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status
          </span>
          <Select
            value={form.status}
            onChange={(v) => update('status', v)}
            options={STATUS_OPTIONS}
          />
        </label>

        <Field
          label="Origin code"
          error={errors.originCode}
          value={form.originCode}
          onChange={(v) => update('originCode', v)}
          placeholder="RIX"
          mono
        />
        <Field
          label="Origin city"
          error={errors.originCity}
          value={form.originCity}
          onChange={(v) => update('originCity', v)}
          placeholder="Riga"
        />

        <Field
          label="Destination code"
          error={errors.destinationCode}
          value={form.destinationCode}
          onChange={(v) => update('destinationCode', v)}
          placeholder="LHR"
          mono
        />
        <Field
          label="Destination city"
          error={errors.destinationCity}
          value={form.destinationCity}
          onChange={(v) => update('destinationCity', v)}
          placeholder="London"
        />

        <Field
          label="Scheduled departure"
          type="datetime-local"
          error={errors.scheduledDeparture}
          value={form.scheduledDeparture}
          onChange={(v) => update('scheduledDeparture', v)}
        />
        <Field
          label="Scheduled arrival"
          type="datetime-local"
          error={errors.scheduledArrival}
          value={form.scheduledArrival}
          onChange={(v) => update('scheduledArrival', v)}
        />

        <Field
          label="Gate"
          value={form.gate}
          onChange={(v) => update('gate', v)}
          placeholder="A3"
          mono
        />
        <Field
          label="Aircraft type"
          value={form.aircraftType}
          onChange={(v) => update('aircraftType', v)}
          placeholder="Airbus A220-300"
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          Save flight
        </button>
      </div>
    </form>
  )
}

function Field({ label, value, onChange, error, type = 'text', placeholder, mono }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 caret-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 ${
          error ? 'border-red-400' : 'border-slate-300'
        } ${mono ? 'font-mono' : ''}`}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}
