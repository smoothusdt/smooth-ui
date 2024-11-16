import { BigNumber } from "tronweb";
import { PageContent } from "../Page";
import { SmoothFee } from "@/constants";
import { Button } from "../ui/button";
import { shortenAddress } from "@/util";
import { useState } from "react";
import { transferViaApi } from "@/smoothApi";
import { useWallet } from "@/hooks/useWallet";
import { usePrivy } from "@privy-io/react-auth";
import { Hex } from "viem";

function InfoItem(props: { title: string; content: string }) {
    return <div className="flex justify-between border-b-2 p-4">
        <p>{props.title}</p>
        <p>{props.content}</p>
    </div>
}

export function SendConfirm(props: { toBase58: string; amount: BigNumber, onSent: (successTxID: string) => void }) {
    const { tronUserAddress } = useWallet();
    const { user, signMessage } = usePrivy();
    const [sending, setSending] = useState(false);

    const onConfirm = async () => {
        console.log("onConfirm")
        setSending(true);
        const txID = await transferViaApi(
            tronUserAddress!,
            props.toBase58,
            props.amount,
            user?.wallet?.address! as Hex,
            (message: string) => signMessage(message, { showWalletUIs: false })
        )
        props.onSent(txID)
    }

    return (
        <PageContent>
            <div className="flex h-full flex-col justify-between">
                <div style={{
                    opacity: sending ? 0.5 : 1
                }}>
                    <p className="text-center text-xl mb-4">Confirm inputed data</p>
                    <InfoItem title="Recipient" content={shortenAddress(props.toBase58)} />
                    <InfoItem title="Network" content="TRC-20" />
                    <InfoItem title="Amount" content={`${props.amount.toString()} USDT`} />
                    <InfoItem title="Network Fee" content={`${SmoothFee.toString()} USDT`} />
                    <InfoItem title="Total" content={`${props.amount.plus(SmoothFee).toString()} USDT`} />
                </div>
                <Button
                    disabled={sending}
                    onClick={onConfirm}
                    className="w-full"
                >
                    {sending ? "Sending..." : "Confirm"}
                </Button>
            </div>
        </PageContent>
    );
}