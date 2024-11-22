import { useCallback, useEffect, useState } from "react";

import { useWallet } from "@/hooks/useWallet";
import { usePostHog } from "posthog-js/react";

import { HistoricalTransaction, queryUsdtHistory } from "@/history";

export const useTransactionHistory = (): [
  HistoricalTransaction[] | undefined,
  () => Promise<void>,
] => {
  const posthog = usePostHog();
  const { wallet, updateHistory } = useWallet();

  const [history, setHistory] = useState<HistoricalTransaction[]>(wallet.history);

  const refreshHistory = useCallback(async () => {
    try {
      // TODO: Sometimes this is failing, not sure why
      const newHistory = await queryUsdtHistory(wallet.tronAddress);
      setHistory(newHistory);
      updateHistory(newHistory)
      console.log("Updated history")
    } catch (e) {
      console.error(e);
      posthog.capture("Error getting history", { error: e });
    }
  }, [wallet, posthog]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return [history, refreshHistory];
};
