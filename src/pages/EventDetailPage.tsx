import { Link, useParams } from 'react-router-dom'
import { useEvent } from '../hooks/useEvent'
import { formatDate, formatTimeRange, formatPrice, isTicketOnSale } from '../lib/utils'

// -----------------------------------------------------------------------------
// EventDetailPage
// Public route — no auth required.
// useParams() extracts the :id segment from the URL (/events/:id).
// Displays full event info and all ticket types with availability status.
// No purchase button yet — that comes in the Stripe phase.
// -----------------------------------------------------------------------------
export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { event, loading, error } = useEvent(id!)

  if (loading) return <div style={styles.centered}>Loading…</div>
  if (error || !event) return (
    <div style={styles.centered}>
      <div>
        <p>Event not found.</p>
        <Link to="/events" style={styles.backLink}>← Back to events</Link>
      </div>
    </div>
  )

  return (
    <div style={styles.page}>

      {/* Back navigation */}
      <Link to="/events" style={styles.backLink}>← All events</Link>

      {/* Event header */}
      <h1 style={styles.title}>{event.title}</h1>

      <div style={styles.meta}>
        <p style={styles.metaItem}>
          📅 {formatDate(event.start_at)}
        </p>
        <p style={styles.metaItem}>
          🕐 {formatTimeRange(event.start_at, event.end_at)}
        </p>
        <p style={styles.metaItem}>
          📍 {event.venues.name}
        </p>
        <p style={styles.metaAddress}>
          {event.venues.address}
        </p>
      </div>

      {/* Description */}
      {event.description && (
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>About this event</h2>
          <p style={styles.description}>{event.description}</p>
        </div>
      )}

      {/* Ticket types */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeading}>Tickets</h2>

        {event.ticket_types.length === 0 ? (
          <p style={styles.noTickets}>No tickets available.</p>
        ) : (
          <div style={styles.ticketList}>
            {event.ticket_types.map(ticket => {
              const onSale = isTicketOnSale(ticket)
              return (
                <div
                  key={ticket.id}
                  style={{
                    ...styles.ticketCard,
                    opacity: onSale ? 1 : 0.5,
                  }}
                >
                  <div style={styles.ticketHeader}>
                    <span style={styles.ticketName}>{ticket.name}</span>
                    <span style={styles.ticketPrice}>
                      {formatPrice(ticket.price_cents)}
                    </span>
                  </div>

                  {ticket.description && (
                    <p style={styles.ticketDescription}>{ticket.description}</p>
                  )}

                  <p style={styles.ticketAvailability}>
                    {onSale ? 'On sale now' : 'Sales closed'}
                  </p>

                  {/* Purchase button placeholder — wired up in Stripe phase */}
                  <button
                    disabled={!onSale}
                    style={{
                      ...styles.buyButton,
                      backgroundColor: onSale ? '#1a1a1a' : '#ccc',
                      cursor: onSale ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {onSale ? 'Buy ticket' : 'Unavailable'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
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
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    color: '#666',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '1.25rem',
    fontSize: '0.9rem',
    color: '#555',
    textDecoration: 'none',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    margin: '0 0 1rem',
  },
  meta: {
    marginBottom: '1.5rem',
  },
  metaItem: {
    margin: '0 0 0.4rem',
    fontSize: '0.95rem',
    color: '#333',
  },
  metaAddress: {
    margin: '0.1rem 0 0 1.5rem',
    fontSize: '0.85rem',
    color: '#888',
  },
  section: {
    marginTop: '1.75rem',
  },
  sectionHeading: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '0.4rem',
  },
  description: {
    fontSize: '0.95rem',
    color: '#444',
    lineHeight: 1.6,
    margin: 0,
  },
  noTickets: {
    color: '#888',
    fontSize: '0.9rem',
  },
  ticketList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  ticketCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#fff',
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.25rem',
  },
  ticketName: {
    fontWeight: 600,
    fontSize: '1rem',
  },
  ticketPrice: {
    fontWeight: 700,
    fontSize: '1rem',
    color: '#2d6a4f',
  },
  ticketDescription: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0.25rem 0 0.5rem',
  },
  ticketAvailability: {
    fontSize: '0.8rem',
    color: '#888',
    margin: '0 0 0.75rem',
  },
  buyButton: {
    width: '100%',
    padding: '0.6rem',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.95rem',
  },
}
