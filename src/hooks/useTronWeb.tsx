import { createStateContext } from "react-use";
import { TronWeb } from "tronweb";
import { NetworkConfig } from "../constants/networkConfig";

// Apparently TronWeb requires Buffer to work.
// https://github.com/tronprotocol/tronweb/issues/473
// This gives Property 'poolSize' is missing in type 'typeof Buffer' but required in type 'BufferConstructor'.ts(2741)
// So we have an ugly cast for now. Remove the cast to investigate.
import { Buffer } from "buffer/";
import { useEffect } from "react";
import { useWallet } from "./useWallet";
globalThis.Buffer = Buffer as unknown as typeof globalThis.Buffer;

// Intentionally not destructured to allow TSDoc on the provider
const hookAndProvider = createStateContext<TronWeb | null>(null);
const useTronWebContext = hookAndProvider[0];

/**
 * Wrap components which wish to access `TronWeb` in this provider.
 *
 * Note that currently `TronWebProvider` needs to be wrapped in a `WalletProvider` (for access to keys)
 */
export const TronWebProvider = hookAndProvider[1];

/**
 * Use this hook to access the global `TronWeb` instance inside a `<TronWebProvider/>`
 * TODO: Hook should take network argument
 */
export const useTronWeb = () => {
  const [tronWeb, setTronWeb] = useTronWebContext();
  const { wallet, connected } = useWallet();

  // When the wallet is connected, keep the tronWeb instance up to date
  useEffect(() => {
    if (connected && wallet && tronWeb) {
      // Apparently: Do not use this with any web/user facing TronWeb instances. This will leak the private key.
      // https://tronweb.network/docu/docs/6.0.0-beta.1/API%20List/utils/setPrivateKey
      console.log("setting tronweb keys");
      tronWeb.setPrivateKey(wallet.privateKey);
      tronWeb.setAddress(wallet.address);
    }
  }, [connected, tronWeb, wallet]);

  if (tronWeb === null) {
    const tw = new TronWeb({
      fullHost: NetworkConfig.rpcUrl,
      // Don't need API key to interact with Shasta https://github.com/tronprotocol/tronweb/issues/494#issuecomment-2006761745
      // headers: {
      //   "TRON-PRO-API-KEY": NetworkConfig.tronProApiKey,
      // } as any,
      privateKey: wallet?.privateKey,
    });
    setTronWeb(tw);
    return tw;
  } else {
    return tronWeb;
  }
};
