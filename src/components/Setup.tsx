import { useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useLocation } from "wouter";
import { usePostHog } from "posthog-js/react";
import { Alert } from "./ui/alert";

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
          <Alert variant="destructive">The secret phrase is not valid.</Alert>
        )}
        <Button disabled={!enteredMnemonic} onClick={importClicked}>
          Import
        </Button>
      </div>
    </div>
  );
}

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

    navigate("/backup/prompt");
  }, [wallet, navigate, posthog]);

  // const [phrase, setPhrase] = useState<string[]>([]);
  const createWallet = () => {
    const generatedMnemonic = newMnemonic();
    setWalletMnemonic(generatedMnemonic);
  };

  return (
    <div className="grid w-full gap-2">
      <Button onClick={createWallet}>Create Wallet</Button>
      <Button onClick={() => navigate("/import")}>Import Wallet</Button>
    </div>
  );
};
