import { useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Back } from "./Back";
import { useLocation } from "wouter";
import { usePostHog } from "posthog-js/react";

export const SetupWallet = () => {
  const posthog = usePostHog();
  const [, navigate] = useLocation();
  const { setMnemonic: setWalletMnemonic, newMnemonic, wallet } = useWallet();
  const [mnemonic, setMnemonic] = useState("");
  const [importing, setImporting] = useState(false); // TODO: More sophisticated routing

  // Using a useEffect to wait until the `wallet` variable updates
  // to log the wallet address to posthog.
  useEffect(() => {
    if (!wallet) return;

    posthog.capture("Finished wallet setup", {
      $set: {
        walletAddress: wallet?.address || "unknown",
        walletImported: importing,
      },
    });
    navigate("home");
  }, [wallet, importing, navigate, posthog]);

  const handleImportClicked = () => {
    setWalletMnemonic(mnemonic.trim());
  };

  // const [phrase, setPhrase] = useState<string[]>([]);
  const handleNewWalletClicked = () => {
    const generatedMnemonic = newMnemonic();
    setWalletMnemonic(generatedMnemonic);
  };

  const disabled = mnemonic === "";

  return importing ? (
    <div className="grid w-full gap-2">
      <Back onClick={() => setImporting(false)} />
      <Label htmlFor="seed-phrase">Import from seed phrase</Label>
      <Textarea
        id="seed-phrase"
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
        placeholder="this is my seed phrase"
        style={{ resize: "none" }}
      />
      <Button disabled={disabled} onClick={handleImportClicked}>
        Import
      </Button>
    </div>
  ) : (
    <div className="grid w-full gap-2">
      <Button onClick={() => setImporting(true)}>Import a wallet</Button>
      <Button onClick={handleNewWalletClicked}>Create a wallet</Button>
      {import.meta.env.DEV && <EnvConnectMessage />}
    </div>
  );
};

const EnvConnectMessage = () => {
  return (
    <span className="text-sm text-muted-foreground">
      Or set a private key in{" "}
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
        .env
      </code>{" "}
      to connect.
    </span>
  );
};
