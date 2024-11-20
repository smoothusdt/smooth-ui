import { Page, PageContent, PageHeader } from "@/components/Page";
import { TransactionHistory } from "@/components/TransactionHistory";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";

/** Full page transactions component */
export const Transactions = () => {
  const [history] = useTransactionHistory();
  return (
    <Page>
      <PageHeader canGoBack>Transactions</PageHeader>
      <ScrollArea className="pr-3">
        <PageContent>
          <TransactionHistory transactions={history} label="All Transactions" />
        </PageContent>
      </ScrollArea>
    </Page>
  );
};
