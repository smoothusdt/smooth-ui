import { useEffect, useState } from "react";

import { useWallet } from "@/hooks/useWallet";
import { usePostHog } from "posthog-js/react";

import { HistoricalTransaction, queryUsdtHistory } from "@/history";

/** Use within `<WalletProvider />` to get the current wallets transaction history. */
export const useTransactionHistory = (limit?: number) => {
  const { wallet, connected } = useWallet();

  // TODO: cache this and void going to the network every time?
  const [history, setHistory] = useState<HistoricalTransaction[] | undefined>(
    undefined,
  );
  const ph = usePostHog();

  useEffect(() => {
    async function getHistory() {
      if (!connected || !wallet) {
        return;
      }

      try {
        // TODO: Sometimes this is failing, not sure why
        const history = await queryUsdtHistory(wallet.address, limit);
        setHistory(history);
      } catch (e) {
        console.error(e);
        ph.capture("Error getting history", { error: e });
      }
    }
    getHistory();
  }, [connected, limit, ph, wallet]);

  return history;
};
