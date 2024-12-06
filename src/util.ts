import {
  ADDRESS_PREFIX,
  getBase58CheckAddress,
  hexStr2byteArray,
} from "tronweb/utils";
import { BigNumber } from "tronweb";
import { ExplorerUrl } from "./constants";

export function humanToUint(amountHuman: BigNumber): number {
  return amountHuman
    .multipliedBy(BigNumber(10).pow(6))
    .decimalPlaces(0)
    .toNumber();
}

export function uintToHuman(amountUint: number | BigNumber): BigNumber {
  return BigNumber(amountUint)
    .dividedBy(BigNumber(10).pow(6))
    .decimalPlaces(6);
}

export function hexToBase58Address(hexAddress: string) {
  return getBase58CheckAddress(
    hexStr2byteArray(hexAddress.replace(/^0x/, ADDRESS_PREFIX)),
  );
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

export function shortenAddress(address: string, length: number = 6) {
  const firstPart = address.slice(0, length)
  const lastPart = address.slice(address.length - length)

  return `${firstPart}...${lastPart}`
}
