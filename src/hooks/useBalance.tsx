import { BigNumber } from "tronweb";
import { useCallback, useEffect, useState } from "react";
import { tronweb, USDTAddressBase58, USDTDecimals } from "../constants";
import { USDTAbi } from "../constants/usdtAbi";
import { useWallet } from "./useWallet";

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
  const { wallet, updateBalance } = useWallet();

  const [balance, setBalance] = useState<BigNumber>(wallet.balance);

  const refreshBalance = useCallback(async () => {
    const newBalance = await fetchUsdtBalance(wallet.tronAddress)
    setBalance(newBalance);
    updateBalance(newBalance)
    console.log("Updated balance")
  }, [wallet]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return [balance, refreshBalance];
};
