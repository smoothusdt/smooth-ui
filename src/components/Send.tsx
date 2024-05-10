import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { useState } from "react";
import { useTronWeb } from "../hooks/useTronWeb";
import { Button } from "./Button";
import styled from "styled-components";
import toast, { Toaster } from "react-hot-toast";

export const Send = () => {
  const { signTransaction, address } = useWallet();
  const tronWeb = useTronWeb();
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState(0);

  async function onSignTransaction() {
    if (address == null) {
      console.error("address is null");
      toast.error("Transfer failed. Check console.");
      return;
    }

    if (receiver == "") {
      console.error("receiver is empty");
      toast.error("Transfer failed. Check console.");
      return;
    }

    if (amount === 0) {
      console.error("amount is empty");
      toast.error("Transfer failed. Check console.");
      return;
    }

    try {
      const transaction = await tronWeb.transactionBuilder.sendTrx(
        receiver,
        Number(tronWeb.toSun(amount)), // TODO: does Number('string | BigNumber' work?
        address,
        { blockHeader: { fee_limit: 10000000 } },
      );

      const signedTransaction = await signTransaction(transaction);
      // const signedTransaction = await tronWeb.trx.sign(transaction); //https://stackoverflow.com/questions/65582802/tron-web-validate-transfercontract-error-no-owneraccount-tron-link
      const res = await tronWeb.trx.sendRawTransaction(signedTransaction);

      if (res.result) {
        toast.success("Transfer broadcast: " + res.transaction);
      } else {
        console.error(res.code, res.message);
        toast.error("Transfer failed. Check console.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Transfer failed. Check console.");
    }
  }

  const transferDisabled = address === null || amount === 0 || receiver === "";

  return (
    <SendRoot>
      <Label htmlFor="text-input-to">To</Label>
      <Input
        id="text-input-to"
        type="text"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />
      <Label htmlFor="text-input-amount">Amount (TRX)</Label>
      <Input
        id="text-input-amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <Button disabled={transferDisabled} onClick={onSignTransaction}>
        Transfer
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

  &:focus {
    border-color: var(--theme-color);
    box-shadow: 0 0 0 3px var(--theme-color);
    outline: 3px solid transparent;
  }

  @media (prefers-color-scheme: light) {
    background-color: #f9f9f9;
  }
`;

const Label = styled.label`
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1;
`;
