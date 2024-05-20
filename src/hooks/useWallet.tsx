import { useEffect } from "react";
import { createStateContext } from "react-use";
import { TronWeb } from "tronweb";
import { Mnemonic } from "tronweb/utils";
import { MnemonicStorageKey } from "./useSmooth/constants";

export interface Wallet {
  mnemonic: Mnemonic;
  privateKey: string /** Private key without 0x */;
  address: string;
}

// Intentionally not destructured to allow TSDoc on the provider
const hookAndProvider = createStateContext<Wallet | null>(null);
const useWalletContext = hookAndProvider[0];

/**
 * Wrap components which wish to access the users wallet in this provider.
 */
export const WalletProvider = hookAndProvider[1];

/**
 * Abstracting to a separate function so that later it's easier to replace this
 * with a more secure approach.
 */
function storeMnemonic(mnemonic: string) {
  localStorage.setItem(MnemonicStorageKey, mnemonic);
}

export function retrieveMnemonic(): string | null {
  return localStorage.getItem(MnemonicStorageKey);
}

/**
 * Use this hook to access the wallet of the user instance inside a `<WalletProvider/>`
 */
export const useWallet = () => {
  const [wallet, setWallet] = useWalletContext();

  useEffect(() => {
    // Check for a .env key and use that. For debugging only!
    const mnemonic = import.meta.env.VITE_USER_MNEMONIC;
    if (mnemonic) {
      setMnemonic(mnemonic);
      return;
    }
  }, []);

  /** Is there a connected? */
  const connected = wallet !== null;

  /** sets mnemonic and the derived private key and user base58 address */
  const setMnemonic = (rawMnemonic: string) => {
    const { mnemonic, privateKey, address } = TronWeb.fromMnemonic(
      rawMnemonic.trim(),
    );
    if (!mnemonic) {
      throw new Error("Bad mnemonic entered. Couldnt set it.");
    }
    const trimmedKey = privateKey.slice(2); // remove the 0x prefix

    storeMnemonic(mnemonic.phrase);
    setWallet({ mnemonic, privateKey: trimmedKey, address });
    console.log("Set wallet");
  };

  /** Generates a fresh new mnemonic */
  const newMnemonic = (): string => {
    const newWallet = TronWeb.createRandom();
    return newWallet.mnemonic!.phrase;
  };

  // TODO: How to make it so that wallet is not typed as null when connected = true?
  return {
    wallet,
    connected,
    setMnemonic,
    newMnemonic,
  };
};
