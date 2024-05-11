import { useState } from "react";
import { Button } from "./Button";
import styled from "styled-components";
import toast, { Toaster } from "react-hot-toast";
import { useSmooth } from "../hooks/useSmooth/useSmooth";
import { smoothFee } from "../hooks/useSmooth/constants";
import { getTronScanLink } from "../hooks/useSmooth/util";
import { Link } from "./Link";

export const Send = () => {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState<number | undefined>();
  const [sending, setSending] = useState(false);

  const sendDisabled =
    sending || amount === 0 || amount === undefined || receiver === "";

  const reset = () => {
    setAmount(undefined);
    setReceiver("");
    setSending(false);
  };

  // TODO: Use approve. This only works for accounts which are already approved
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, transfer] = useSmooth();

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
          return obj;
        } else {
          console.error(obj);
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
    <SendRoot>
      <Label htmlFor="text-input-to">To</Label>
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
      <Subtitle>
        Fee: {smoothFee} <Unit>USDT</Unit>
      </Subtitle>
      {amount && amount > 0 && (
        <Subtitle>
          Total: <strong>{amount + smoothFee}</strong> <Unit>USDT</Unit>
        </Subtitle>
      )}
      <Button disabled={sendDisabled} onClick={handleTransferClicked}>
        {sending ? "Sending" : "Send"}
      </Button>
      <Toaster />
    </SendRoot>
  );
};

const SendRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 2rem;
  text-align: left;
`;

// https://moderncss.dev/custom-css-styles-for-form-inputs-and-textareas/
const Input = styled.input`
  font-size: 16px;
  font-size: max(16px, 1em);
  font-family: inherit;
  line-height: 1;
  height: 2.25rem;

  padding: 0.25em 0.5em;
  background-color: #1a1a1a;
  border: 2px solid var(--input-border);
  border-radius: 4px;
  transition: 180ms box-shadow ease-in-out;

  text-overflow: ellipsis;

  &:focus {
    border-color: var(--theme-color);
    box-shadow: 0 0 0 3px var(--theme-color);
    outline: 3px solid transparent;
  }

  @media (prefers-color-scheme: light) {
    background-color: #f9f9f9;
  }

  /* Hide increment buttons */
  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const Label = styled.label`
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1;
`;

const Subtitle = styled.span`
  color: #7d868d;
  font-size: 0.8rem;
`;

const Unit = styled.span`
  font-size: 0.5rem;
`;
