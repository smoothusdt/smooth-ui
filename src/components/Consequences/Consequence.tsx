import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/** Clickable callout the user must accept to delete their wallet */
export const Consequence: React.FC<
  React.PropsWithChildren<{ accepted?: boolean; onClick?: () => void }>
> = (props) => {
  const { accepted, children, onClick } = props;
  return (
    <Alert
      className={cn(
        accepted && "bg-muted",
        " text-small text-left text-muted-foreground",
      )}
      onClick={onClick}
    >
      <CircleCheck
        className="h-4 w-4"
        fill={accepted ? "hsl(var(--primary))" : undefined}
      />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};
