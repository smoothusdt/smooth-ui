import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Page, PageContent, PageHeader } from "@/components/Page";

import { useWallet } from "@/hooks/useWallet";
import { useLocation } from "wouter";
import { usePostHog } from "posthog-js/react";

/** Full page component displaying two buttons which start the user on either a create or import flow */
export const SetupWallet = () => {
  const posthog = usePostHog();
  const [, navigate] = useLocation();
  const { setMnemonic: setWalletMnemonic, newMnemonic, wallet } = useWallet();

  // Using a useEffect to wait until the `wallet` variable updates
  // to log the wallet address to posthog.
  useEffect(() => {
    if (!wallet) return;

    posthog.capture("Finished wallet setup", {
      $set: {
        walletAddress: wallet?.address || "unknown",
        walletImported: false, // a new one was created
      },
    });

    // Navigate to the backup flow when a wallet is created
    navigate("/backup/prompt");
  }, [wallet, navigate, posthog]);

  // When create is clicked, generate mnemonic and set it
  // This fires the useEffect above to navigate to the next step
  const handleCreateWalletClicked = () => {
    const generatedMnemonic = newMnemonic();
    setWalletMnemonic(generatedMnemonic);
  };

  return (
    <Page>
      <PageHeader hasBack>
        <span>
          smooth <span className="text-xs text-muted-foreground"> USDT</span>
        </span>
      </PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-between">
          <div /> {/* for flex alignment */}
          <p className="text-2xl text-center">
            Welcome to smooth
            <br />
            <span className="text-sm text-center text-muted-foreground">
              Choose one of the following to get started.
            </span>
          </p>
          <div className="flex flex-col gap-4">
            <Button onClick={handleCreateWalletClicked}>Create Wallet</Button>
            <Button onClick={() => navigate("/import")}>Import Wallet</Button>
          </div>
        </div>
      </PageContent>
    </Page>
  );
};
