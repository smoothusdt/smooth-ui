import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TronWebProvider } from './hooks/useTronWeb.tsx'



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TronWebProvider>
      <App />
    </TronWebProvider>
  </React.StrictMode>,
)
