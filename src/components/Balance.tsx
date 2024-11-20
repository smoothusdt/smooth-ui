import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { usePostHog } from "posthog-js/react";
import { ChainName } from "@/constants";
import { BigNumber } from "tronweb";

export function Balance(props: { balance: BigNumber | undefined }) {
  const posthog = usePostHog();
  const balance = props.balance;

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
          {balance.toString()}
          <span className="text-xs text-muted-foreground">
            {ChainName === "shasta" ? "SHASTA" : "USDT"}
          </span>
        </h1>
      )}
    </div>
  );
}
