import ReactDOM from "react-dom/client";

import { Buffer } from 'buffer';
window.Buffer = Buffer;

import "./global.css";
import { WalletProvider } from "@/hooks/useWallet"
import { App } from "@/components/App.tsx";
import { ErrorFallback } from "@/components/ErrorFallback.tsx";
import { ErrorBoundary } from "react-error-boundary";


// Initialize analytics
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
// Posthog needs to be initialized here. Disabled as I am not
// working on Smooth USDT right now.

// Initialize i18n
import "./i18n";
import { PreferencesProvider } from "./hooks/usePreferences";
import { SignerProvider } from "./hooks/useSigner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PostHogProvider client={posthog}>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => (window.location.href = "/")}
    >
      <PreferencesProvider>
        <SignerProvider>
          <WalletProvider>
            <App />
          </WalletProvider>
        </SignerProvider>
      </PreferencesProvider>
    </ErrorBoundary>
  </PostHogProvider>
);
