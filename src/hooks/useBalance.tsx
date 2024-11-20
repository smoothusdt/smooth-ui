import { BigNumber } from "tronweb";
import { useCallback, useEffect, useState } from "react";
import { tronweb, USDTAddressBase58, USDTDecimals } from "../constants";
import { USDTAbi } from "../constants/usdtAbi";
import { useWallet } from "./useWallet";
import { loadWalletCache, updateCachedBalance } from "@/storage";

export async function fetchUsdtBalance(tronUserAddress: string): Promise<BigNumber> {
  const USDTContract = tronweb.contract(USDTAbi, USDTAddressBase58);
  let balanceUint: BigNumber = await USDTContract.methods
    .balanceOf(tronUserAddress)
    .call();
  balanceUint = BigNumber(balanceUint.toString()); // for some reason we need an explicit conversion

  const balanceHuman: BigNumber = balanceUint.dividedBy(
    BigNumber(10).pow(USDTDecimals),
  );

  return balanceHuman
}

export const useUSDTBalance = (): [BigNumber | undefined, () => Promise<void>] => {
  const { tronUserAddress } = useWallet();

  const [balance, setBalance] = useState<BigNumber | undefined>();

  const refreshBalance = useCallback(async () => {
    if (!tronUserAddress) {
      return;
    }
    const cache = loadWalletCache(tronUserAddress)
    if (balance === undefined && cache) setBalance(cache.balance)

    const newBalance = await fetchUsdtBalance(tronUserAddress)
    setBalance(newBalance);
    updateCachedBalance(tronUserAddress, newBalance)
    console.log("Updated balance")
  }, [tronUserAddress]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return [balance, refreshBalance];
};
