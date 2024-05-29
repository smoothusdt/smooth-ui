import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Page, PageContent, PageHeader } from "@/components/Page";
import { TermsOfUse } from "@/components/TermsOfUse";

import { ArrowDownCircle, PlusCircle } from "lucide-react";

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
    navigate("/backup/prompt", { replace: true });
  }, [wallet, navigate, posthog]);

  // When create is clicked, generate mnemonic and set it
  // This fires the useEffect above to navigate to the next step
  const handleCreateWalletClicked = () => {
    const generatedMnemonic = newMnemonic();
    setWalletMnemonic(generatedMnemonic);
  };

  return (
    <Page>
      <PageHeader>
        <span>
          smooth <span className="text-xs text-muted-foreground"> USDT</span>
        </span>
      </PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-between">
          <div /> {/* for flex alignment */}
          <div className="flex flex-col gap-4 items-center">
            <img
              src="/logo.svg"
              alt="SmoothUSDT Icon"
              className="size-16 self-center"
            />
            <p className="text-2xl text-center">
              Welcome to SmoothUSDT
              <br />
              <span className="text-sm text-center text-muted-foreground">
                Choose one of the following to get started
              </span>
            </p>
            <div className="flex flex-col gap-4 w-fit">
              <Button
                variant="outline"
                onClick={handleCreateWalletClicked}
                className="h-fit p-4 bg-muted justify-start text-wrap"
              >
                <PlusCircle className="mr-4 size-6 flex-shrink-0" />
                <div className="flex flex-col items-start text-start">
                  <span className="text-md">Create a new wallet</span>
                  <span className="text-xs text-muted-foreground font-light">
                    A new TRC-20 address to send and receive USDT
                  </span>
                </div>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/import", { replace: true })}
                className="h-fit p-4 bg-muted justify-start text-wrap"
              >
                <ArrowDownCircle className="mr-4 size-6 flex-shrink-0" />
                <div className="flex flex-col items-start text-start">
                  <span className="text-md">Add an existing wallet</span>
                  <span className="text-xs text-muted-foreground font-light">
                    Connect or restore a wallet from a secret phrase
                  </span>
                </div>
              </Button>
            </div>
          </div>
          <span className="text-xs text-muted-foreground font-light text-center">
            By creating or importing a wallet, you agree to the SmoothUSDT{" "}
            <TermsOfUse>
              <Button variant="link" className="text-xs font-light p-0">
                Terms of Use
              </Button>
            </TermsOfUse>
          </span>
        </div>
      </PageContent>
    </Page>
  );
};
