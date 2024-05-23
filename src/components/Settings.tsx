import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { DeleteWalletButton } from "@/components/DeleteWalletButton";

import { useWallet } from "@/hooks/useWallet";
import { useLocation } from "wouter";

/** Full page component for displaying all the settings of Smooth USDT PWA */
export const Settings = () => {
  const [, navigate] = useLocation();
  const { connected } = useWallet();

  // The user wallet is not set up or the user has deleted their wallet.
  // Cant do anything on this screen.
  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected, navigate]);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span>Color Theme</span>
        <ThemeSwitch />
      </div>
      <Button variant="secondary" onClick={() => navigate("/backup/start")}>
        Backup Secret Phrase
      </Button>
      <DeleteWalletButton />
    </div>
  );
};
