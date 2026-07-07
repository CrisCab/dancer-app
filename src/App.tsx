import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'

// ---------------------------------------------------------------------------
// App — route tree
// Public routes: /login, /events, /events/:id
// Protected routes: /
// ---------------------------------------------------------------------------
export default function App() {
  return (
    <Routes>
      <Route path="/login"        element={<LoginPage />} />
      <Route path="/events"       element={<EventsPage />} />
      <Route path="/events/:id"   element={<EventDetailPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
