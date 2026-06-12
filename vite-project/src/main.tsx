import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './features/auth'
import { setTokenProvider } from './shared/api/apiClient'
import { readStoredAuth } from './features/auth/model/Auth.storage'

setTokenProvider(() => readStoredAuth()?.token ?? null)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
