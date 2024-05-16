import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Back } from "@/components/Back";
import { Link } from "@/components/Link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { AlertCircle, Loader2 } from "lucide-react";

import toast, { Toaster } from "react-hot-toast";

import { useSmooth } from "@/hooks/useSmooth/useSmooth";
import { smoothFee } from "@/hooks/useSmooth/constants";
import { getTronScanLink } from "@/hooks/useSmooth/util";
import { useUSDTBalance } from "@/hooks/useUSDTBalance";
import { usePwa } from "@dotmind/react-use-pwa";

export const Send = () => {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState<number | undefined>();
  const [sending, setSending] = useState(false);
  const balance = useUSDTBalance();
  const { isOffline } = usePwa();

  const isOverspending =
    amount !== undefined &&
    balance !== undefined &&
    amount + smoothFee > balance;

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

  // TODO: Use approve. This only works for accounts which are already approved
  const [, transfer] = useSmooth();

  const handleTransferClicked = async () => {
    // Check obvious things
    if (receiver == "") {
      console.error("receiver is empty");
      toast.error("Transfer failed. Check console.");
      return;
    }

    if (amount === 0 || amount === undefined) {
      console.error("amount is empty");
      toast.error("Transfer failed. Check console.");
      return;
    }

    // Set up a fn that will execute the transfer so that we can toast this
    const doTransfer = async () => {
      try {
        setSending(true);
        const res = await transfer(receiver, amount);
        const obj = await res.json();
        if (res.ok) {
          console.log("Response:", obj);
          reset();
          return obj;
        } else {
          console.error(obj);
          reset();
          throw new Error("Transfer failed. Check console.");
        }
      } catch (e) {
        reset();
        console.error(e);
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
            Sent!{" "}
            <Link href={getTronScanLink(data.txID, true)}>
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
        placeholder="tron wallet address"
      />
      <Label htmlFor="text-input-amount">Amount (USDT)</Label>
      <Input
        id="text-input-amount"
        type="number"
        value={amount === undefined ? "" : amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        min={0}
        placeholder="10"
      />
      <span className="text-sm text-muted-foreground">
        Fee: {smoothFee} <span className="text-[0.5rem]">USDT</span>
      </span>
      {amount && amount > 0 && (
        <span className="text-sm text-muted-foreground">
          Total: <strong>{amount + smoothFee}</strong>{" "}
          <span className="text-[0.5rem]">USDT</span>
        </span>
      )}
      {isOverspending && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Whoops</AlertTitle>
          <AlertDescription>You can't send USDT than you have</AlertDescription>
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
