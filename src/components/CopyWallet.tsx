import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";
import { useCopyToClipboard } from "react-use";

/** Readonly input which displays the current wallet address along with a copy button */
export const CopyWallet = () => {
  const { wallet } = useWallet();
  const [copied, setCopied] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();

  // Needs more investigation and testing https://web.dev/patterns/clipboard/copy-text
  const handleCopyClicked = () => {
    wallet?.address && copyToClipboard(wallet?.address);

    if (!state.error) {
      // UI confirms the copy, then resets. This is a common pattern.
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
    // TODO: Set some kind of error if the copy fails
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        className="truncate"
        type="text"
        readOnly
        value={wallet?.address ?? ""}
      />
      <Button variant="outline" onClick={handleCopyClicked}>
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </Button>
    </div>
  );
};
