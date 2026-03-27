import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize theme
const savedTheme = localStorage.getItem('bookflow-storage');
if (savedTheme) {
  try {
    const parsed = JSON.parse(savedTheme);
    if (parsed.state?.theme) {
      document.documentElement.setAttribute('data-theme', parsed.state.theme);
    }
  } catch {
    document.documentElement.setAttribute('data-theme', 'light');
  }
} else {
  document.documentElement.setAttribute('data-theme', 'light');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
