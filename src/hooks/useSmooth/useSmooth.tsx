import { CheckApprovalResult, checkApproval } from "./approve";
import { transferViaRouter } from "./transfer";
import { usePostHog } from "posthog-js/react";
import { BigNumber } from "tronweb";
import { tronweb } from "@/constants";

export const useSmooth = (): [
  () => Promise<[boolean, CheckApprovalResult]>,
  (to: string, amt: BigNumber) => Promise<{ txID: string }>,
] => {
  const posthog = usePostHog();

  // TODO: maybe better define these with useCallback
  return [
    () => checkApproval(tronweb, posthog),
    (to: string, amt: BigNumber) => transferViaRouter(tronweb, to, amt, posthog),
  ];
};
