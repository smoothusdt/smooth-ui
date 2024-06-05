import { useCallback, useEffect, useState } from "react";

import { useWallet } from "@/hooks/useWallet";
import { usePostHog } from "posthog-js/react";

import { HistoricalTransaction, queryUsdtHistory } from "@/history";

/** Use within `<WalletProvider />` to get the current wallets transaction history. */
export const useTransactionHistory = (): [
  HistoricalTransaction[] | undefined,
  () => Promise<void>,
] => {
  const { wallet, connected } = useWallet();

  // TODO: cache this and void going to the network every time?
  const [history, setHistory] = useState<HistoricalTransaction[] | undefined>(
    undefined,
  );
  const ph = usePostHog();

  const refreshHistory = useCallback(async () => {
    if (!connected || !wallet) {
      return;
    }

    try {
      // TODO: Sometimes this is failing, not sure why
      const newHistory = await queryUsdtHistory(wallet.address);
      setHistory(newHistory);
    } catch (e) {
      console.error(e);
      ph.capture("Error getting history", { error: e });
    }
  }, [connected, ph, wallet]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return [history, refreshHistory];
};
