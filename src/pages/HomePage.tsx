import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const { user, signOut } = useAuth()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Dancer App</h1>
      <p style={styles.email}>Signed in as: {user?.email}</p>
      <Link to="/events" style={styles.eventsLink}>Browse Events →</Link>
      <button onClick={signOut} style={styles.button}>Sign out</button>
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
  eventsLink: {
    color: '#fff',
    fontWeight: 500,
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
