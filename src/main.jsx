import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MoodTrackerApp from './MoodTrackerApp.jsx'
import { LanguageProvider } from './contexts/LanguageContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <MoodTrackerApp />
    </LanguageProvider>
  </StrictMode>,
)
