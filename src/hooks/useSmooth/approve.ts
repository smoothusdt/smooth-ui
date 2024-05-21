import { BigNumber, TronWeb } from "tronweb";
import { SmoothRouterBase58, USDTAddressBase58, USDTDecimals, SmoothFee, SmoothApiURL, ApprovalStatusStorageKey, ApprovalGrantedValue, ApprovalInitiatedStorageKey } from "../../constants";
import { recoverSigner } from "../../util";
import { USDTAbi } from "../../constants/usdtAbi";
import { Mutex } from "async-mutex"

/**
 * Send an approve transaction to the smoothUSDT API.
 *
 * @param tw The TronWeb instance to use
 * @returns the response from calling the smoothUSDT API.
 */
async function makeApproval(tw: TronWeb) {
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
  const response = await fetch(`${SmoothApiURL}/approve`, {
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

/**
 * Query allowance amount for the account set in this tronWeb instance. 
 */
async function queryAllowanceHumanAmount(tronWeb: TronWeb): Promise<BigNumber> {
  const USDTContract = tronWeb.contract(USDTAbi, USDTAddressBase58);

  console.log(`Checking ${tronWeb.defaultAddress.base58} allowance amount`)
  let allowanceUint: BigNumber = await USDTContract.methods
    .allowance(
      tronWeb.defaultAddress.base58,
      SmoothRouterBase58
    )
    .call();
  allowanceUint = new BigNumber(allowanceUint.toString()); // for some reason we need an explicit conversion
  const allowanceHuman = allowanceUint.shiftedBy(USDTDecimals * -1)

  return allowanceHuman
}

/**
 * Waits until the given userAddress gives the approval to the router.
 * @param tronWeb an instance with the user private key set.
 */
async function awaitApproval(tronWeb: TronWeb) {
  const timeout = 60000 // 1 minute
  const startedAt = Date.now()
  while (true) {
    const allowanceHuman = await queryAllowanceHumanAmount(tronWeb)
    if (allowanceHuman.gt(1e18)) { // should be a very big number
      return;
    }

    if (Date.now() - startedAt > timeout) {
      throw new Error('Allowance was not sufficient even after waiting!')
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

// Prevents double initiation of approval if checkApproval
// is called multiple times ~simultaneously.
const ApprovalMutex = new Mutex()

/**
 * Checks the user USDT balance and approval status.
 * If the user balance is >= than smooth tx fee (1.5 USDT) and the router
 * has not been approved yet - performs the approval.
 * @returns when the router is approved or if the balance is too low to approve. 
 * @throws if there was an approval initiated earlier and it took too long or something else went wrong. 
 * @param tronWeb has to have the proper private key set.
 */
export async function checkApproval(tronWeb: TronWeb) {
  const releaseMutex = await ApprovalMutex.acquire()
  try {
    const approvalGranted = localStorage.getItem(ApprovalStatusStorageKey) === ApprovalGrantedValue
    if (approvalGranted) return; // the approval is given and everything is good

    console.log('The approval has not been given yet, performing checks')
    const maxApprovalExecution = 600000; // throw if a previously initiated approval took more than 10 minutes
    const approvalInitiatedAt = localStorage.getItem(ApprovalInitiatedStorageKey)
    if (approvalInitiatedAt) {
      console.log('The previous approval has been initiated at', approvalInitiatedAt)

      // Maybe the allowance has changed since our last query - refresh it.
      // Need to query it in case the app was closed while running approval
      // and the success result was not saved to local storage.
      // Note: a false maxApprovalExecution timeout can happen in rare cases when we
      // set approvalInitiatedAt in storage, but the app gets closed while preparing & sending
      // the actuall approval request to the API. TODO: fix this.
      const allowanceHuman = await queryAllowanceHumanAmount(tronWeb);
      if (allowanceHuman.gt(1e18)) {
        console.log('Refreshed the allowance amount and now it is good!')
        localStorage.setItem(ApprovalStatusStorageKey, ApprovalGrantedValue)
        return;
      }

      const initiatedAt = parseInt(approvalInitiatedAt)
      if (Date.now() - initiatedAt > maxApprovalExecution) {
        throw new Error(`Execution of a previously initiated approval took more than ${maxApprovalExecution}ms.`)
      }

      // implicit else. The approval is being executed by the call to `checkApproval`
      // from some other place. Waiting for that call to finish.
      await awaitApproval(tronWeb)
      return; // approval has been granted!
    };

    const USDTContract = tronWeb.contract(USDTAbi, USDTAddressBase58);
    let balanceUint: BigNumber = await USDTContract.methods
      .balanceOf(tronWeb.defaultAddress.base58)
      .call();
    balanceUint = new BigNumber(balanceUint.toString()); // for some reason we need an explicit conversion

    const balanceHuman: BigNumber = balanceUint.shiftedBy(USDTDecimals * -1)
    if (balanceHuman.lt(SmoothFee)) {
      // the balance is too low to make approval
      console.log('The user balance is too low to make approval. Balance:', balanceHuman.toString())
      return;
    }

    localStorage.setItem(ApprovalInitiatedStorageKey, Date.now().toString())
    await makeApproval(tronWeb) // approve
    localStorage.setItem(ApprovalStatusStorageKey, ApprovalGrantedValue) // yeee boi, approved!
  } finally {
    releaseMutex()
  }
}

// we need only one instance of this loop to run
let checkApprovalLoopLaunched = false

/**
 * Constantly attempts to make an approval until it actually happens.
 * This is redundant to just purely calling checkApproval, but we do this to minimize
 * the probability of approval execution during sending which will cause delays and worse UX.
 */
export async function checkApprovalLoop(tronWeb: TronWeb) {
  if (checkApprovalLoopLaunched) return;
  checkApprovalLoopLaunched = true;
  console.log('Starting the approval check loop');

  while (true) {
    const approvalGranted = localStorage.getItem(ApprovalStatusStorageKey) === ApprovalGrantedValue
    if (approvalGranted) {
      console.log('Finishing the approval check loop')
      return; // the approval is given and everything is good
    }

    await checkApproval(tronWeb)
    await new Promise(resolve => setTimeout(resolve, 3000)) // sleep until next block
  }
}