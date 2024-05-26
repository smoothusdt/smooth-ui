import {
  ADDRESS_PREFIX,
  getBase58CheckAddress,
  hexStr2byteArray,
  recoverAddress,
} from "tronweb/utils";
import { BigNumber } from "tronweb";
import { ExplorerUrl } from "./constants";
import { TransactionInfo } from "node_modules/tronweb/lib/esm/types/Trx";

export function humanToUint(amountHuman: BigNumber, decimals: number): number {
  return amountHuman
    .multipliedBy(BigNumber(10).pow(decimals))
    .decimalPlaces(0)
    .toNumber();
}

export function uintToHuman(amountUint: number, decimals: number): BigNumber {
  return BigNumber(amountUint)
    .dividedBy(BigNumber(10).pow(decimals))
    .decimalPlaces(decimals);
}

export function hexToBase58Address(hexAddress: string) {
  return getBase58CheckAddress(
    hexStr2byteArray(hexAddress.replace(/^0x/, ADDRESS_PREFIX)),
  );
}

export function recoverSigner(
  txID: string,
  signature: string,
): {
  signerHexAddress: string;
  signerBase58Address: string;
} {
  const signerHexAddress = recoverAddress("0x" + txID, "0x" + signature);
  const signerBase58Address = hexToBase58Address(signerHexAddress);

  return {
    signerHexAddress,
    signerBase58Address,
  };
}

/**
 * Get a link to a transaction on TronScan.
 *
 * @param txID The transaction ID
 * @param shasta Is this on the shasta network?
 * @returns A link to the transaction on TronScan.
 */
export const getTronScanLink = (txID: string) => {
  return `${ExplorerUrl}/transaction/${txID}`;
};

export function shuffle(array: number[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

export function shortenAddress(address: string) {
  const firstPart = address.slice(0, 4)
  const lastPart = address.slice(address.length - 4)

  return `${firstPart}...${lastPart}`
}

export function assertTransactionSuccess(txReceipt: TransactionInfo) {
  // If txReceipt.receipt.result is not defined - it is a TRX transfer.
  // We always consider it successful.
  if (!txReceipt.receipt || !txReceipt.receipt.result || txReceipt.receipt.result === 'SUCCESS') {
    return // success
  }

  throw new Error(`Transaction ${txReceipt.id} did not execute well`)
}