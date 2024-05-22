import { useUSDTBalance } from "@/hooks/useUSDTBalance";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

export const Balance: React.FC = () => {
  const posthog = usePostHog();
  const balance = useUSDTBalance();

  useEffect(() => {
    if (balance === undefined) return;
    posthog.capture("Loaded user balance", { balance });
  }, [balance, posthog]);

  return balance === undefined ? (
    <Skeleton className="w-36 h-9" />
  ) : (
    <h1 className="text-3xl font-semibold">
      {balance}
      <span className="text-xs text-muted-foreground"> USDT</span>
    </h1>
  );
};
