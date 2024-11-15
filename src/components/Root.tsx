import { usePrivy } from "@privy-io/react-auth";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { useLocation } from "wouter";

/** Navigates the user to the appropriate route */
export const Root = () => {
  const [, navigate] = useLocation();
  const posthog = usePostHog();
  const { authenticated } = usePrivy();

  useEffect(() => {
    if (authenticated) { // already logged in!
      return navigate("home");
    }

    navigate("welcome");
  }, [navigate, authenticated, posthog]);

  // No need to show anything - we just need useEffect to run and
  // redirect the user to the proper page.
  return <></>;
};
