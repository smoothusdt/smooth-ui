import {
  ADDRESS_PREFIX,
  getBase58CheckAddress,
  hexStr2byteArray,
  recoverAddress,
} from "tronweb/utils";
import { BigNumber } from "tronweb";

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
export const getTronScanLink = (txID: string, shasta: boolean = false) => {
  return `https://${shasta ? "shasta." : ""}tronscan.org/#/transaction/${txID}`;
};
