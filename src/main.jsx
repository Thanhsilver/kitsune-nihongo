import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initAudio } from './lib/audio.js'
import { loadStrokes } from './lib/strokes.js'
import { initMic } from './lib/mic.js'
initAudio(); loadStrokes(); initMic()
createRoot(document.getElementById('root')).render(<App />)
