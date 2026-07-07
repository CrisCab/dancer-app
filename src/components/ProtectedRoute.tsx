import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ---------------------------------------------------------------------------
// ProtectedRoute
// Wrap any page component with this to require authentication.
// Usage in App.tsx:
//   <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
//
// Three possible states:
//   1. loading === true  → still waiting for Supabase to confirm session;
//                          render nothing (or a spinner) to avoid a flash
//                          of the login page for users who ARE logged in
//   2. session === null  → no authenticated user; redirect to /login
//   3. session exists    → render the protected child component normally
// ---------------------------------------------------------------------------
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  // Case 1: session check in progress — render nothing yet.
  // Without this guard, a logged-in user would briefly see the login page
  // on every refresh before the session is confirmed. This is called a
  // "flash of unauthenticated content" and it looks broken even if it fixes itself.
  if (loading) return null

  // Case 2: confirmed no session → redirect.
  // `replace` replaces the current history entry instead of pushing a new one,
  // so hitting the back button after login doesn't send the user back to /login.
  if (!session) return <Navigate to="/login" replace />

  // Case 3: session confirmed → render the protected page
  return <>{children}</>
}
