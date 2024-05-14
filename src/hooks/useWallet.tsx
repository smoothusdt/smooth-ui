import { useEffect } from "react";
import { createStateContext } from "react-use";
import { TronWeb } from "tronweb";

export interface Wallet {
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
 * Use this hook to access the wallet of the user instance inside a `<WalletProvider/>`
 */
export const useWallet = () => {
  const [wallet, setWallet] = useWalletContext(); // TODO: Persist the wallet in IndexedDB or localstorage

  // When the app loads, check for a .env key and use that
  useEffect(() => {
    const key = import.meta.env.VITE_USER_PRIVATE_KEY;
    if (key) {
      setKey(key);
    }
  }, []);

  /** Is there a connected? */
  const connected = wallet !== null;

  /** setKey sets the private key of the wallet. Accepts 0x prefix and no prefix.*/
  const setKey = (privateKey: string) => {
    // Accepts 0x prefix and no prefix.
    let key = privateKey;
    if (privateKey.startsWith("0x")) {
      key = privateKey.slice(2);
      console.log("removing 0x: " + key);
    }

    // Verify this is a legitimate key
    // TODO: Any other verification?
    const address = TronWeb.address.fromPrivateKey(key);
    if (!address || !TronWeb.isAddress(address)) {
      throw new Error("Could not set key");
    }

    setWallet({ privateKey: key, address });
  };

  // TODO: How to make it so that wallet is not typed as null when connected = true?
  return { wallet, connected, setKey };
};
