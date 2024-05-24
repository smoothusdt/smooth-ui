import { useState, useEffect } from "react";

import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Page, PageContent, PageHeader } from "@/components/Page";

import { useWallet } from "@/hooks/useWallet";
import { usePostHog } from "posthog-js/react";
import { useLocation } from "wouter";

export function ImportWallet() {
  const posthog = usePostHog();
  const [, navigate] = useLocation();
  const { wallet, setMnemonic } = useWallet();
  const [enteredMnemonic, setEnteredMnemonic] = useState("");
  const [isProblem, setIsProblem] = useState(false);

  // Using a useEffect to wait until the `wallet` variable updates
  // to log the wallet address to posthog.
  useEffect(() => {
    if (!wallet) return;

    posthog.capture("Finished wallet setup", {
      $set: {
        walletAddress: wallet?.address || "unknown",
        walletImported: true,
      },
    });

    navigate("/home");
  }, [wallet, navigate, posthog]);

  const importClicked = () => {
    try {
      setMnemonic(enteredMnemonic);
    } catch (err) {
      // Can't send to posthog because there maybe secret phrase inside the error object
      console.error("Error while importing mnemonic", err);
      setIsProblem(true);
    }
  };

  return (
    <Page>
      <PageHeader hasBack> Import Wallet</PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <Label htmlFor="mnemonic">Import Secret Phrase</Label>
            <Textarea
              id="mnemonic"
              value={enteredMnemonic}
              onChange={(e) => setEnteredMnemonic(e.target.value)}
              placeholder="this is my secret phrase"
              style={{ resize: "none" }}
            />
          </div>
          <div className="flex flex-col gap-4">
            {isProblem && (
              <Alert variant="destructive">
                The secret phrase is not valid.
              </Alert>
            )}
            <Button disabled={!enteredMnemonic} onClick={importClicked}>
              Import
            </Button>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}
