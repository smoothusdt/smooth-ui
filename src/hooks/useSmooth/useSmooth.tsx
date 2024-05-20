import { useTronWeb } from "../useTronWeb";
import { checkApproval } from "./makeApproval";
import { transferViaRouter } from "./transferViaRouter";

/** Use within a `<TronWebProvider/>` to get access to the SmoothUSDT API. */
export const useSmooth = (): [
  () => Promise<void>,
  (to: string, amt: number) => Promise<{ txID: string }>,
] => {
  const tw = useTronWeb();
  return [
    () => checkApproval(tw),
    (to: string, amt: number) => transferViaRouter(tw, to, amt),
  ];
};
