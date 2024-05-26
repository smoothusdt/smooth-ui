import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/Link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Page, PageContent, PageHeader } from "@/components/Page";

import {
  AlertCircle,
  CircleCheck,
  Loader2,
  ScanLineIcon,
  X,
} from "lucide-react";
import { motion, useAnimate } from "framer-motion";

import { useSmooth } from "@/hooks/useSmooth/useSmooth";
import { SmoothFee } from "@/constants";
import { getTronScanLink, shortenAddress } from "@/util";
import { useUSDTBalance } from "@/hooks/useUSDTBalance";
import { usePwa } from "@/hooks/usePwa";
import { usePostHog } from "posthog-js/react";
import { useWallet } from "@/hooks/useWallet";
import { BigNumber, TronWeb } from "tronweb";
import { CheckApprovalResult } from "@/hooks/useSmooth/approve";
import { Camera } from "./Camera";

/** Full page components which owns the send flow */
export const Send = () => {
  const posthog = usePostHog();
  const { connected } = useWallet();
  const [receiver, setReceiver] = useState("");
  const [sending, setSending] = useState(false);
  const [successfullySent, setSuccessfullySent] = useState(false);
  const [txID, setTxID] = useState("");
  const balance = useUSDTBalance();
  const { isOffline } = usePwa();
  const [checkApproval, transfer] = useSmooth();

  const [amountRaw, setAmountRaw] = useState<string>("");
  let amount = new BigNumber(amountRaw);
  if (amount.isNaN()) amount = new BigNumber(0);

  // Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const handleScanClicked = () => {
    setIsScanning(!isScanning);
  };

  // Animation
  const [sendButtonScope, sendButtonAnimate] = useAnimate();
  const [loaderScope, loaderAnimate] = useAnimate();
  const [inputScreenScope, inputScreenAnimate] = useAnimate();

  if (!connected) return; // wait until the wallet loads

  const isOverspending =
    balance !== undefined && amountRaw && amount.plus(SmoothFee).gt(balance);
  const receiverInvalid = receiver && !TronWeb.isAddress(receiver);

  let alert = "";
  if (isOverspending) {
    alert = "You can't send more than you have";
  } else if (receiverInvalid) {
    alert = '"To" is not a valid address';
  }

  const sendDisabled =
    sending ||
    amount.eq(0) ||
    receiver === "" ||
    isOverspending ||
    receiverInvalid ||
    isOffline;

  // The button is disabled until the data in the fields is valid, so we
  // can omit validation here.
  const handleTransferClicked = async () => {
    // Set up a fn that will execute the transfer so that we can toast this

    const doTransfer = async () => {
      // make sure the router is approved. Executes instantly if the approval
      // is granted and known in local storage.
      const [approvalGranted, checkApprovalResult] = await checkApproval();
      if (!approvalGranted) {
        console.error("Approval was not granted before sending!");
        posthog.capture("Approval was not granted before sending!", {
          approvalGranted,
          checkApprovalResult,
        });
        throw new Error("Something went wrong. Please try again.");
      }

      // Make an informational warning if we had to execute the approval just now.
      // Normally the approval executes in the background.
      if (checkApprovalResult !== CheckApprovalResult.AlreadyGranted) {
        console.warn("Approval was granted, but not in background");
        posthog.capture("Approval was granted, but not in background", {
          approvalGranted,
          checkApprovalResult,
        });
      }

      const res = await transfer(receiver, amount!);
      return res;
    };

    try {
      console.log("Sending");
      setSending(true);
      const doTransferPromise = doTransfer();
      await Promise.all([
        sendButtonAnimate(sendButtonScope.current, {
          width: 0,
          opacity: 0,
        }),
        loaderAnimate(
          loaderScope.current,
          {
            opacity: 1,
          },
          {
            delay: 0.25,
          },
        ),
      ]);

      const { txID } = await doTransferPromise;

      await inputScreenAnimate(inputScreenScope.current, {
        opacity: 0,
      });
      setTxID(txID);
      setSuccessfullySent(true);
    } catch (e) {
      posthog.capture("error", {
        error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
      });
      throw e;
    }
  };

  if (successfullySent)
    return (
      <Page>
        <PageHeader backPath="/home">Send</PageHeader>
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
      <PageHeader backPath="/home">Send</PageHeader>
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
                placeholder="TR7NHq...gjLj6t"
                disabled={sending}
                style={{
                  opacity: sending ? 0.6 : 1,
                }}
              />
              <Button
                variant="outline"
                onClick={handleScanClicked}
                disabled={sending}
              >
                {isScanning ? <X size={16} /> : <ScanLineIcon size={16} />}
              </Button>
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
            {isScanning && (
              <Camera
                onScan={(code) => {
                  setReceiver(code[0].rawValue);
                  setIsScanning(false);
                }}
              />
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
              ref={sendButtonScope}
              disabled={sendDisabled}
              onClick={handleTransferClicked}
            >
              Send
            </Button>
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
