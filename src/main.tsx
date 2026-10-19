import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ProjectBuilder from './ProjectBuilder'
import './styles.css'

createRoot(document.getElementById('root')!).render(<StrictMode><ProjectBuilder /></StrictMode>)
