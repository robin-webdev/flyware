import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/flights',
  headers: { 'Content-Type': 'application/json' },
})

export async function getFlights() {
  const { data } = await api.get('')
  return data
}

export async function getFlight(id) {
  const { data } = await api.get(`/${id}`)
  return data
}

export async function createFlight(flight) {
  const { data } = await api.post('', flight)
  return data
}

export async function updateFlight(id, flight) {
  const { data } = await api.put(`/${id}`, flight)
  return data
}

export async function deleteFlight(id) {
  await api.delete(`/${id}`)
}

export default api
