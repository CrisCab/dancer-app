import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

// ---------------------------------------------------------------------------
// LoginPage
// Handles both sign-in and sign-up in one form — toggled by `isSignUp` state.
// On success, navigates to / (which ProtectedRoute will allow through).
// On failure, displays Supabase's error message directly.
//
// Note: we call supabase.auth directly here rather than going through
// AuthContext — sign-in/up are one-off actions, not shared state. AuthContext
// picks up the resulting session automatically via onAuthStateChange.
// ---------------------------------------------------------------------------
export default function LoginPage() {
  const navigate = useNavigate()

  const [isSignUp, setIsSignUp]   = useState(false)
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()   // prevent default browser form submission / page reload
    setError(null)
    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        // Supabase sends a confirmation email by default.
        // For dev, you can disable this in Supabase Dashboard →
        // Authentication → Providers → Email → "Confirm email" toggle.
        // Once disabled, signUp() logs the user in immediately and
        // onAuthStateChange fires, which redirects them via the effect below.
        navigate('/')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        navigate('/')
      }
    }

    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {isSignUp ? 'Create an account' : 'Sign in'}
        </h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              style={styles.input}
            />
          </label>

          {/* Error message from Supabase — only rendered if error is set */}
          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading
              ? 'Please wait…'
              : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>

        {/* Toggle between sign in and sign up */}
        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(null) }}
          style={styles.toggle}
        >
          {isSignUp
            ? 'Already have an account? Sign in'
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Minimal inline styles — just enough to make the form usable.
// We'll replace these with a proper styling solution in the UI phase.
// ---------------------------------------------------------------------------
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '380px',
  },
  title: {
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  input: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.65rem',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  error: {
    color: '#c0392b',
    fontSize: '0.875rem',
    margin: 0,
  },
  toggle: {
    marginTop: '1rem',
    background: 'none',
    border: 'none',
    color: '#555',
    cursor: 'pointer',
    fontSize: '0.875rem',
    textDecoration: 'underline',
    padding: 0,
  },
}
