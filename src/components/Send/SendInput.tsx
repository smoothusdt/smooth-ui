import { AlertCircle } from "lucide-react";
import { PageContent } from "../Page";
import { ScanButton } from "../ScanButton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState } from "react";
import { SmoothFee, tronweb } from "@/constants";
import { BigNumber } from "tronweb";
import { useUSDTBalance } from "@/hooks/useBalance";

function getAmountBigNumber(amountRaw: string): BigNumber {
    let formattedAmount = amountRaw.replace(",", "."); // for Russian keyboard

    if (formattedAmount.startsWith(".")) formattedAmount = "0" + formattedAmount; // allow stuff like ".3"
    if (formattedAmount.endsWith(".")) formattedAmount = formattedAmount + "0";

    let amount = new BigNumber(formattedAmount);
    if (amount.isNaN()) amount = new BigNumber(0);

    return amount;
}

export function SendInput(props: { onInputed: (toBase58: string, amount: BigNumber) => void }) {
    const [receiver, setReceiver] = useState("");
    const [amountRaw, setAmountRaw] = useState("");
    const [alert, setAlert] = useState("");
    const amount = getAmountBigNumber(amountRaw);
    const totalAmount = amount.plus(SmoothFee)
    const [balance] = useUSDTBalance();

    const onContinue = () => {
        if (totalAmount.gt(balance || 0)) {
            return setAlert("You can't send more than you have");
        }
        if (!receiver || !tronweb.isAddress(receiver)) {
            return setAlert('"To" is not a valid Tron address')
        }

        props.onInputed(receiver, amount)
    }

    return (
        <PageContent>
            <div
                className="h-full flex flex-col justify-between"
            >
                <div className="flex flex-col gap-3">
                    <Label htmlFor="text-input-to">
                        To
                    </Label>
                    <div className="flex w-full items-center space-x-2">
                        <Input
                            id="text-input-to"
                            type="text"
                            value={receiver}
                            onChange={(e) => setReceiver(e.target.value)}
                            placeholder="Example: TR7NHq..."
                        />
                        <ScanButton
                            onScan={(code) => {
                                setReceiver(code);
                            }}
                        />
                    </div>
                    <Label htmlFor="text-input-amount">
                        Amount (USDT)
                    </Label>
                    <Input
                        id="text-input-amount"
                        type="number"
                        inputMode="decimal"
                        value={amountRaw}
                        onChange={(e) => setAmountRaw(e.target.value)}
                        min={0}
                        placeholder="Example: 100"
                    />

                    <span className="text-sm text-muted-foreground">
                        Fee: {SmoothFee.toString()}{" "}
                        <span className="text-[0.5rem]">USDT</span>
                    </span>
                    {Boolean(amount) && (
                        <span>
                            Total: <strong>{totalAmount.toString()}</strong>{" "}
                            <span className="text-[0.5rem]">USDT</span>
                        </span>
                    )}
                </div>
                <div className="relative flex flex-col items-center gap-4">
                    {alert && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Whoops</AlertTitle>
                            <AlertDescription>{alert}</AlertDescription>
                        </Alert>
                    )}
                    <Button
                        className="w-full"
                        onClick={onContinue}
                    >Continue</Button>
                </div>
            </div>
        </PageContent>
    );
}