import { tronweb } from "@/constants";
import { calculateWalletAddress } from "@/util";
import { usePrivy } from "@privy-io/react-auth";
import { Hex } from "viem";

export function useWallet() {
  const { user } = usePrivy();

  let tronUserAddress: string | undefined = undefined;

  if (user?.wallet?.address) {
    const signerAddress = user.wallet.address as Hex
    tronUserAddress = tronweb.address.fromHex(calculateWalletAddress(signerAddress))
  }

  return { tronUserAddress }
}