import React from "react";
import ReactDOM from "react-dom/client";

import "./global.css";

import { App } from "@/components/App.tsx";
import { ErrorFallback } from "@/components/ErrorFallback.tsx";
import { ErrorBoundary } from "react-error-boundary";

import { ThemeProvider } from "@/context/ThemeProvider";
import { WalletProvider } from "@/context/WalletProvider";

// Initialize analytics
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
posthog.init("phc_5uiEHZeK6zsn4EVTnM179CH1ldnSmMfmoMzLPjHSnZI", {
  api_host: "https://us.i.posthog.com",
});

// Initialize i18n
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => (window.location.href = "/")}
      >
        <ThemeProvider>
          <WalletProvider>
            <App />
          </WalletProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </PostHogProvider>
  </React.StrictMode>,
);
