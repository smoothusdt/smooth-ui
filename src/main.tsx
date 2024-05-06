import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TronWebProvider } from './hooks/useTronWeb.tsx'
import { ErrorFallback } from './components/ErrorFallback.tsx'
import { ErrorBoundary } from 'react-error-boundary'



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <TronWebProvider>
        <App />
      </TronWebProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
