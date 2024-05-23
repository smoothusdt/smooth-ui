import { BigNumber } from "tronweb";
import { useEffect, useState } from "react";
import { USDTAddressBase58, USDTDecimals } from "../constants";
import { USDTAbi } from "../constants/usdtAbi";
import { useWallet } from "./useWallet";
import { useTronWeb } from "./useTronWeb";
import { useSmooth } from "./useSmooth/useSmooth";

/** Use within a `<TronWebProvider/>` and `<WalletProvider />` to get the current wallets USDT Balance. */
export const useUSDTBalance = () => {
  const [checkApproval, _] = useSmooth();
  const { wallet, connected } = useWallet();
  const tw = useTronWeb();

  // TODO: cache this and void going to the network every time?
  const [balance, setBalance] = useState<number | undefined>();

  useEffect(() => {
    checkApproval(); // fire and forget
  }, [balance, checkApproval]);

  const USDTContract = tw.contract(USDTAbi, USDTAddressBase58);

  useEffect(() => {
    async function getBalance() {
      if (!connected) {
        return;
      }

      let balanceUint: BigNumber = await USDTContract.methods
        .balanceOf(wallet!.address)
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
