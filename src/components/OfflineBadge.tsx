import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export const OfflineBadge = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Badge variant="destructive">offline</Badge>
      </PopoverTrigger>
      <PopoverContent>
        Balance may be inaccurate and sending is not available.
      </PopoverContent>
    </Popover>
  );
};
