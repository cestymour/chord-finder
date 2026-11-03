import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Polices auto-hébergées (pas de requête vers Google Fonts)
import '@fontsource/dm-mono/300.css'
import '@fontsource/dm-mono/300-italic.css'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/playfair-display/900.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
