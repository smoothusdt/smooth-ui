import { BigNumber } from "tronweb";
import {
  SmoothAdminBase58,
  SmoothFee,
  SmoothFeeCollector,
  TronscanApi,
  USDTAddressBase58,
  USDTDecimals,
} from "./constants";
import { getTronScanLink, uintToHuman } from "./util";

export interface HistoricalTransaction {
  txID: string;
  explorerUrl: string;
  block: number; // block number
  timestamp: number; // UTC
  from: string; // Base 58
  to: string; // Base 58
  amountHuman: BigNumber;
  feeHuman: BigNumber;
}

/**
 * Queries the last 10 USDT transfers for the given address
 */
export async function queryUsdtHistory(
  userBase58: string,
): Promise<HistoricalTransaction[]> {
  const url = `${TronscanApi}/filter/trc20/transfers?limit=200&start=0&sort=-timestamp&count=true&filterTokenValue=0&contract_address=${USDTAddressBase58}&relatedAddress=${userBase58}`;
  const result = await (await fetch(url)).json();
  const tokenTransfersRaw = result.token_transfers;
  const history: HistoricalTransaction[] = [];

  for (const transfer of tokenTransfersRaw) {
    if (transfer.contractRet !== "SUCCESS") continue; // ignore unsuccessful transfers

    const from = transfer.from_address;
    const to = transfer.to_address;
    if (to === SmoothFeeCollector) continue; // don't show fee transfers TODO: This seems not to be working

    const amountUint = parseInt(transfer.quant);
    const amountHuman = uintToHuman(amountUint, USDTDecimals);

    // Detect trigger info. This is not trivial :(
    let triggerInfo = transfer.trigger_info;
    const ref = triggerInfo["$ref"] as string | undefined;
    if (ref) {
      // This is an ugly cringe that we unfortunatelly have to do because
      // tronscan uses some custom C# json encoding :(
      // Related: https://blog.yumasoft.pl/2021/08/how-to-fix-json-net-circular-references-ref-in-javascript/
      const refPrefix = "$.token\\_transfers[";
      const refPostfix = "].trigger\\_info";
      const trueIndex = parseInt(
        ref.substring(refPrefix.length, ref.length - refPostfix.length),
      );
      triggerInfo = tokenTransfersRaw[trueIndex].trigger_info;
    }

    // fee can be unknown if this USDT transfer was made from another app
    let feeHuman = new BigNumber(0);
    if (
      from === userBase58 && // user is the sender
      triggerInfo.contract_address === SmoothAdminBase58 // transferred via Smooth USDT
    )
      feeHuman = SmoothFee;

    const txID = transfer.transaction_id;
    const tx: HistoricalTransaction = {
      txID,
      explorerUrl: getTronScanLink(txID),
      block: transfer.block,
      timestamp: transfer.block_ts,
      from,
      to,
      amountHuman,
      feeHuman,
    };
    history.push(tx);
  }

  return history;
}
