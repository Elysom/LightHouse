import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PaginaPrincipal from './paginas/PaginaPrincipal'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PaginaPrincipal />
  </StrictMode>,
)
