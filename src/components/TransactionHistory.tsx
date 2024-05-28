import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ReactTimeAgo from "react-time-ago";

import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { HistoricalTransaction } from "@/history";
import { navigate } from "wouter/use-browser-location";

// Initialize TimeAgo (keep this up to date with locales)
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru); // TODO how to make sure this works when russian is selected

type TransactionsProps = {
  /** How many transactions should the component fetch and show? */
  limit?: number;
  /** Should a "See All" button be rendered in the header? */
  showSeeAll?: boolean;
  /** What should the label text of the header be? */
  label?: string;
};

/** A component for displaying a list of transactions */
export const TransactionHistory = (props: TransactionsProps) => {
  const limit = props.limit ?? 5;
  const label = props.label ?? "Recent Transactions";
  const { showSeeAll } = props;
  const transactions = useTransactionHistory(limit);
  const loading = !transactions;

  return (
    <div className="flex flex-col justify-between gap-3">
      <div className="flex justify-between items-baseline border-b border-b-muted pb-3">
        <h2 className="w-full text-md text-muted-foreground">{label}</h2>
        {showSeeAll && (
          <Button
            variant={"link"}
            className="pr-0"
            onClick={() => navigate("/transactions")}
          >
            See all
          </Button>
        )}
      </div>
      {loading
        ? new Array(limit)
            .fill(undefined)
            .map((_, i) => <SkeletonItem key={i} />)
        : transactions.map((transaction) => (
            <Transaction key={transaction.txID} transaction={transaction} />
          ))}
    </div>
  );
};

// TODO: Red / Green for transaction amounts?
// TODO: Links to tronscan?
/** Local component for rendering a single transaction */
const Transaction = (props: { transaction: HistoricalTransaction }) => {
  const { transaction } = props;
  const sent = transaction.to !== undefined; // Was this a send?
  const address = sent ? transaction.to : transaction.from;
  const short = address.slice(0, 2);
  const sign = sent ? "-" : "+";
  const amount = sign + transaction.amountHuman;
  const date = transaction.timestamp;

  return (
    <div className="flex justify-between items-center w-full border-b border-b-muted pb-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback>{short}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold">{address.slice(0, 8)}...</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-sm">
          {amount} <span className="text-xs">USDT</span>
        </span>
        <ReactTimeAgo
          timeStyle="twitter-now"
          className="text-muted-foreground text-sm"
          date={date}
        />
      </div>
    </div>
  );
};

// TODO: Skeleton should more closely match <Transaction />
// TODO: Should animate in and out.
// TODO: Should not render if transactions are cached.
/** Local component for rendering the skeleton of a transaction while they are being fetched */
const SkeletonItem = () => {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};
