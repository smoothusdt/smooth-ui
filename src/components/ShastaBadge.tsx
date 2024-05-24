import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export const ShastaBadge = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Badge variant="secondary">shasta</Badge>
      </PopoverTrigger>
      <PopoverContent>
        SmoothUSDT is currently connected to the{" "}
        <a href="https://shasta-tronscan.on.btfs.io/#/">Shasta Testnet</a>.
      </PopoverContent>
    </Popover>
  );
};
