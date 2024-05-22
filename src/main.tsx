import React from "react";
import ReactDOM from "react-dom/client";

import "./global.css";

import App from "@/components/App.tsx";
import { ErrorFallback } from "@/components/ErrorFallback.tsx";
import { ErrorBoundary } from "react-error-boundary";

import { ThemeProvider } from "@/context/ThemeProvider";
import { WalletProvider } from "./context/WalletProvider";
import { TronWebProvider } from "./context/TronWebProdiver";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ThemeProvider>
        <WalletProvider>
          <TronWebProvider>
            <App />
          </TronWebProvider>
        </WalletProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
