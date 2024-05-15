import { useWallet } from "@/hooks/useWallet";
import { Button } from "./ui/button";
import { ChevronLeft, ClipboardCheck, ClipboardCopy } from "lucide-react";
import { GoesBack } from "./Home";
import { Input } from "./ui/input";
import { useState } from "react";

import { QRCodeSVG } from "qrcode.react";
import { useCopyToClipboard } from "react-use";

export const Receive: React.FC<GoesBack> = (props) => {
  const [copied, setCopied] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();
  const { wallet } = useWallet();

  // Needs more investigation and testing https://web.dev/patterns/clipboard/copy-text
  const handleCopyClicked = () => {
    wallet?.address && copyToClipboard(wallet?.address);
    !state.error && setCopied(true); // IF all went well
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <Button
        variant="ghost"
        className="w-fit self-start"
        onClick={props.onBack}
      >
        <ChevronLeft /> Back
      </Button>
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
