import { useCallback, useEffect } from "react";
import { createStateContext } from "react-use";
import { TronWeb } from "tronweb";
import { Mnemonic } from "tronweb/utils";
import { MnemonicStorageKey } from "../constants";
import { NetworkConfig } from "@/constants/networkConfig";

// Apparently TronWeb requires Buffer to work.
// https://github.com/tronprotocol/tronweb/issues/473
// This gives Property 'poolSize' is missing in type 'typeof Buffer' but required in type 'BufferConstructor'.ts(2741)
// So we have an ugly cast for now. Remove the cast to investigate.
import { Buffer } from "buffer/";
import { checkApprovalLoop } from "./useSmooth/approve";
import { usePostHog } from "posthog-js/react";
globalThis.Buffer = Buffer as unknown as typeof globalThis.Buffer;

export interface Wallet {
  mnemonic: Mnemonic;
  privateKey: string /** Private key without 0x */;
  address: string;
  tw: TronWeb;
}

// Intentionally not destructured to allow TSDoc on the provider
export const hookAndProvider = createStateContext<Wallet | null>(null);
const useWalletContext = hookAndProvider[0];

/**
 * Abstracting to a separate function so that later it's easier to replace this
 * with a more secure approach.
 */
function storeMnemonic(mnemonic: string) {
  sessionStorage.setItem(MnemonicStorageKey, mnemonic);
  localStorage.setItem(MnemonicStorageKey, mnemonic);
}

function deleteMnemonic() {
  sessionStorage.removeItem(MnemonicStorageKey);
  localStorage.removeItem(MnemonicStorageKey);
}

export function retrieveMnemonic(): string | null {
  return localStorage.getItem(MnemonicStorageKey);
}

const readOnlyTronWeb = new TronWeb({
  fullHost: NetworkConfig.rpcUrl,
  // Don't need API key to interact with Shasta https://github.com/tronprotocol/tronweb/issues/494#issuecomment-2006761745
  // headers: {
  //   "TRON-PRO-API-KEY": NetworkConfig.tronProApiKey,
  // } as any,
});

/**
 * Use this hook to access the wallet of the user instance inside a `<WalletProvider/>`
 */
export const useWallet = () => {
  const posthog = usePostHog();
  const [wallet, setWallet] = useWalletContext();

  /** Is there a connected? */
  const connected = wallet !== null;

  /** sets mnemonic and the derived private key and user base58 address */
  const setMnemonic = useCallback(
    (rawMnemonic: string) => {
      const {
        mnemonic,
        privateKey: privateKey0x,
        address,
      } = TronWeb.fromMnemonic(rawMnemonic.trim());

      if (!mnemonic) {
        throw new Error("Bad mnemonic entered. Couldnt set it.");
      }
      const privateKey = privateKey0x.slice(2); // remove the 0x prefix

      const tw = new TronWeb({
        fullHost: NetworkConfig.rpcUrl,
        // Don't need API key to interact with Shasta https://github.com/tronprotocol/tronweb/issues/494#issuecomment-2006761745
        // headers: {
        //   "TRON-PRO-API-KEY": NetworkConfig.tronProApiKey,
        // } as any,
        privateKey,
      });

      storeMnemonic(mnemonic.phrase);
      setWallet({ mnemonic, privateKey, address, tw });

      checkApprovalLoop(tw, posthog);
    },
    [setWallet, posthog],
  );

  if (!connected) {
    // Attempt to load the secret phrase from session storage
    const phrase = sessionStorage.getItem(MnemonicStorageKey);
    if (phrase) {
      setMnemonic(phrase);
    }
  }

  useEffect(() => {
    // Check for a .env key and use that. For debugging only!
    const mnemonic = import.meta.env.VITE_USER_MNEMONIC;
    if (mnemonic) {
      setMnemonic(mnemonic);
      return;
    }
  }, [setMnemonic]);

  /** Generates a fresh new mnemonic */
  const newMnemonic = (): string => {
    const newWallet = TronWeb.createRandom();
    return newWallet.mnemonic!.phrase;
  };

  const deleteWallet = () => {
    deleteMnemonic();
    setWallet(null);

    // Reset everything
    sessionStorage.clear();
    localStorage.clear();

    // Reload to stop checkApprovalLoop and reset all other runtime things
    window.location.reload();
  };

  // TODO: How to make it so that wallet is not typed as null when connected = true?
  return {
    wallet,
    tw: wallet?.tw || readOnlyTronWeb,
    connected,
    setMnemonic,
    newMnemonic,
    deleteWallet,
  };
};
