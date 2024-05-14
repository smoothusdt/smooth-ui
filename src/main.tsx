import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorFallback } from "./components/ErrorFallback.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { Tron } from "./components/Tron.tsx";
import { WalletProvider } from "./hooks/useWallet.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <Tron>
        <WalletProvider>
          <App />
        </WalletProvider>
      </Tron>
    </ErrorBoundary>
  </React.StrictMode>,
);
