// =============================================================================
// Utility functions
// Pure functions with no side effects — easy to test and reuse anywhere.
// =============================================================================

// -----------------------------------------------------------------------------
// Date / time formatting
// We use toLocaleDateString / toLocaleTimeString with explicit options rather
// than a library like date-fns, since our needs are simple for now.
// All timestamps from Supabase are ISO strings — new Date(str) parses them.
// -----------------------------------------------------------------------------

// e.g. "Sat, Aug 15, 2026"
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// e.g. "8:30 PM"
export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

// e.g. "8:30 PM – 2:00 AM"
export function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTime(startIso)} – ${formatTime(endIso)}`
}

// -----------------------------------------------------------------------------
// Price formatting
// Input is always integer cents. Never do arithmetic on floats for money.
// e.g. 2000 → "$20.00"
// -----------------------------------------------------------------------------
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

// Returns the lowest price_cents across all ticket types, or null if none exist
export function minPrice(ticketTypes: { price_cents: number }[]): number | null {
  if (!ticketTypes.length) return null
  return Math.min(...ticketTypes.map(t => t.price_cents))
}

// -----------------------------------------------------------------------------
// Ticket availability
// Returns true if a ticket type is currently on sale.
// Checks both sale_starts_at and sale_ends_at against the current time.
// This mirrors the logic the purchase function will enforce server-side.
// -----------------------------------------------------------------------------
export function isTicketOnSale(ticket: {
  sale_starts_at: string | null
  sale_ends_at: string | null
}): boolean {
  const now = new Date()
  if (ticket.sale_starts_at && new Date(ticket.sale_starts_at) > now) return false
  if (ticket.sale_ends_at && new Date(ticket.sale_ends_at) < now) return false
  return true
}
