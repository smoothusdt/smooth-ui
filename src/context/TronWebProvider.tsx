import { hookAndProvider } from "@/hooks/useTronWeb";

/**
 * Wrap components which wish to access `TronWeb` in this provider.
 * Needs to be in a separate file for fast refresh to work.
 *
 * Note that currently `TronWebProvider` needs to be wrapped in a `WalletProvider` (for access to keys)
 */
export const TronWebProvider = hookAndProvider[1];
