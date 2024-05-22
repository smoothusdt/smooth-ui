import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Back } from "@/components/Back";

import { Check, Copy } from "lucide-react";

import { useState } from "react";

import { QRCodeSVG } from "qrcode.react";
import { useCopyToClipboard } from "react-use";

export const Receive = () => {
  const [copied, setCopied] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();
  const { wallet } = useWallet();

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
    // TODO: Set some kind of error if hte copy fails
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <Back />
      <div className="py-9">
        <QRCodeSVG
          className="p-3 rotate-45 border-2 border-primary rounded-md"
          value={wallet?.address ?? ""}
        />
      </div>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          className="truncate"
          type="text"
          readOnly
          value={wallet?.address}
        />
        <Button onClick={handleCopyClicked}>
          {copied ? <Check /> : <Copy />}
        </Button>
      </div>
    </div>
  );
};
