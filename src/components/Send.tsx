import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/Link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { AlertCircle, Loader2 } from "lucide-react";

import toast, { Toaster } from "react-hot-toast";

import { useSmooth } from "@/hooks/useSmooth/useSmooth";
import { SmoothFee } from "@/constants";
import { getTronScanLink } from "@/util";
import { useUSDTBalance } from "@/hooks/useUSDTBalance";
import { usePwa } from "@dotmind/react-use-pwa";
import { usePostHog } from "posthog-js/react";
import { useWallet } from "@/hooks/useWallet";
import { useLocation } from "wouter";
import { TronWeb } from "tronweb";

export const Send = () => {
  const posthog = usePostHog();
  const { connected } = useWallet();
  const [, navigate] = useLocation();
  const [receiver, setReceiver] = useState("");
  const [sending, setSending] = useState(false);
  const balance = useUSDTBalance();
  const { isOffline } = usePwa();
  const [checkApproval, transfer] = useSmooth();

  const [amountRaw, setAmountRaw] = useState<string>("");
  const amount = parseInt(amountRaw) || 0;

  // The user wallet is not set up - cant do anything on this screen
  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected, navigate]);

  const isOverspending = balance !== undefined && amount + SmoothFee > balance;
  const receiverInvalid = receiver && !TronWeb.isAddress(receiver);

  let alert = "";
  if (isOverspending) {
    alert = "You can't send more than you have";
  } else if (receiverInvalid) {
    alert = '"To" is not a valid address';
  }

  const sendDisabled =
    sending ||
    amount === 0 ||
    receiver === "" ||
    isOverspending ||
    receiverInvalid ||
    isOffline;

  const reset = () => {
    setAmountRaw("");
    setReceiver("");
    setSending(false);
  };

  // The button is disabled until the data in the fields is valid, so we
  // can omit validation here.
  const handleTransferClicked = async () => {
    // Set up a fn that will execute the transfer so that we can toast this
    const doTransfer = async () => {
      try {
        setSending(true);
        await checkApproval(); // make sure the router is approved
        const res = await transfer(receiver, amount!);
        reset();
        return res;
      } catch (e) {
        reset();
        posthog.capture("error", {
          error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
        });
        throw e;
      }
    };

    // Do the transfer and display the process using a toast
    toast.promise(
      doTransfer(),
      {
        loading: "Sending...",
        success: (data) => (
          <span>
            Sent! {/* target=_blank to open in a new tab */}
            <Link href={getTronScanLink(data.txID)} target="_blank">
              View on TronScan
            </Link>
          </span>
        ),
        error: (err) => `Failed to send: ${err.toString()}`,
      },
      {
        style: {
          minWidth: "250px",
        },
        success: {
          duration: 6000,
          icon: "🔥",
        },
      },
    );
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex flex-col gap-3">
        <Label htmlFor="text-input-to">To</Label>
        {/* https://stackoverflow.com/questions/2989263/disable-auto-zoom-in-input-text-tag-safari-on-iphone */}
        <Input
          id="text-input-to"
          type="text"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="TR7NHq...gjLj6t"
        />
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
        <Toaster />
      </div>
      <div className="flex flex-col gap-4">
        {alert && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Whoops</AlertTitle>
            <AlertDescription>{alert}</AlertDescription>
          </Alert>
        )}
        <Button disabled={sendDisabled} onClick={handleTransferClicked}>
          {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {sending ? "Sending" : "Send"}
        </Button>
      </div>
    </div>
  );
};
