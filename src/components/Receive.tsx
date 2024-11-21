import { useWallet } from "@/hooks/useWallet";
import { Page, PageContent, PageHeader } from "@/components/Page";

import { QRCodeSVG } from "qrcode.react";
import { DisplayedAddress } from "./DisplayedAddress";

export const Receive = () => {
  const { tronUserAddress } = useWallet();

  // TODO: Use CopyWallet Component?
  return (
    <Page>
      <PageHeader canGoBack>Receive</PageHeader>
      <PageContent>
        <div className="flex flex-col justify-center items-center gap-4">
          <p>Your USDT TRC-20 address</p>
          <div className="w-full">
            <DisplayedAddress address="TKHaUJhihdPXHg3mDNFvV4tycvJvHNPRpc" />
          </div>
          <div className="w-full max-w-xs px-8">
            <QRCodeSVG
              className="w-full h-full p-3 border-2 border-primary rounded-md"
              value={tronUserAddress ?? ""}
              bgColor="#000000"
              fgColor="#ffffff"
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Scan this QR code or share your wallet address to receive USDT.
          </p>
        </div>
      </PageContent>
    </Page>
  );
};
