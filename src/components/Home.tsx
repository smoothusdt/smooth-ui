import { Balance } from "@/components/Balance";
import { Button } from "@/components/ui/button";
import { Page, PageContent, PageHeader } from "@/components/Page";
import { TransactionHistory } from "@/components/TransactionHistory";
import PullToRefresh from "react-simple-pull-to-refresh";

import { ArrowDown, ArrowUp } from "lucide-react";

import { useLocation } from "wouter";
import { useUSDTBalance } from "@/hooks/useUSDTBalance";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";

/** Full page component displaying the home page of Smooth.
 * Includes balance, send, and receive buttons.
 */
export const Home = () => {
  const [, navigate] = useLocation();
  const [balance, refreshBalance] = useUSDTBalance();
  const [history, refreshHistory] = useTransactionHistory();

  const handleRefresh = async () => {
    await Promise.all([refreshHistory(), refreshBalance()]);
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <Page>
        <PageHeader>
          <span>
            smooth <span className="text-xs text-muted-foreground"> USDT</span>
          </span>
        </PageHeader>
        <PageContent>
          <div className="size-full flex flex-col justify-between">
            <Balance balance={balance} />
            <TransactionHistory
              transactions={history?.slice(0, 3)}
              showSeeAll
            />
            <div className="w-full flex gap-4 justify-between">
              <Button
                className="w-96 h-14 gap-2"
                onClick={() => navigate("send")}
              >
                <ArrowUp />
                Send
              </Button>
              <Button
                className="w-96 h-14 gap-2"
                onClick={() => navigate("receive")}
              >
                <ArrowDown />
                Receive
              </Button>
            </div>
          </div>
        </PageContent>
      </Page>
    </PullToRefresh>
  );
};
