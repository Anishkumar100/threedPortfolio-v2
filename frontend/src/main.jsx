import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useGLTF } from '@react-three/drei'

// ── MUST be set BEFORE preload calls — decoder needed for Draco compressed GLBs
useGLTF.setDecoderPath('/draco/')

useGLTF.preload('/models/batman_the_dark_knight_batarang.glb')
useGLTF.preload('/models/superman.glb')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
