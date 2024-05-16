import React from "react";
import ReactDOM from "react-dom/client";

import "./global.css";

import App from "@/components/App.tsx";
import { ErrorFallback } from "@/components/ErrorFallback.tsx";
import { ErrorBoundary } from "react-error-boundary";

import { WalletProvider } from "@/hooks/useWallet.tsx";
import { TronWebProvider } from "@/hooks/useTronWeb.tsx";

import { ThemeProvider } from "@/context/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <WalletProvider>
          <TronWebProvider>
            <App />
          </TronWebProvider>
        </WalletProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
