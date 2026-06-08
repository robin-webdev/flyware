import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Timetable from './pages/Timetable'
import Admin from './pages/Admin'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Routes>
          <Route path="/" element={<Timetable />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  )
}
