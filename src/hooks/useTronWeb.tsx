import { createStateContext } from "react-use";
import { TronWeb } from "tronweb";
import { NetworkConfig } from "./useSmooth/constants/networkConfig";

// Apparently TronWeb requires Buffer to work.
// https://github.com/tronprotocol/tronweb/issues/473
// This gives Property 'poolSize' is missing in type 'typeof Buffer' but required in type 'BufferConstructor'.ts(2741)
// So we have an ugly cast for now. Remove the cast to investigate.
import { Buffer } from "buffer/";
import { privateKey } from "./useSmooth/constants";
globalThis.Buffer = Buffer as unknown as typeof globalThis.Buffer;

// Intentionally not destructured to allow TSDoc on DebugProvider
const hookAndProvider = createStateContext<TronWeb | null>(null);
const useTronWebContext = hookAndProvider[0];

/**
 * Wrap components which wish to access `TronWeb` in this provider.
 */
export const TronWebProvider = hookAndProvider[1];

/**
 * Use this hook to access the global `TronWeb` instance inside a `<TronWebProvider/>`
 * TODO: Hook should take network argument
 */
export const useTronWeb = () => {
  const [tronWeb, setTronWeb] = useTronWebContext();

  if (tronWeb === null) {
    const tw = new TronWeb({
      fullHost: NetworkConfig.rpcUrl,
      headers: {
        "TRON-PRO-API-KEY": NetworkConfig.tronProApiKey,
      } as any,
      privateKey: privateKey,
    });
    setTronWeb(tw);
    return tw;
  } else {
    return tronWeb;
  }
};
