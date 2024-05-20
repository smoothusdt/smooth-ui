import { retrieveMnemonic, useWallet } from "@/hooks/useWallet";
import { useEffect } from "react";
import { useLocation } from "wouter";

export const Root = () => {
  const [, navigate] = useLocation();
  const { connected, setMnemonic } = useWallet();

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
      console.log("Set mnemonic from Root. Connection status:", connected);
      return;
    }

    navigate("setup");
  }, [connected]);

  // No need to show anything - we just need useEffect to run and
  // redirect the user to the proper page.
  return <div />;
};
