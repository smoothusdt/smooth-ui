import { BigNumber } from "tronweb";
import { Page, PageContent, PageHeader } from "../Page";
import { SmoothFee } from "@/constants";
import { Button } from "../ui/button";
import { shortenAddress } from "@/util";
import { useState } from "react";
import { transferViaApi } from "@/smoothApi";
import { useWallet } from "@/hooks/useWallet";
import { usePrivy } from "@privy-io/react-auth";
import { Hex } from "viem";
import { useLocation } from "wouter";

function InfoItem(props: { title: string; content: string }) {
    return <div className="flex justify-between border-b-2 p-4">
        <p>{props.title}</p>
        <p>{props.content}</p>
    </div>
}

export function SendConfirm() {
    const { tronUserAddress } = useWallet();
    const { user, signMessage } = usePrivy();
    const [sending, setSending] = useState(false);
    const [_, navigate] = useLocation();

    const searchParams = new URLSearchParams(window.location.search);
    const toBase58 = searchParams.get("receiver")!
    const amount = new BigNumber(searchParams.get("amount")!)

    const onConfirm = async () => {
        console.log("onConfirm")
        setSending(true);
        const txID = await transferViaApi(
            tronUserAddress!,
            toBase58,
            amount,
            user?.wallet?.address! as Hex,
            (message: string) => signMessage(message, { showWalletUIs: false })
        )
        navigate(`/tx-receipt?txID=${txID}`)
    }

    return (
        <Page>
            <PageHeader canGoBack>Send</PageHeader>
            <PageContent>
                <div className="flex h-full flex-col justify-between">
                    <div style={{
                        opacity: sending ? 0.5 : 1
                    }}>
                        <p className="text-center text-xl mb-4">Confirm entered details</p>
                        <InfoItem title="Recipient" content={shortenAddress(toBase58)} />
                        <InfoItem title="Network" content="TRC-20" />
                        <InfoItem title="Amount" content={`${amount.toString()} USDT`} />
                        <InfoItem title="Network Fee" content={`${SmoothFee.toString()} USDT`} />
                        <InfoItem title="Total" content={`${amount.plus(SmoothFee).toString()} USDT`} />
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
        </Page>
    );
}