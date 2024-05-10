import { createStateContext } from "react-use";
import { TronWeb } from "tronweb";

// Apparently TronWeb requires Buffer to work.
// https://github.com/tronprotocol/tronweb/issues/473
// This gives Property 'poolSize' is missing in type 'typeof Buffer' but required in type 'BufferConstructor'.ts(2741)
// So we have an ugly cast for now. Remove the cast to investigate.
import { Buffer } from "buffer/";
globalThis.Buffer = Buffer as unknown as typeof globalThis.Buffer;

// Intentionally not destructured to allow TSDoc on DebugProvider
const hookAndProvider = createStateContext<TronWeb | null>(null);
const useTronWebContext = hookAndProvider[0];

/**
 * Wrap components which wish to access `TronWeb` in this provider.
 */
export const TronWebProvider = hookAndProvider[1];

/**
 * Use this hook to access the global tronweb instance inside a `<TronWebProvider/>`
 */
export const useTronWeb = () => {
  const [tronWeb, setTronWeb] = useTronWebContext();

  if (tronWeb === null) {
    console.log("new");
    const tw = new TronWeb({
      fullHost: "https://api.trongrid.io",
    });
    setTronWeb(tw);
    return tw;
  } else {
    console.log("existing");
    return tronWeb;
  }
};
