import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Back } from "@/components/Back";
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

export const Send = () => {
  const { connected, wallet } = useWallet();
  const [, navigate] = useLocation();
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState<number | undefined>();
  const [sending, setSending] = useState(false);
  const balance = useUSDTBalance();
  const { isOffline } = usePwa();
  const [checkApproval, transfer] = useSmooth();
  const posthog = usePostHog();

  // The user wallet is not set up - cant do anything on this screen
  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected, navigate]);

  const isOverspending =
    amount !== undefined &&
    balance !== undefined &&
    amount + SmoothFee > balance;

  const sendDisabled =
    sending ||
    amount === 0 ||
    amount === undefined ||
    receiver === "" ||
    isOverspending ||
    isOffline;

  const reset = () => {
    setAmount(undefined);
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
    <div className="flex flex-col gap-3">
      <Back />
      <Label htmlFor="text-input-to">To</Label>
      {/* https://stackoverflow.com/questions/2989263/disable-auto-zoom-in-input-text-tag-safari-on-iphone */}
      <Input
        id="text-input-to"
        type="text"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        placeholder={wallet?.address}
      />
      <Label htmlFor="text-input-amount">Amount (USDT)</Label>
      <Input
        id="text-input-amount"
        type="number"
        inputMode="decimal"
        value={amount === undefined ? "" : amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        min={0}
        placeholder="10"
      />
      <span className="text-sm text-muted-foreground">
        Fee: {SmoothFee} <span className="text-[0.5rem]">USDT</span>
      </span>
      {amount && amount > 0 && (
        <span className="text-sm text-muted-foreground">
          Total: <strong>{amount + SmoothFee}</strong>{" "}
          <span className="text-[0.5rem]">USDT</span>
        </span>
      )}
      {isOverspending && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Whoops</AlertTitle>
          <AlertDescription>You can't send more than you have</AlertDescription>
        </Alert>
      )}
      <Button disabled={sendDisabled} onClick={handleTransferClicked}>
        {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {sending ? "Sending" : "Send"}
      </Button>
      <Toaster />
    </div>
  );
};
