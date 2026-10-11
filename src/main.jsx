import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { startAnalytics } from './analytics/analytics'

// Android already has the Play Store app, so stop Chrome's "Install Arjun Guruji"
// prompt from offering the website as a second app. iPhone users get a hint on Home.
window.addEventListener('beforeinstallprompt', (event) => event.preventDefault())

// Only does anything if the visitor allowed usage statistics on an earlier visit.
startAnalytics()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <App />
  </React.StrictMode>,
)
