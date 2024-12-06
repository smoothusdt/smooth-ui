import { BigNumber } from "tronweb";
import {
  SmoothFeeCollector,
  TronscanApi,
  tronweb,
  USDTAddressBase58,
  USDTDecimals,
} from "./constants";
import { uintToHuman } from "./util";
import { USDTAbi } from "./constants/usdtAbi";

export interface HistoricalTransaction {
  txID: string;
  timestamp: number; // UTC
  from: string; // Base 58
  to: string; // Base 58
  amount: BigNumber;
  fee: BigNumber;
}

export async function fetchUsdtBalance(tronUserAddress: string): Promise<BigNumber> {
  const USDTContract = tronweb.contract(USDTAbi, USDTAddressBase58);
  let balanceUint: any = await USDTContract.methods
    .balanceOf(tronUserAddress)
    .call();
  balanceUint = BigNumber(balanceUint.toString());

  const balanceHuman: BigNumber = balanceUint.dividedBy(
    BigNumber(10).pow(USDTDecimals),
  );

  return balanceHuman
}

/**
 * Queries one tronscan page of USDT transfers
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
    if (to === SmoothFeeCollector) continue; // don't show fee transfers

    const amountUint = parseInt(transfer.quant);
    const amountHuman = uintToHuman(amountUint);
  
    const txID = transfer.transaction_id;
    const tx: HistoricalTransaction = {
      txID,
      timestamp: transfer.block_ts,
      from,
      to,
      amount: amountHuman,
      fee: new BigNumber(0),
    };
    history.push(tx);
  }

  return history;
}
