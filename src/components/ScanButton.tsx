import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ScanLineIcon } from "lucide-react";
import { useState } from "react";

export const ScanButton = (props: {
  onScan: (code: string) => void;
  disabled?: boolean;
}) => {
  const [isScanning, setIsScanning] = useState(false);

  return (
    <Drawer open={isScanning} onOpenChange={setIsScanning}>
      <DrawerTrigger asChild>
        <Button variant="outline" disabled={props.disabled}>
          <ScanLineIcon size={16} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-[425px]">
        <DrawerHeader>
          <DrawerTitle className="pb-4">
            <span>Scan a Wallet Code</span>
          </DrawerTitle>
          <div className="flex flex-col gap-4">
            <Scanner
              styles={{ container: { borderRadius: 8, overflow: "hidden" } }}
              allowMultiple={false}
              onScan={(result) => {
                props.onScan(result[0].rawValue);
                setIsScanning(false);
              }}
            />
          </div>
        </DrawerHeader>
        <DrawerFooter className="flex flex-col gap-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
