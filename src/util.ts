import {
  ADDRESS_PREFIX,
  getBase58CheckAddress,
  hexStr2byteArray,
  recoverAddress,
} from "tronweb/utils";
import { BigNumber } from "tronweb";
import { ExplorerUrl, SmoothAdminBase58, tronweb } from "./constants";
import { TransactionInfo } from "node_modules/tronweb/lib/esm/types/Trx";
import { concat, Hex, keccak256, padHex, sliceHex } from "viem";
import { SmoothProxyBytecode } from "./constants/smooth";

// Returns a hex wallet address based on the hex signer address
export function calculateWalletAddress(signerHex: Hex): Hex {
  // TRON Create2: address = keccak256(0x41 ++ address ++ salt ++ keccak256(init_code))[12:]
  const salt = padHex(signerHex, { size: 32 })
  const adminHex = "0x" + tronweb.address.toHex(SmoothAdminBase58).slice(2) as Hex // .slice(2) to remove "41"
  const create2Input = concat([
    "0x41",
    adminHex,
    salt,
    keccak256(SmoothProxyBytecode)
  ])
  const walletHex = sliceHex(keccak256(create2Input), 12);

  return walletHex;
}


export function humanToUint(amountHuman: BigNumber, decimals: number): number {
  return amountHuman
    .multipliedBy(BigNumber(10).pow(decimals))
    .decimalPlaces(0)
    .toNumber();
}

export function uintToHuman(amountUint: number | BigNumber, decimals: number): BigNumber {
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

export function shortenAddress(address: string, length: number = 6) {
  const firstPart = address.slice(0, length)
  const lastPart = address.slice(address.length - length)

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