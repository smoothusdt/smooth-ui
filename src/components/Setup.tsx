import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Back } from "./Back";
import { TronWeb } from "tronweb";
import { useLocation } from "wouter";

export const SetupWallet = () => {
  const [, navigate] = useLocation();
  const { setMnemonic: setWalletMnemonic, newMnemonic } = useWallet();
  const [mnemonic, setMnemonic] = useState("");
  const [importing, setImporting] = useState(false); // TODO: More sophisticated routing

  const handleImportClicked = () => {
    setWalletMnemonic(mnemonic.trim());
    navigate("home");
  };

  // const [phrase, setPhrase] = useState<string[]>([]);
  const handleNewWalletClicked = () => {
    const generatedMnemonic = newMnemonic();
    setWalletMnemonic(generatedMnemonic);
    navigate("home");
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

/**
 * Quick and dirty component to display the mnemonic
 */
// const WordList = (props: { list: string[] }) => {
//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(3, 1fr)",
//         gridTemplateRows: "repeat(4, 1fr)",
//         gap: 8,
//       }}
//     >
//       {props.list.map((word) => (
//         <div
//           style={{ background: "rgba(184, 184, 184, 0.1)", borderRadius: 4 }}
//         >
//           {word}
//         </div>
//       ))}
//     </div>
//   );
// };
