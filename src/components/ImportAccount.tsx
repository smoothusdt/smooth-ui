import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { TronWeb } from "tronweb";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

export const ImportAccount = () => {
  const { setKey } = useWallet();
  const [mnemonic, setMnemonic] = useState("");

  const handleImportClicked = () => {
    setKey(TronWeb.fromMnemonic(mnemonic.trim()).privateKey);
  };

  const disabled = mnemonic === "";

  return (
    <div className="grid w-full gap-2">
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
      {/* <Button onClick={handleNewWalletClicked}>New wallet</Button> */}
    </div>
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

// Quick and dirty test of the tronWeb context
// const [phrase, setPhrase] = useState<string[]>([]);
// const handleNewWalletClicked = () => {
//   // TODO: Is this doing anything on the blockchain?
//   const p = tronWeb.createRandom();
//   setPhrase(p.mnemonic?.wordlist.split(p.mnemonic.phrase) ?? []);
// };

// const ConnectMessage = () => {
//   return (
//     <span>
//       Set a private key in{" "}
//       <strong>
//         <code>.env</code>
//       </strong>{" "}
//       to connect.
//     </span>
//   );
// };
