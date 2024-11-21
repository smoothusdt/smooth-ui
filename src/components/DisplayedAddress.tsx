import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";

export function DisplayedAddress(props: { label?: string; address: string }) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = (value: string) => {
        navigator.clipboard.writeText(value)

        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    return (
        <div className="space-y-2">
            {props.label && <div className="text-sm font-medium text-primary">{props.label}</div>}
            <div className="flex items-center justify-between bg-gray-700 p-2 rounded">
                <div className="font-mono text-base text-white truncate">{props.address}</div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-primary hover:text-white"
                                onClick={() => copyToClipboard(props.address)}
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Copy address</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}