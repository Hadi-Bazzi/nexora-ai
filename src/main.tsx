import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './accessibility.css'
import './enhancements.css'
import './readability.css'
import './assistant.css'
import './services-gallery.css'
import './workflow-showcase.css'
import './creative-direction.css'
import './hero-atmosphere.css'
import './scroll-visual.css'
import 'lenis/dist/lenis.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
