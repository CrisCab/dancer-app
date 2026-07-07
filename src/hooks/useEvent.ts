import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { EventDetail } from '../types'

// -----------------------------------------------------------------------------
// useEvent
// Fetches a single published event by ID, including full venue details and
// all ticket types (needed to render the ticket section on the detail page).
//
// .single() tells Supabase to return one object instead of an array.
// If the row doesn't exist or the status isn't 'published', Supabase returns
// an error, which we surface via the `error` return value.
// -----------------------------------------------------------------------------
export function useEvent(id: string) {
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvent() {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues (*),
          ticket_types (*)
        `)
        .eq('id', id)
        .eq('status', 'published')
        .single()

      if (error) {
        setError(error.message)
      } else {
        setEvent(data as EventDetail)
      }
      setLoading(false)
    }

    fetchEvent()
  }, [id])  // re-fetches if the id changes (e.g. navigating between event pages)

  return { event, loading, error }
}
