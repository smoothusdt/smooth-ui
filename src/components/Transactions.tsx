import { Page, PageContent, PageHeader } from "@/components/Page";
import { TransactionHistory } from "@/components/TransactionHistory";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";

/** Full page transactions component */
export const Transactions = () => {
  const [history] = useTransactionHistory();
  return (
    <Page>
      <PageHeader backPath="/home">Transactions</PageHeader>
      <ScrollArea>
        <PageContent>
          <TransactionHistory transactions={history} label="All Transactions" />
        </PageContent>
      </ScrollArea>
    </Page>
  );
};
