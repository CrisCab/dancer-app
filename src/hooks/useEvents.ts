import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { EventSummary } from '../types'

// -----------------------------------------------------------------------------
// useEvents
// Fetches all published events, ordered by start time ascending.
// Returns only the columns each event card actually needs — title, dates,
// venue name/address, and ticket prices for the "from $X" label.
//
// This hook uses the anon key (no auth required) — matching the RLS policy
// we wrote: published events are publicly readable.
// -----------------------------------------------------------------------------
export function useEvents() {
  const [events, setEvents] = useState<EventSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          description,
          start_at,
          end_at,
          status,
          organizer_id,
          venue_id,
          created_at,
          updated_at,
          venues (
            name,
            address
          ),
          ticket_types (
            price_cents
          )
        `)
        .eq('status', 'published')
        .order('start_at', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        setEvents(data as EventSummary[])
      }
      setLoading(false)
    }

    fetchEvents()
  }, [])  // runs once on mount; events list doesn't need to re-fetch on the same page visit

  return { events, loading, error }
}
