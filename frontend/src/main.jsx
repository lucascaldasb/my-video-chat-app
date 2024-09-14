import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App'
import './index.css'
import reportWebVitals from './reportWebVitals'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

reportWebVitals()
