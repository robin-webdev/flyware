import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/flights",
});

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
