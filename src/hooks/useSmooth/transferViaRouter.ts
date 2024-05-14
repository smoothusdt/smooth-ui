import { BigNumber, TronWeb } from "tronweb";
import {
  ChainID,
  SmoothFeeCollector,
  SmoothRouterBase58,
  USDTAddressBase58,
  USDTDecimals,
  smoothFee,
  smoothURL,
} from "./constants";
import { humanToUint } from "./util";
import {
  Hex,
  encodePacked,
  hexToBytes,
  hexToNumber,
  keccak256,
  sliceHex,
} from "viem";
import { smoothAbi } from "./constants/smoothAbi";

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
  console.log("Signing transfer message");

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

  console.log("Creating a signature with parameters:", {
    chainId,
    routerHex,
    fromHex,
    toHex,
    transferAmountUint,
    feeCollectorHex,
    feeAmountUint,
    nonce,
  });
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
  console.log("EncodePacked values:", encodePackedValues);

  const digestHex = keccak256(encodePackedValues);
  const digestBytes = hexToBytes(digestHex);
  console.log("Digest:", digestHex, digestBytes);

  const signature = tronWeb.trx.signMessageV2(
    digestBytes,
    tronWeb.defaultPrivateKey,
  ) as Hex;
  return signature;
}

/**
 * Send a transfer transaction to the smoothUSDT API.
 *
 * @param tronWeb The TronWeb instance to use (should have public and private keys set)
 * @returns the response from calling the smoothUSDT API.
 */
export async function transferViaRouter(
  tronWeb: TronWeb,
  toBase58: string,
  amount: number,
) {
  console.log("Begin transfer process");

  // Note, the tw instance should have the address set correctly
  const fromBase58 = tronWeb.defaultAddress.base58;
  console.log("Transferring from:", fromBase58);

  if (!fromBase58) {
    throw new Error("TronWeb instance does not have address set correctly");
  }

  const usdtAddress = USDTAddressBase58;
  const transferAmount = BigNumber(amount);
  const feeCollector = SmoothFeeCollector;
  const feeAmount = BigNumber(smoothFee);

  // Get nonce from smooth contract
  const smoothContract = tronWeb.contract(smoothAbi as any, SmoothRouterBase58);
  const nonceBigNumber = await smoothContract.methods.nonces(fromBase58).call(); // Can we get a type for this?
  const nonce = (nonceBigNumber as BigNumber).toNumber();
  console.log("nonce: ", nonce);

  // Sign the transfer message
  const signature = await signTransferMessage(
    tronWeb,
    BigInt(ChainID),
    SmoothRouterBase58,
    usdtAddress,
    fromBase58,
    toBase58,
    transferAmount,
    feeCollector,
    feeAmount,
    BigInt(nonce),
  );
  console.log("Signature: ", signature);

  const r = sliceHex(signature, 0, 32);
  const s = sliceHex(signature, 32, 64);
  const v = hexToNumber(sliceHex(signature, 64));
  console.log("r s v: ", { r, s, v });

  // Send transfer tx to API and profile.
  const body = JSON.stringify({
    usdtAddress,
    from: fromBase58,
    to: toBase58,
    transferAmount: humanToUint(transferAmount, USDTDecimals),
    feeCollector,
    feeAmount: humanToUint(feeAmount, USDTDecimals),
    nonce: nonce,
    v,
    r,
    s,
  });
  console.log(body);
  console.log("Sending the transfer tx to the api...");
  const startTs = Date.now();
  const response = await fetch(`${smoothURL}/transfer`, {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("API execution took:", Date.now() - startTs);

  return response;
}
