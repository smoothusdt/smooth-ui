import { useUSDTBalance } from "../hooks/useUSDTBalance";
import { Skeleton } from "./ui/skeleton";

export const Balance: React.FC = () => {
  const balance = useUSDTBalance();

  return balance === undefined ? (
    <Skeleton className="w-36 h-9" />
  ) : (
    <h1 className="text-3xl font-semibold">
      {balance}
      <span className="text-xs text-muted-foreground"> USDT</span>
    </h1>
  );
};
