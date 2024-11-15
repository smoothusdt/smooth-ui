import { hexToBase58Address } from "@/util";
import { usePrivy } from "@privy-io/react-auth";

export function useWallet() {
  const { user } = usePrivy();

  let tronUserAddress: string | undefined = undefined;

  if (user?.wallet?.address) {
    tronUserAddress = hexToBase58Address(user.wallet.address)
  }

  return { tronUserAddress }
}