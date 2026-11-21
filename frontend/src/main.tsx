import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { bootstrapFromUrl } from './ai/bootstrapFromUrl'
import { loadCatalog } from './ai/catalog'
import { initDemoMode } from './config/demo'
import './index.css'
import App from './App.tsx'

initDemoMode()
bootstrapFromUrl()
void loadCatalog()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
