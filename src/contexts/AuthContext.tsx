import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

// ---------------------------------------------------------------------------
// Shape of the context value — what any component gets when it calls useAuth()
// ---------------------------------------------------------------------------
interface AuthContextType {
  session: Session | null  // the full Supabase session object (contains token etc.)
  user: User | null        // shortcut to session.user — the part you'll use most
  loading: boolean         // true while we're waiting for Supabase to confirm session
  signOut: () => Promise<void>
}

// ---------------------------------------------------------------------------
// The context itself — undefined by default.
// undefined (not null) is intentional: it lets useAuth() detect if a component
// is trying to consume the context without being wrapped in AuthProvider.
// ---------------------------------------------------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ---------------------------------------------------------------------------
// AuthProvider
// Wraps the whole app (in main.tsx). Manages session state in one place so
// every child component can read it without each making their own Supabase call.
// ---------------------------------------------------------------------------
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // getSession() checks for an existing session in localStorage (if the user
    // previously logged in and hasn't signed out). This is what prevents the
    // user from being logged out every time they refresh the page.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)  // we now know the session state; safe to render the app
    })

    // onAuthStateChange fires whenever the session changes:
    //   - user signs in  → session is populated
    //   - user signs out → session becomes null
    //   - token refreshes automatically → session is updated silently
    // This subscription keeps our state in sync with Supabase Auth at all times.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    // Cleanup: unsubscribe when the AuthProvider unmounts (prevents memory leaks)
    return () => subscription.unsubscribe()
  }, [])  // empty dependency array — runs once on mount, cleans up on unmount

  const signOut = async () => {
    await supabase.auth.signOut()
    // No need to setSession(null) manually here — onAuthStateChange fires
    // automatically after signOut() and updates state for us
  }

  const value: AuthContextType = {
    session,
    user: session?.user ?? null,  // null-safe shortcut to the user object
    loading,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// useAuth hook
// The only way components should consume this context. The undefined check
// gives a clear error message if someone forgets to wrap their component tree
// in AuthProvider — much better than a cryptic "cannot read property of null".
// ---------------------------------------------------------------------------
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth() must be used within an <AuthProvider>.')
  }
  return context
}
