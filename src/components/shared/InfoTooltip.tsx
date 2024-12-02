import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useState } from "react";

export function InfoTooltip(props: { content: string }) {
    const [open, setOpen] = useState(false)

    return (
        <TooltipProvider>
            <Tooltip open={open} onOpenChange={(open) => setOpen(open)}>
                <TooltipTrigger asChild onClick={() => setOpen(true)}>
                    <Info className="w-7 pr-2 inline" />
                </TooltipTrigger>
                <TooltipContent className="max-w-64 bg-gray-800 border-gray-700 break-words">
                    {props.content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}