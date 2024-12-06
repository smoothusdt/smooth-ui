import { ScanLine } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

export function ScanButton(props: { onScanned: (value: string) => void }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger className="h-full px-2 hover:text-gray-400 bg-gray-700 rounded-r-lg">
                    <ScanLine />
            </DialogTrigger>
            <DialogContent className="bg-gray-800">
                <DialogHeader className="flex flex-row justify-center">
                    <DialogTitle>
                        <p className="text-2xl">Scan QR Code</p>
                    </DialogTitle>
                </DialogHeader>
                <Scanner
                    styles={{ container: { borderRadius: 8, overflow: "hidden" } }}
                    allowMultiple={false}
                    onScan={(result) => {
                        setOpen(false)
                        props.onScanned(result[0].rawValue.trim())
                    }}

                />
            </DialogContent>
        </Dialog>
    );
}