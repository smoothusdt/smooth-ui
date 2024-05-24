import { BigNumber, TronWeb } from "tronweb";
import { SmoothRouterBase58, USDTAddressBase58, USDTDecimals, SmoothFee, SmoothApiURL, ApprovalStatusStorageKey, ApprovalGrantedValue } from "../../constants";
import { USDTAbi } from "../../constants/usdtAbi";
import { Mutex } from "async-mutex"
import { PostHog } from "posthog-js";

/**
 * Send an approve transaction to the smoothUSDT API.
 *
 * @param tw The TronWeb instance to use
 * @returns the response from calling the smoothUSDT API.
 */
async function makeApprovalViaApi(tw: TronWeb, posthog: PostHog) {
  console.log("Making approval")
  posthog.capture("Making approval")
  const startTs = Date.now()

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

  // Send approval tx to API and profile.
  const beforeApiCall = Date.now();
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
  const afterApiCall = Date.now()

  const endTs = Date.now()
  posthog.capture("Approval completed", {
    totalInterval: endTs - startTs,
    apiCallInterval: afterApiCall - beforeApiCall,
  })

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

export enum CheckApprovalResult {
  AlreadyGranted, // The approval has already been granted at some point in the past
  GrantedNow, // Made the approval just now
  NotReady, // User balance is too low to make an approval
}

// Prevents double initiation of approval if checkApproval
// is called multiple times ~simultaneously.
const ApprovalMutex = new Mutex()

/**
 * Checks the user USDT balance and approval status.
 * If the user balance is >= than smooth tx fee (1.5 USDT) and the router
 * has not been approved yet - performs the approval.
 * @param tronWeb has to have the proper private key set.
 * @throws if there was an approval initiated earlier and it took too long or something else went wrong. 
 * @returns a boolean (whether the router is now approved or not) + CheckApprovalResult for more details.
 */
export async function checkApproval(tronWeb: TronWeb, posthog: PostHog): Promise<[boolean, CheckApprovalResult]> {
  console.log("Checking approval eligibility")
  const releaseMutex = await ApprovalMutex.acquire()
  try {
    const approvalGranted = localStorage.getItem(ApprovalStatusStorageKey) === ApprovalGrantedValue
    if (approvalGranted) return [true, CheckApprovalResult.AlreadyGranted]; // the approval is given and everything is good

    console.log('The approval has not been given yet, performing checks')
    // Maybe the allowance has changed since our last query - refresh it.
    // Need to query it in case the app was closed while running approval
    // and the success result was not saved to local storage. Or if the user
    // imports a previously initialised Smooth USDT wallet.
    const allowanceHuman = await queryAllowanceHumanAmount(tronWeb);
    if (allowanceHuman.gt(1e18)) {
      posthog.capture("Detected a previously granted approval")
      localStorage.setItem(ApprovalStatusStorageKey, ApprovalGrantedValue)
      return [true, CheckApprovalResult.AlreadyGranted];
    }

    const USDTContract = tronWeb.contract(USDTAbi, USDTAddressBase58);
    let balanceUint: BigNumber = await USDTContract.methods
      .balanceOf(tronWeb.defaultAddress.base58)
      .call();
    balanceUint = new BigNumber(balanceUint.toString()); // for some reason we need an explicit conversion

    const balanceHuman: BigNumber = balanceUint.shiftedBy(USDTDecimals * -1)
    if (balanceHuman.lt(SmoothFee)) {
      // the balance is too low to make approval
      console.log('The user balance is too low to make approval. Balance:', balanceHuman.toString())
      return [false, CheckApprovalResult.NotReady];
    }

    await makeApprovalViaApi(tronWeb, posthog) // approve
    localStorage.setItem(ApprovalStatusStorageKey, ApprovalGrantedValue) // yeee boi, approved!
    return [true, CheckApprovalResult.GrantedNow]
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
export async function checkApprovalLoop(tronWeb: TronWeb, posthog: PostHog) {
  if (checkApprovalLoopLaunched) return;
  checkApprovalLoopLaunched = true;

  const approvalGranted = localStorage.getItem(ApprovalStatusStorageKey) === ApprovalGrantedValue
  if (approvalGranted) return;

  console.log('Starting the approval check loop')
  posthog.capture('Starting the check approval loop');
  for (; ;) {
    try {
      const [granted, _] = await checkApproval(tronWeb, posthog)
      if (granted) {
        console.log('Approval granted! Finishing the check approval loop')
        posthog.capture('Approval granted! Finishing the check approval loop')
        return;
      }
    } catch (e: unknown) {
      console.error("Error in check approval loop", e)
      posthog.capture("error", {
        error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
      });
    }

    await new Promise(resolve => setTimeout(resolve, 3000)) // sleep until next block
  }
}