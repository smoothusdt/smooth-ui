import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorFallback } from './components/ErrorFallback.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import { Tron } from './components/Tron.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <Tron>
        <App />
      </Tron>
    </ErrorBoundary>
  </React.StrictMode>,
)
