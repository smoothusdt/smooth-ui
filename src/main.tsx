import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App.tsx";
import { ErrorFallback } from "./components/ErrorFallback.tsx";
import { ErrorBoundary } from "react-error-boundary";

import { WalletProvider } from "./hooks/useWallet.tsx";
import { TronWebProvider } from "./hooks/useTronWeb.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <WalletProvider>
        <TronWebProvider>
          <App />
        </TronWebProvider>
      </WalletProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
