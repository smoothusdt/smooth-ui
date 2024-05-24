import { BigNumber } from "tronweb";
import { useEffect, useState } from "react";
import { USDTAddressBase58, USDTDecimals } from "../constants";
import { USDTAbi } from "../constants/usdtAbi";
import { useWallet } from "./useWallet";

/** Use within `<WalletProvider />` to get the current wallets USDT Balance. */
export const useUSDTBalance = () => {
  const { wallet, connected, tw } = useWallet();

  // TODO: cache this and void going to the network every time?
  const [balance, setBalance] = useState<number | undefined>();
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
