import { useEffect } from "react";

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
      <h1 className="text-3xl font-semibold">
        {balance === undefined ? "..." : balance.toString()}
        <span className="text-xs text-muted-foreground">
          {ChainName === "shasta" ? "SHASTA" : "USDT"}
        </span>
      </h1>

    </div>
  );
}
