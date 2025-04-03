import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { News } from './NewsApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <News />
  </StrictMode>,
)
