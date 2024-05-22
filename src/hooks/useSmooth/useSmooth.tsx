import { useEffect } from "react";
import { useTronWeb } from "../useTronWeb";
import { checkApproval, checkApprovalLoop } from "./approve";
import { transferViaRouter } from "./transfer";
import { usePostHog } from "posthog-js/react";

/** Use within a `<TronWebProvider/>` to get access to the SmoothUSDT API. */
export const useSmooth = (): [
  () => Promise<void>,
  (to: string, amt: number) => Promise<{ txID: string }>,
] => {
  const posthog = usePostHog();
  const tw = useTronWeb();

  useEffect(() => {
    // run only once - upon initial setup
    checkApprovalLoop(tw, posthog); // fire and forget
  }, [tw, posthog]);

  // TODO: maybe better define these with useCallback
  return [
    () => checkApproval(tw, posthog),
    (to: string, amt: number) => transferViaRouter(tw, to, amt, posthog),
  ];
};
