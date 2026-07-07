import { Link } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import { formatDate, formatTime, formatPrice, minPrice } from '../lib/utils'

// -----------------------------------------------------------------------------
// EventsPage
// Public route — no auth required. Displays all published events as cards.
// Each card links to the event detail page at /events/:id.
// -----------------------------------------------------------------------------
export default function EventsPage() {
  const { events, loading, error } = useEvents()

  if (loading) return <div style={styles.centered}>Loading events…</div>
  if (error)   return <div style={styles.centered}>Error: {error}</div>
  if (!events.length) return <div style={styles.centered}>No upcoming events.</div>

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Upcoming Events</h1>

      <div style={styles.list}>
        {events.map(event => {
          const lowestPrice = minPrice(event.ticket_types)

          return (
            // Link wraps the entire card — tapping anywhere on the card navigates
            <Link key={event.id} to={`/events/${event.id}`} style={styles.link}>
              <div style={styles.card}>

                <div style={styles.cardHeader}>
                  <h2 style={styles.eventTitle}>{event.title}</h2>
                  {lowestPrice !== null && (
                    <span style={styles.price}>
                      From {formatPrice(lowestPrice)}
                    </span>
                  )}
                </div>

                <p style={styles.venue}>{event.venues.name}</p>

                <div style={styles.dateRow}>
                  <span>{formatDate(event.start_at)}</span>
                  <span style={styles.dot}>·</span>
                  <span>{formatTime(event.start_at)}</span>
                </div>

                <p style={styles.address}>{event.venues.address}</p>

              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '1.5rem 1rem',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.25rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  // Reset Link's default anchor styles
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1rem 1.25rem',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '0.5rem',
    marginBottom: '0.25rem',
  },
  eventTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    margin: 0,
  },
  price: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#2d6a4f',
    whiteSpace: 'nowrap',
  },
  venue: {
    margin: '0 0 0.5rem',
    fontSize: '0.95rem',
    color: '#444',
    fontWeight: 500,
  },
  dateRow: {
    display: 'flex',
    gap: '0.4rem',
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '0.25rem',
  },
  dot: {
    color: '#bbb',
  },
  address: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#999',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    color: '#666',
  },
}
