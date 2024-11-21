import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ReactTimeAgo from "react-time-ago";

import { HistoricalTransaction } from "@/history";
import { navigate } from "wouter/use-browser-location";

// Initialize TimeAgo (keep this up to date with locales)
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import { useWallet } from "@/hooks/useWallet";
import { ArrowDown, ArrowUp } from "lucide-react";
import { shortenAddress } from "@/util";
import { useLocation } from "wouter";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru); // TODO how to make sure this works when russian is selected

type TransactionsProps = {
  transactions: HistoricalTransaction[] | undefined;
  /** Should a "See All" button be rendered in the header? */
  showSeeAll?: boolean;
  /** What should the label text of the header be? */
  label?: string;
};

/** A component for displaying a list of transactions */
export const TransactionHistory = (props: TransactionsProps) => {
  const transactions = props.transactions;
  const label = props.label ?? "Recent Transactions";
  const { showSeeAll } = props;

  return (
    <div className="flex flex-col justify-between">
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
      {transactions?.map((transaction) => (
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
  const { tronUserAddress } = useWallet();
  const [_, navigate] = useLocation();

  const isReceive = transaction.to === tronUserAddress; // Was this a transaction where the wallet received usdt?
  const address = isReceive ? transaction.from : transaction.to;
  const sign = isReceive ? "+" : "-";
  const amount = sign + transaction.amountHuman + " USDT";
  const date = transaction.timestamp;

  const abbreviatedAddress = shortenAddress(address, 4)

  return (
    <div
      className="flex justify-between items-center w-full border-b border-b-muted py-3 last:border-b-0 hover:bg-muted"
      onClick={() => navigate(`/tx-receipt?txID=${props.transaction.txID}`)}
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback>{isReceive ? <ArrowDown /> : <ArrowUp />}</AvatarFallback>
        </Avatar>
        <span className="text-sm"><span className="text-muted-foreground">{isReceive ? "From: " : "To: "}</span> {abbreviatedAddress}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className={`text-sm ${isReceive && "text-primary"}`}>{amount}</span>
        <ReactTimeAgo
          className="text-muted-foreground text-sm text-right"
          date={date}
          locale="ru"
        />
      </div>
    </div>
  );
};
