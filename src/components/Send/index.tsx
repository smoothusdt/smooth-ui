import { BigNumber } from "tronweb";
import { Page, PageHeader } from "../Page";
import { SendInput } from "./SendInput";
import { useRef, useState } from "react";
import { SendConfirm } from "./SendConfirm";
import { SendSuccess } from "./SendSuccess";

interface InputData {
    toBase58: string
    amount: BigNumber
}

enum Stage {
    Input,
    Confirm,
    Success
}

export default function Send() {
    const [stage, setStage] = useState(Stage.Input)
    const inputedData = useRef<InputData | undefined>(undefined);
    const txID = useRef<string | undefined>(undefined);

    const onInputed = (toBase58: string, amount: BigNumber) => {
        console.log("inputed")
        inputedData.current = {
            toBase58,
            amount
        }
        setStage(Stage.Confirm)
    }

    const onSent = (successTxID: string) => {
        txID.current = successTxID
        setStage(Stage.Success)
    }

    return (
        <Page>
            <PageHeader canGoBack={stage !== Stage.Success}>Send</PageHeader>
            {stage === Stage.Input && <SendInput onInputed={onInputed} />}
            {stage === Stage.Confirm && <SendConfirm toBase58={inputedData.current!.toBase58} amount={inputedData.current!.amount} onSent={onSent} />}
            {stage === Stage.Success && <SendSuccess txID={txID.current!} toBase58={inputedData.current!.toBase58} amount={inputedData.current!.amount} />}
        </Page>
    );
}
