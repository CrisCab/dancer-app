import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'

// ---------------------------------------------------------------------------
// App
// Defines the route tree. BrowserRouter is provided in main.tsx, so App
// can focus purely on the route → component mapping.
//
// Current routes:
//   /login  → LoginPage      (public — no auth required)
//   /       → HomePage       (protected — redirects to /login if no session)
//
// As we add screens (event detail, organizer dashboard, etc.), new routes
// go here. Each protected screen gets wrapped in <ProtectedRoute>.
// ---------------------------------------------------------------------------
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
