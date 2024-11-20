import { useCallback, useEffect, useState } from "react";

import { useWallet } from "@/hooks/useWallet";
import { usePostHog } from "posthog-js/react";

import { HistoricalTransaction, queryUsdtHistory } from "@/history";
import { loadWalletCache, updateCachedHistory } from "@/storage";

export const useTransactionHistory = (): [
  HistoricalTransaction[] | undefined,
  () => Promise<void>,
] => {
  const posthog = usePostHog();
  const { tronUserAddress } = useWallet();

  const [history, setHistory] = useState<HistoricalTransaction[] | undefined>();

  const refreshHistory = useCallback(async () => {
    if (!tronUserAddress) {
      return;
    }

    const cache = loadWalletCache(tronUserAddress)
    if (history === undefined && cache) setHistory(cache.history)

    try {
      // TODO: Sometimes this is failing, not sure why
      const newHistory = await queryUsdtHistory(tronUserAddress);
      setHistory(newHistory);
      updateCachedHistory(tronUserAddress,  newHistory)
      console.log("Updated history")
    } catch (e) {
      console.error(e);
      posthog.capture("Error getting history", { error: e });
    }
  }, [tronUserAddress, posthog]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return [history, refreshHistory];
};
