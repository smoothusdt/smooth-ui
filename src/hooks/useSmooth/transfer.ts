import { BigNumber, TronWeb } from "tronweb";
import {
  ChainID,
  SmoothFeeCollector,
  SmoothRouterBase58,
  USDTAddressBase58,
  USDTDecimals,
  SmoothFee,
  SmoothApiURL,
} from "../../constants";
import { assertTransactionSuccess, humanToUint } from "../../util";
import {
  Hex,
  encodePacked,
  hexToBytes,
  hexToNumber,
  keccak256,
  sliceHex,
} from "viem";
import { smoothAbi } from "../../constants/smoothAbi";
import { TransactionInfo } from "node_modules/tronweb/lib/esm/types/Trx";
import { PostHog } from "posthog-js";

async function signTransferMessage(
  tronWeb: TronWeb,
  chainId: bigint,
  routerBase58: string,
  usdtBase58: string,
  fromBase58: string,
  toBase58: string,
  transferAmount: BigNumber,
  feeCollectorBase58: string,
  feeAmount: BigNumber,
  nonce: bigint,
): Promise<Hex> {
  const routerHex = ("0x" +
    tronWeb.utils.address.toHex(routerBase58).slice(2)) as Hex;
  const usdtHex = ("0x" +
    tronWeb.utils.address.toHex(usdtBase58).slice(2)) as Hex;
  const fromHex = ("0x" +
    tronWeb.utils.address.toHex(fromBase58).slice(2)) as Hex;
  const toHex = ("0x" + tronWeb.utils.address.toHex(toBase58).slice(2)) as Hex;
  const feeCollectorHex = ("0x" +
    tronWeb.utils.address.toHex(feeCollectorBase58).slice(2)) as Hex;
  const transferAmountUint = BigInt(humanToUint(transferAmount, USDTDecimals));
  const feeAmountUint = BigInt(humanToUint(feeAmount, USDTDecimals));

  const encodePackedValues = encodePacked(
    [
      "string",
      "uint256",
      "address",
      "address",
      "address",
      "address",
      "uint256",
      "address",
      "uint256",
      "uint256",
    ],
    [
      "Smooth",
      chainId,
      routerHex,
      usdtHex,
      fromHex,
      toHex,
      transferAmountUint,
      feeCollectorHex,
      feeAmountUint,
      nonce,
    ],
  );

  const digestHex = keccak256(encodePackedValues);
  const digestBytes = hexToBytes(digestHex);

  const signature = tronWeb.trx.signMessageV2(
    digestBytes,
    tronWeb.defaultPrivateKey,
  ) as Hex;
  return signature;
}

export async function getTxReceipt(tronWeb: TronWeb, txID: string): Promise<TransactionInfo> {
  const startTs = Date.now()
  const timeout = 60000 // should never timeout
  for (; ;) {
    const txInfo = await tronWeb.trx.getUnconfirmedTransactionInfo(txID)
    if (txInfo && txInfo.id) {
      return txInfo
    }
    if (Date.now() - startTs > timeout) {
      throw new Error("Could not get the transaction receipt after a long time! This is extremly bad!!!!")
    }
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

/**
 * Send a transfer transaction to the smoothUSDT API.
 *
 * @param tronWeb The TronWeb instance to use (should have public and private keys set)
 * @returns txID of the executed transaction
 */
export async function transferViaRouter(
  tronWeb: TronWeb,
  toBase58: string,
  amount: BigNumber,
  posthog: PostHog
) {
  const startTs = Date.now()
  posthog.capture("Beginning transfer process")

  // Note, the tw instance should have the address set correctly
  const fromBase58 = tronWeb.defaultAddress.base58;

  if (!fromBase58) {
    throw new Error("TronWeb instance does not have address set correctly");
  }

  const usdtAddress = USDTAddressBase58;
  const feeCollector = SmoothFeeCollector;

  // Get nonce from smooth contract
  const smoothContract = tronWeb.contract(smoothAbi as unknown as never, SmoothRouterBase58);
  const nonceBigNumber = await smoothContract.methods.nonces(fromBase58).call(); // Can we get a type for this?
  const nonce = (nonceBigNumber as BigNumber).toNumber();

  // Sign the transfer message
  const signature = await signTransferMessage(
    tronWeb,
    BigInt(ChainID),
    SmoothRouterBase58,
    usdtAddress,
    fromBase58,
    toBase58,
    amount,
    feeCollector,
    SmoothFee,
    BigInt(nonce),
  );

  const r = sliceHex(signature, 0, 32);
  const s = sliceHex(signature, 32, 64);
  const v = hexToNumber(sliceHex(signature, 64));

  // Send transfer tx to API and profile.
  const body = JSON.stringify({
    usdtAddress,
    from: fromBase58,
    to: toBase58,
    transferAmount: humanToUint(amount, USDTDecimals),
    feeCollector,
    feeAmount: humanToUint(SmoothFee, USDTDecimals),
    nonce: nonce,
    v,
    r,
    s,
  });

  const beforeApiCall = Date.now();
  const response = await fetch(`${SmoothApiURL}/transfer`, {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const afterApiCall = Date.now();

  const data = await response.json();
  const txID = data.txID as string;

  // Await transaction execution
  const receipt = await getTxReceipt(tronWeb, txID)
  assertTransactionSuccess(receipt)

  const endTs = Date.now()
  posthog.capture("Transfer completed", {
    txID,
    nonce,
    fromBase58,
    toBase58,
    amount,
    totalInterval: endTs - startTs,
    apiCallInterval: afterApiCall - beforeApiCall,
  })

  return {
    txID
  };
}
