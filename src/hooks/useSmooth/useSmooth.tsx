import { CheckApprovalResult, checkApproval } from "./approve";
import { transferViaRouter } from "./transfer";
import { usePostHog } from "posthog-js/react";
import { useWallet } from "../useWallet";
import { BigNumber } from "tronweb";

/** Use within a `<WalletProvider/>` to get access to the SmoothUSDT API. */
export const useSmooth = (): [
  () => Promise<[boolean, CheckApprovalResult]>,
  (to: string, amt: BigNumber) => Promise<{ txID: string }>,
] => {
  const posthog = usePostHog();
  const { tw } = useWallet();

  // TODO: maybe better define these with useCallback
  return [
    () => checkApproval(tw, posthog),
    (to: string, amt: BigNumber) => transferViaRouter(tw, to, amt, posthog),
  ];
};
