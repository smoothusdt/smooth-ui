import { Page, PageContent, PageHeader } from "@/components/Page";
import { TransactionHistory } from "@/components/TransactionHistory";
import { ScrollArea } from "@/components/ui/scroll-area";

/** Full page transactions component */
export const Transactions = () => {
  return (
    <Page>
      <PageHeader backPath="/home">Transactions</PageHeader>
      <ScrollArea>
        <PageContent>
          <TransactionHistory limit={100} label="All Transactions" />
        </PageContent>
      </ScrollArea>
    </Page>
  );
};
