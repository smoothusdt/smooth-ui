import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Page, PageContent, PageHeader } from "@/components/Page";

import { Check, Copy } from "lucide-react";

import { useState } from "react";

import { QRCodeSVG } from "qrcode.react";
import { useCopyToClipboard } from "react-use";

export const Receive = () => {
  const [copied, setCopied] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();
  const { tronUserAddress } = useWallet();

  // Needs more investigation and testing https://web.dev/patterns/clipboard/copy-text
  const handleCopyClicked = () => {
    tronUserAddress && copyToClipboard(tronUserAddress);

    if (!state.error) {
      // UI confirms the copy, then resets. This is a common pattern.
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
    // TODO: Set some kind of error if the copy fails
  };

  // TODO: Use CopyWallet Component?
  return (
    <Page>
      <PageHeader canGoBack>Receive</PageHeader>
      <PageContent>
        <div className="flex flex-col justify-center items-center gap-4">
          <p>Your USDT TRC-20 address</p>
          <div className="py-4">
            <QRCodeSVG
              className="w-40 h-40 p-3 border-2 border-primary rounded-md"
              value={tronUserAddress ?? ""}
              bgColor="#000000"
              fgColor="#ffffff"
            />
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              className="truncate"
              type="text"
              readOnly
              value={tronUserAddress}
            />
            <Button
              data-ph-capture-attribute-button-action="copy-address"
              onClick={handleCopyClicked}
            >
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
        </div>
      </PageContent>
    </Page>
  );
};
