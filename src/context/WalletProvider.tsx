import { hookAndProvider } from "@/hooks/useWallet";

/**
 * Wrap components which wish to access the users wallet in this provider.
 * Needs to be in a separate file from the hooks for fast refresh to work.
 */
export const WalletProvider = hookAndProvider[1];
