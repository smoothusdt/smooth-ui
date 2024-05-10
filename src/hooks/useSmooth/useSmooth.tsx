import { useTronWeb } from "../useTronWeb";
import { makeApproval } from "./makeApproval";
import { transferViaRouter } from "./transferViaRouter";

/** Use within a `<TronWebProvider/>` to get access to the SmoothUSDT API. */
export const useSmooth = () => {
  const tw = useTronWeb();
  return [
    () => makeApproval(tw),
    (to: string, amt: number) => transferViaRouter(tw, to, amt),
  ];
};
