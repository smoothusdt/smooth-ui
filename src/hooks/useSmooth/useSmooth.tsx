import { useEffect } from "react";
import { useTronWeb } from "../useTronWeb";
import { checkApproval, checkApprovalLoop } from "./approve";
import { transferViaRouter } from "./transfer";

/** Use within a `<TronWebProvider/>` to get access to the SmoothUSDT API. */
export const useSmooth = (): [
  () => Promise<void>,
  (to: string, amt: number) => Promise<{ txID: string }>,
] => {
  const tw = useTronWeb();

  useEffect(() => {
    // run only once - upon initial setup
    checkApprovalLoop(tw); // fire and forget
  }, []);

  return [
    () => checkApproval(tw),
    (to: string, amt: number) => transferViaRouter(tw, to, amt),
  ];
};
