import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { TronWeb } from "tronweb";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { ChevronLeft } from "lucide-react";

export const ImportAccount = () => {
  const { setKey } = useWallet();
  const [mnemonic, setMnemonic] = useState("");
  const [importing, setImporting] = useState(false); // TODO: More sophisticated routing

  const handleImportClicked = () => {
    setKey(TronWeb.fromMnemonic(mnemonic.trim()).privateKey);
  };

  // const [phrase, setPhrase] = useState<string[]>([]);
  const handleNewWalletClicked = () => {
    // TODO: Is this doing anything on the blockchain?
    // const p = tronWeb.createRandom();
    // setPhrase(p.mnemonic?.wordlist.split(p.mnemonic.phrase) ?? []);
  };

  const disabled = mnemonic === "";

  return importing ? (
    <div className="grid w-full gap-2">
      <Button
        variant="ghost"
        className="w-fit self-start"
        onClick={() => setImporting(false)}
      >
        <ChevronLeft /> Back
      </Button>
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
      <Button disabled={true} onClick={handleNewWalletClicked}>
        Create a wallet
      </Button>
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
