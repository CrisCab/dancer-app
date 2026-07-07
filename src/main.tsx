import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import App from './App.tsx'

// ---------------------------------------------------------------------------
// Wrapper order matters here — outer wrappers are available to inner ones:
//
//   BrowserRouter — provides routing context; must be outside anything
//                   that uses useNavigate / useLocation / <Link>
//   AuthProvider  — provides session context; sits inside Router so that
//                   in future we could navigate from within AuthContext
//                   if needed (e.g. redirect on token expiry)
//   App           — the route tree; consumes both contexts above
// ---------------------------------------------------------------------------
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
