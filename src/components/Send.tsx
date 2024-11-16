import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/Link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Page, PageContent, PageHeader } from "@/components/Page";
import { ScanButton } from "@/components/ScanButton";

import { AlertCircle, CircleCheck, Loader2 } from "lucide-react";
import { motion, useAnimate } from "framer-motion";

import { SmoothApiURL, SmoothFee } from "@/constants";
import { getTronScanLink, shortenAddress } from "@/util";
import { useUSDTBalance } from "@/hooks/useUSDTBalance";
import { usePostHog } from "posthog-js/react";
import { BigNumber, TronWeb } from "tronweb";
import { usePrivy } from "@privy-io/react-auth";
import { transferViaApi } from "@/smoothApi";
import { useWallet } from "@/hooks/useWallet";
import { Hex } from "viem";

function getAmountBigNumber(amountRaw: string): BigNumber {
  let formattedAmount = amountRaw.replace(",", "."); // for Russian keyboard

  if (formattedAmount.startsWith(".")) formattedAmount = "0" + formattedAmount; // allow stuff like ".3"
  if (formattedAmount.endsWith(".")) formattedAmount = formattedAmount + "0";

  let amount = new BigNumber(formattedAmount);
  if (amount.isNaN()) amount = new BigNumber(0);

  return amount;
}

/** Full page components which owns the send flow */
export const Send = () => {
  const posthog = usePostHog();
  const { signMessage, user } = usePrivy();
  const [receiver, setReceiver] = useState("");
  const [sending, setSending] = useState(false);
  const [successfullySent, setSuccessfullySent] = useState(false);
  const [txID, setTxID] = useState("");
  const [balance] = useUSDTBalance();
  const [amountRaw, setAmountRaw] = useState<string>("");
  const { tronUserAddress } = useWallet();

  const amount = getAmountBigNumber(amountRaw);

  // Animation
  const [sendButtonScope, sendButtonAnimate] = useAnimate();
  const [loaderScope, loaderAnimate] = useAnimate();
  const [inputScreenScope, inputScreenAnimate] = useAnimate();

  const isOverspending =
    balance !== undefined && amountRaw && amount.plus(SmoothFee).gt(balance);
  const receiverInvalid = Boolean(receiver && !TronWeb.isAddress(receiver));

  let alert = "";
  if (isOverspending) {
    alert = "You can't send more than you have";
  } else if (receiverInvalid) {
    alert = '"To" is not a valid Tron address';
  }

  const sendDisabled =
    sending ||
    amount.eq(0) ||
    receiver === "" ||
    isOverspending ||
    receiverInvalid;

  // The button is disabled until the data in the fields is valid, so we
  // can omit validation here.
  const handleTransferClicked = async () => {
    await transferViaApi(
      tronUserAddress!,
      "TKHaUJhihdPXHg3mDNFvV4tycvJvHNPRpc",
      new BigNumber("20"),
      user?.wallet?.address! as Hex,
      async (message: string) => await signMessage(message, { showWalletUIs: false })
    )
  };

  if (successfullySent)
    return (
      <Page>
        <PageHeader canGoBack>Send</PageHeader>
        <PageContent>
          <div key="sent" className="h-full flex flex-col justify-between">
            <div className="h-full flex flex-col justify-center items-center">
              <motion.div
                className="flex flex-col items-center"
                initial={{
                  scale: 0.5,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
              >
                <CircleCheck size={64} className="text-primary" />
                <p className="text-2xl mt-2 mb-4">USDT delivered.</p>
              </motion.div>
              <motion.div
                className="grid grid-cols-2 min-w-64 border-2 p-4 rounded border-current"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                  transition: {
                    duration: 0.6,
                    delay: 0.8,
                  },
                }}
              >
                <p>To:</p>
                <p className="text-right">{shortenAddress(receiver)}</p>
                <p>Amount:</p>
                <p className="text-right">{amountRaw} USDT</p>
                <p>Details:</p>
                <p className="text-right">
                  <Link href={getTronScanLink(txID)} target="_blank">
                    tronscan
                  </Link>
                </p>
              </motion.div>
            </div>
            <motion.div
              className="flex flex-col"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.6,
                  delay: 1.6,
                },
              }}
            >
              <Button onClick={() => window.location.reload()}>
                New transfer
              </Button>
            </motion.div>
          </div>
        </PageContent>
      </Page>
    );

  // Initial screen
  return (
    <Page>
      <PageHeader canGoBack>Send</PageHeader>
      <PageContent>
        <div
          key="inputing"
          className="h-full flex flex-col justify-between"
          ref={inputScreenScope}
        >
          <div className="flex flex-col gap-3">
            <Label
              htmlFor="text-input-to"
              style={{
                opacity: sending ? 0.6 : 1,
              }}
            >
              To
            </Label>
            <div className="flex w-full items-center space-x-2">
              <Input
                id="text-input-to"
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="TR7NHq..."
                disabled={sending}
                style={{
                  opacity: sending ? 0.6 : 1,
                }}
              />
              <ScanButton
                onScan={(code) => {
                  setReceiver(code);
                }}
              />
            </div>
            <Label
              htmlFor="text-input-amount"
              style={{
                opacity: sending ? 0.6 : 1,
              }}
            >
              Amount (USDT)
            </Label>
            <Input
              id="text-input-amount"
              type="number"
              inputMode="decimal"
              value={amountRaw}
              onChange={(e) => setAmountRaw(e.target.value)}
              min={0}
              placeholder="10"
              disabled={sending}
              style={{
                opacity: sending ? 0.6 : 1,
              }}
            />

            <span
              className="text-sm text-muted-foreground"
              style={{
                opacity: sending ? 0.6 : 1,
              }}
            >
              Fee: {SmoothFee.toString()}{" "}
              <span className="text-[0.5rem]">USDT</span>
            </span>
            {Boolean(amount) && (
              <span
                className="text-sm text-muted-foreground"
                style={{
                  opacity: sending ? 0.6 : 1,
                }}
              >
                Total: <strong>{amount.plus(SmoothFee).toString()}</strong>{" "}
                <span className="text-[0.5rem]">USDT</span>
              </span>
            )}
          </div>
          <div className="relative flex flex-col items-center gap-4">
            {alert && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Whoops</AlertTitle>
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            )}
            <Button
              className="w-full"
              onClick={handleTransferClicked}
            // disabled={sendDisabled}
            >Send</Button>
            <div
              className="absolute w-full h-full flex flex-col justify-center items-center"
              style={{
                display: sending ? "flex" : "none",
              }}
            >
              <Loader2
                ref={loaderScope}
                style={{ opacity: 0 }}
                className="h-4 w-4 animate-spin"
              />
            </div>
          </div>
        </div>
      </PageContent>
    </Page>
  );
};
