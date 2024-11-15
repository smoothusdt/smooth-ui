import React from "react";
import ReactDOM from "react-dom/client";

import { Buffer } from 'buffer';
window.Buffer = Buffer;

import "./global.css";

import { App } from "@/components/App.tsx";
import { ErrorFallback } from "@/components/ErrorFallback.tsx";
import { ErrorBoundary } from "react-error-boundary";

import { PrivyProvider } from '@privy-io/react-auth';


// Initialize analytics
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (window.location.hostname !== "localhost") {
  posthog.init("phc_5uiEHZeK6zsn4EVTnM179CH1ldnSmMfmoMzLPjHSnZI", {
    api_host: "https://us.i.posthog.com",
  });
}

// Initialize i18n
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => (window.location.href = "/")}
      >
        <PrivyProvider
          appId="cm3g27pox00mj12g3i951p7mq"
          config={{
            // Customize Privy's appearance in your app
            appearance: {
              theme: 'dark',
              accentColor: '#339192',
              logo: '/logo.svg',
            },
            // Create embedded wallets for users who don't have a wallet
            embeddedWallets: {
              createOnLogin: 'users-without-wallets',
            },
          }}
        >
          <App />
        </PrivyProvider>
      </ErrorBoundary>
    </PostHogProvider>
  </React.StrictMode>,
);
