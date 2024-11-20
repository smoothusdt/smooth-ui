import { CircleCheck } from "lucide-react";
import { PageContent } from "../Page";
import { Link } from "../Link";
import { getTronScanLink, shortenAddress } from "@/util";
import { Button } from "../ui/button";
import { BigNumber } from "tronweb";
import { useLocation } from "wouter";

export function SendSuccess(props: { txID: string; toBase58: string; amount: BigNumber }) {
    const [_, navigate] = useLocation();

    return (
        <PageContent>
            <div key="sent" className="h-full flex flex-col justify-between">
                <div className="h-full flex flex-col justify-center items-center">
                    <div className="flex flex-col items-center">
                        <CircleCheck size={64} className="text-primary" />
                        <p className="text-2xl mt-2 mb-4">USDT sent</p>
                    </div>
                    <div className="grid grid-cols-2 min-w-64 border-2 p-4 rounded border-current">
                        <p>To:</p>
                        <p className="text-right">{shortenAddress(props.toBase58)}</p>
                        <p>Amount:</p>
                        <p className="text-right">{props.amount.toString()} USDT</p>
                        <p>Details:</p>
                        <p className="text-right">
                            <Link href={getTronScanLink(props.txID)} target="_blank">
                                tronscan
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="flex flex-col">
                    <Button onClick={() => navigate("/home")}>
                        Home Screen
                    </Button>
                </div>
            </div>
        </PageContent>
    );
}