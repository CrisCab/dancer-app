import { useAuth } from '../contexts/AuthContext'

// ---------------------------------------------------------------------------
// HomePage — placeholder screen for now.
// Will become the event browsing feed in the next phase.
// Kept minimal intentionally: the goal right now is to confirm that
// AuthContext, ProtectedRoute, and routing all work end-to-end.
// ---------------------------------------------------------------------------
export default function HomePage() {
  const { user, signOut } = useAuth()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Dancer App</h1>
      <p style={styles.email}>Signed in as: {user?.email}</p>
      <button onClick={signOut} style={styles.button}>
        Sign out
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 600,
  },
  email: {
    color: '#555',
    fontSize: '0.95rem',
  },
  button: {
    padding: '0.5rem 1.25rem',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
}
