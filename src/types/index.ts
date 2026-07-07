// =============================================================================
// Database types
// These mirror the columns in our Supabase tables. Keeping them here means
// if we ever change the schema, there's one place to update the types.
//
// Note on timestamptz: Supabase returns these as ISO 8601 strings
// (e.g. "2026-08-15T20:30:00+00:00"), not Date objects. We convert them
// to Date objects only when we need to format or compare them.
// =============================================================================

export interface Venue {
  id: string
  name: string
  address: string
  latitude: number | null
  longitude: number | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface TicketType {
  id: string
  event_id: string
  name: string
  description: string | null
  price_cents: number
  capacity: number | null      // null = unlimited
  quantity_sold: number
  sale_starts_at: string | null  // null = on sale immediately
  sale_ends_at: string | null    // null = no explicit cutoff
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  organizer_id: string
  venue_id: string
  title: string
  description: string | null
  start_at: string
  end_at: string
  status: 'draft' | 'published' | 'cancelled'
  created_at: string
  updated_at: string
}

// =============================================================================
// Joined types — shapes returned by specific Supabase nested select() calls
//
// Supabase returns related rows as nested objects/arrays, not flat columns:
//   to-one  (events → venues via venue_id)    → venues is an OBJECT {}
//   to-many (events → ticket_types via event_id) → ticket_types is an ARRAY []
//
// These types capture exactly what each query returns — no more, no less.
// We avoid selecting more columns than we need (better for performance and
// clearer about what each page actually uses).
// =============================================================================

// Used by EventsPage (list view) — only needs venue name and min ticket price
export interface EventSummary extends Event {
  venues: Pick<Venue, 'name' | 'address'>
  ticket_types: Pick<TicketType, 'price_cents'>[]
}

// Used by EventDetailPage — needs full venue and all ticket type details
export interface EventDetail extends Event {
  venues: Venue
  ticket_types: TicketType[]
}
