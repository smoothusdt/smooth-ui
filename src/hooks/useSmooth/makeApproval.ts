import { TronWeb } from "tronweb";
import { SmoothRouterBase58, USDTAddressBase58, smoothURL } from "./constants";
import { recoverSigner } from "./util";

/**
 * Send an approve transaction to the smoothUSDT API.
 *
 * @param tw The TronWeb instance to use
 * @returns the response from calling the smoothUSDT API.
 */
export async function makeApproval(tw: TronWeb) {
  console.log("Signing approval transaction");

  const functionSelector = "approve(address,uint256)";
  const parameter = [
    { type: "address", value: SmoothRouterBase58 },
    { type: "uint256", value: "0x" + "f".repeat(64) },
  ];
  const { transaction } = await tw.transactionBuilder.triggerSmartContract(
    USDTAddressBase58,
    functionSelector,
    {},
    parameter,
  );
  const signedTx = await tw.trx.sign(transaction);
  console.log(
    "Signed the approval with:",
    recoverSigner(signedTx.txID, signedTx.signature[0]),
  );
  console.log(signedTx);

  // Send approval tx to API and profile.
  console.log("Sending the approval tx to the api...");
  const startTs = Date.now();
  const response = await fetch(`${smoothURL}/approve`, {
    method: "POST",
    body: JSON.stringify({
      approveTx: {
        rawDataHex: "0x" + signedTx.raw_data_hex,
        signature: signedTx.signature,
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("API execution took:", Date.now() - startTs);

  return response;
}
