import { retrieveMnemonic, useWallet } from "@/hooks/useWallet";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { useLocation } from "wouter";

/** Headless component which owns the root route. Navigates to the appropriate route based on internal checks */
export const Root = () => {
  const [, navigate] = useLocation();
  const { connected, setMnemonic } = useWallet();
  const posthog = usePostHog();

  // Some checks that occur right after this component mounts.
  useEffect(() => {
    // Check if the app state is already set up
    if (connected) {
      navigate("home");
      return;
    }

    // Check if the user is logged in (i.e. mnemonic is set in local storage).
    const storedMnemonic = retrieveMnemonic();
    if (storedMnemonic) {
      setMnemonic(storedMnemonic);
      posthog.capture("Autoloaded mnemonic from local storage");
      return;
    }

    navigate("setup");
  }, [connected, navigate, setMnemonic, posthog]);

  // No need to show anything - we just need useEffect to run and
  // redirect the user to the proper page.
  return <></>;
};
