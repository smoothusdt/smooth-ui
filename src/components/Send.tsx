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
import {
  motion,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";

import { useSmooth } from "@/hooks/useSmooth/useSmooth";
import { SmoothFee } from "@/constants";
import { getTronScanLink, shortenAddress } from "@/util";
import { useUSDTBalance } from "@/hooks/useUSDTBalance";
import { usePwa } from "@/hooks/usePwa";
import { usePostHog } from "posthog-js/react";
import { useWallet } from "@/hooks/useWallet";
import { TronWeb } from "tronweb";
import { CheckApprovalResult } from "@/hooks/useSmooth/approve";
import { Camera } from "./Camera";
import { StepByStepLoader } from "./Animator";

enum SendingStage {
  Initial,
  Sending,
  Sent,
}

/** Full page components which owns the send flow */
export const Send = () => {
  const posthog = usePostHog();
  const { connected, wallet } = useWallet();
  const [receiver, setReceiver] = useState(wallet!.address);
  const [stage, setStage] = useState(SendingStage.Initial);
  const balance = useUSDTBalance();
  const { isOffline } = usePwa();
  const [checkApproval, transfer] = useSmooth();

  const [amountRaw, setAmountRaw] = useState<string>("5");
  const amount = parseInt(amountRaw) || 0;

  // Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const handleScanClicked = () => {
    setIsScanning(!isScanning);
  };

  // Initial screen animations
  const [initialScreenAnimating, setInitialScreenAnimating] = useState(false);
  const [initialScreenScope, initialScreenAnimate] = useAnimate();
  const [sendButtonScope, sendButtonAnimate] = useAnimate();

  // Send screen animations
  const [sendScreenScope, sendScreenAnimate] = useAnimate();

  if (!connected) return; // wait until the wallet loads

  const isOverspending =
    balance !== undefined && amountRaw && amount + SmoothFee > balance;
  const receiverInvalid = receiver && !TronWeb.isAddress(receiver);

  let alert = "";
  if (isOverspending) {
    alert = "You can't send more than you have";
  } else if (receiverInvalid) {
    alert = '"To" is not a valid address';
  }

  const sendDisabled =
    initialScreenAnimating ||
    stage !== SendingStage.Initial ||
    amount === 0 ||
    receiver === "" ||
    isOverspending ||
    receiverInvalid ||
    isOffline;

  // The button is disabled until the data in the fields is valid, so we
  // can omit validation here.
  const handleTransferClicked = async () => {
    // Set up a fn that will execute the transfer so that we can toast this
    try {
      console.log("Before initial screen fade out");
      setInitialScreenAnimating(true);
      await initialScreenAnimate(initialScreenScope.current, {
        opacity: 0,
      });
      await sendButtonAnimate(
        sendButtonScope.current,
        {
          width: 0,
          opacity: 0,
        },
        {
          duration: 0.6,
        },
      );
      console.log("Afrer initial screen fade out");
      setStage(SendingStage.Sending);
      console.log("Set stage Sending");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Waited");
      await sendScreenAnimate(
        sendScreenScope.current,
        {
          opacity: 0,
        },
        {
          duration: 0.6,
        },
      );
      console.log("Send screen faded out");
      setStage(SendingStage.Sent);
      console.log("Set stage Sent");
      return;

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
    } catch (e) {
      posthog.capture("error", {
        error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
      });
      throw e;
    }
  };

  if (stage == SendingStage.Sending)
    return (
      <Page>
        <PageHeader backPath="/home">Send</PageHeader>
        <PageContent>
          <motion.div
            ref={sendScreenScope}
            className="h-full flex flex-col justify-center items-center"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.6,
              },
            }}
          >
            <Loader2 className="h-8 w-8 animate-spin" />
          </motion.div>
        </PageContent>
      </Page>
    );

  if (stage == SendingStage.Sent)
    return (
      <Page>
        <PageHeader backPath="/home">Send</PageHeader>
        <PageContent>
          <div className="h-full flex flex-col justify-between">
            <div className="h-full flex flex-col justify-center items-center">
              <StepByStepLoader>
                <CircleCheck size={64} className="text-primary" />
                <p className="text-2xl mt-2 mb-4">USDT sent successfully.</p>
                <div className="grid grid-cols-2 min-w-64 border-2 p-4 rounded border-current">
                  <p>To:</p>
                  <p className="text-right">{shortenAddress(receiver)}</p>
                  <p>Amount:</p>
                  <p className="text-right">{amountRaw} USDT</p>
                  <p>Details:</p>
                  <p className="text-right">
                    <Link href={getTronScanLink("mhm")} target="_blank">
                      tronscan
                    </Link>
                  </p>
                </div>
              </StepByStepLoader>
            </div>
            <motion.div
              className="flex flex-col"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.5,
                  delay: 0.3 * 3,
                },
              }}
            >
              <Button onClick={() => window.location.reload()}>
                Send again
              </Button>
            </motion.div>
          </div>
        </PageContent>
      </Page>
    );

  // Sending stage - initial
  return (
    <Page>
      <PageHeader backPath="/home">Send</PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-3" ref={initialScreenScope}>
            <Label htmlFor="text-input-to">To</Label>
            <div className="flex w-full items-center space-x-2">
              <Input
                id="text-input-to"
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="TR7NHq...gjLj6t"
              />
              <Button variant="outline" onClick={handleScanClicked}>
                {isScanning ? <X size={16} /> : <ScanLineIcon size={16} />}
              </Button>
            </div>
            <Label htmlFor="text-input-amount">Amount (USDT)</Label>
            <Input
              id="text-input-amount"
              type="number"
              inputMode="decimal"
              value={amountRaw}
              onChange={(e) => setAmountRaw(e.target.value)}
              min={0}
              placeholder="10"
            />

            <span className="text-sm text-muted-foreground">
              Fee: {SmoothFee} <span className="text-[0.5rem]">USDT</span>
            </span>
            {Boolean(amount) && (
              <span className="text-sm text-muted-foreground">
                Total: <strong>{amount + SmoothFee}</strong>{" "}
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
          <div className="flex flex-col items-center gap-4">
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
          </div>
        </div>
      </PageContent>
    </Page>
  );
};
