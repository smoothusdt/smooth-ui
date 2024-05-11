import { BigNumber } from "tronweb";
import { useTronWeb } from "./useTronWeb";
import { useEffect, useState } from "react";
import {
  USDTAddressBase58,
  USDTDecimals,
  privateKey,
} from "./useSmooth/constants";
import { USDTAbi } from "./useSmooth/constants/usdtAbi";

export const useUSDTBalance = () => {
  const tw = useTronWeb();
  const fromBase58 = tw.address.fromPrivateKey(privateKey) as string;
  const USDTContract = tw.contract(USDTAbi, USDTAddressBase58);

  const [balance, setBalance] = useState<number | undefined>();

  useEffect(() => {
    async function getBalance() {
      let balanceUint: BigNumber = await USDTContract.methods
        .balanceOf(fromBase58)
        .call();
      balanceUint = BigNumber(balanceUint.toString()); // for some reason we need an explicit conversion

      const balanceHuman: BigNumber = balanceUint.dividedBy(
        BigNumber(10).pow(USDTDecimals),
      );
      setBalance(balanceHuman.toNumber());
    }
    getBalance();
  });

  return balance;
};
