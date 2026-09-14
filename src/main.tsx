import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { I18nProvider } from './contexts/I18nContext'
import { inject } from '@vercel/analytics'
import './index.css'

inject();

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)
