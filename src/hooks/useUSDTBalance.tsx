import { BigNumber } from "tronweb";
import { useCallback, useEffect, useState } from "react";
import { tronweb, USDTAddressBase58, USDTDecimals } from "../constants";
import { USDTAbi } from "../constants/usdtAbi";
import { useWallet } from "./useWallet";

export const useUSDTBalance = (): [number | undefined, () => Promise<void>] => {
  const { tronUserAddress } = useWallet();

  // TODO: cache this and void going to the network every time?
  const [balance, setBalance] = useState<number | undefined>();
  const USDTContract = tronweb.contract(USDTAbi, USDTAddressBase58);

  const refreshBalance = useCallback(async () => {
    if (!tronUserAddress) {
      return;
    }

    let balanceUint: BigNumber = await USDTContract.methods
      .balanceOf(tronUserAddress)
      .call();
    balanceUint = BigNumber(balanceUint.toString()); // for some reason we need an explicit conversion

    const balanceHuman: BigNumber = balanceUint.dividedBy(
      BigNumber(10).pow(USDTDecimals),
    );
    setBalance(balanceHuman.toNumber());
  }, [USDTContract.methods, tronUserAddress]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return [balance, refreshBalance];
};
