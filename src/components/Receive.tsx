import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Back } from "@/components/Back";

import { ClipboardCheck, ClipboardCopy } from "lucide-react";

import { useState } from "react";

import { QRCodeSVG } from "qrcode.react";
import { useCopyToClipboard } from "react-use";
import { useSmooth } from "@/hooks/useSmooth/useSmooth";

export const Receive = () => {
  const [copied, setCopied] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();
  const { wallet } = useWallet();
  const [checkApproval, _] = useSmooth();
  checkApproval(); // fire and forget

  // Needs more investigation and testing https://web.dev/patterns/clipboard/copy-text
  const handleCopyClicked = () => {
    wallet?.address && copyToClipboard(wallet?.address);
    !state.error && setCopied(true); // IF all went well
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
          {copied ? <ClipboardCheck /> : <ClipboardCopy />}
        </Button>
      </div>
    </div>
  );
};
