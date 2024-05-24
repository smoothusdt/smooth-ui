import { checkApproval } from "./approve";
import { transferViaRouter } from "./transfer";
import { usePostHog } from "posthog-js/react";
import { useWallet } from "../useWallet";

/** Use within a `<WalletProvider/>` to get access to the SmoothUSDT API. */
export const useSmooth = (): [
  () => Promise<boolean>,
  (to: string, amt: number) => Promise<{ txID: string }>,
] => {
  const posthog = usePostHog();
  const { tw } = useWallet();

  // TODO: maybe better define these with useCallback
  return [
    () => checkApproval(tw, posthog),
    (to: string, amt: number) => transferViaRouter(tw, to, amt, posthog),
  ];
};
