import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { useUSDTBalance } from "@/hooks/useUSDTBalance";
import { usePostHog } from "posthog-js/react";

export const Balance: React.FC = () => {
  const posthog = usePostHog();
  const balance = useUSDTBalance();

  useEffect(() => {
    if (balance === undefined) return;
    posthog.capture("Loaded user balance", { balance });
  }, [balance, posthog]);

  return (
    <div className="py-8 flex text-center justify-center">
      {balance === undefined ? (
        <Skeleton className="w-36 h-9" />
      ) : (
        <h1 className="text-3xl font-semibold">
          {balance}
          <span className="text-xs text-muted-foreground"> USDT</span>
        </h1>
      )}
    </div>
  );
};
