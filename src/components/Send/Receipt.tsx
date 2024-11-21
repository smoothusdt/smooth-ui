import { Clock, ExternalLink, Loader2 } from "lucide-react";
import { Page, PageContent, PageHeader } from "../Page";
import { Link } from "../Link";
import { getTronScanLink, hexToBase58Address, uintToHuman } from "@/util";
import { Button } from "../ui/button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { SmoothFeeCollector, TransferTopic, tronweb, USDTAddressBase58, USDTDecimals } from "@/constants";
import { HistoricalTransaction } from "@/history";
import { TransactionInfo } from "node_modules/tronweb/lib/esm/types/Trx";
import { BigNumber } from "tronweb";
import { useWallet } from "@/hooks/useWallet";
import { DisplayedAddress } from "../DisplayedAddress";


export function Receipt() {
  const [_, navigate] = useLocation();
  const { tronUserAddress } = useWallet();
  const searchParams = new URLSearchParams(window.location.search);
  const [transaction, setTransaction] = useState<HistoricalTransaction>()
  const txID = searchParams.get("txID")!

  const isReceive = transaction?.to === tronUserAddress

  useEffect(() => {
    const fetchTransaction = async () => {
      let txInfo: TransactionInfo | undefined = undefined

      while (!txInfo) {
        const fetchedTxInfo = await tronweb.trx.getTransactionInfo(txID)
        if (fetchedTxInfo) txInfo = fetchedTxInfo
      }

      let fromBase58: string
      let toBase58: string
      let amountHuman: BigNumber
      let feeHuman = new BigNumber(0)

      if (txInfo.log.length === 0) return; // can't do anything
      if (hexToBase58Address("41" + txInfo.log[0].address) !== USDTAddressBase58) return;
      if (txInfo.log[0].topics[0] !== TransferTopic) return;

      // Detect from, to and amount
      fromBase58 = hexToBase58Address(`41${txInfo.log[0].topics[1].slice(24)}`)
      toBase58 = hexToBase58Address(`41${txInfo.log[0].topics[2].slice(24)}`)
      amountHuman = uintToHuman(new BigNumber(txInfo.log[0].data, 16), USDTDecimals)

      // Check if a fee was paid to the smooth router
      if (
        txInfo.log.length === 2 &&
        hexToBase58Address("41" + txInfo.log[1].address) === USDTAddressBase58 &&
        txInfo.log[1].topics[0] === TransferTopic &&
        hexToBase58Address(`41${txInfo.log[1].topics[1].slice(24)}`) === fromBase58 &&
        hexToBase58Address(`41${txInfo.log[1].topics[2].slice(24)}`) == SmoothFeeCollector
      ) {
        feeHuman = uintToHuman(new BigNumber(txInfo.log[1].data, 16), USDTDecimals)
      }

      const tx: HistoricalTransaction = {
        from: fromBase58,
        to: toBase58,
        amountHuman,
        feeHuman,
        txID,
        timestamp: txInfo.blockTimeStamp
      }
      console.log("Loaded transaction", tx, amountHuman.toString())
      setTransaction(tx)
    }
    fetchTransaction()
  }, [])

  const loadingBlock = (
    <div className="w-full h-48 flex justify-center items-center">
      <div className="flex flex-col items-center">
      <Loader2
        className="text-primary animate-spin"
      />
        <p>Loading receipt...</p>
      </div>
    </div>
  );

  const receiptBlock = transaction && (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-4">
        {isReceive ?
          <DisplayedAddress label="Received From" address={transaction.from} /> :
          <DisplayedAddress label="Sent To" address={transaction.to} />
        }
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-primary">Amount</div>
          <div className="text-lg font-bold text-white">{`${transaction.amountHuman.toString()} USDT`}</div>
        </div>
        {!isReceive && <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-primary">Network Fee</div>
          <div className="text-base text-white">{`${transaction.feeHuman.toString()} USDT`}</div>
        </div>}
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-primary" />
          <div className="text-sm text-white">{new Date(transaction.timestamp).toLocaleString()}</div>
        </div>
        <Button variant="outline" asChild className="w-full text-white text-sm py-2">
          <Link href={getTronScanLink(transaction.txID)} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Tronscan
          </Link>
        </Button>
      </div>
      <Button onClick={() => navigate("/home")}>Home</Button>
    </div>
  );

  return (
    <Page>
      <PageHeader canGoBack>Receipt</PageHeader>
      <PageContent>
        {transaction ? receiptBlock : loadingBlock}
      </PageContent>
    </Page>
  );
}