interface NetworkConfigInterface {
  chainId: number;
  chainName: string;
  rpcUrl: string;
  usdtAddressBase58: string;
  justLendBase58: string;
  routerBase58: string;
  relayerMinEnergy: number;
  delegateTrxForApproval: number;
  tronProApiKey?: string;
}

const MainnetConfig: NetworkConfigInterface = {
  chainId: 728126428,
  chainName: "mainnet",
  rpcUrl: "https://api.trongrid.io",
  usdtAddressBase58: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  justLendBase58: "TU2MJ5Veik1LRAgjeSzEdvmDYx7mefJZvd",
  routerBase58: "", // TODO: deploy the updated version
  relayerMinEnergy: 150_000,
  delegateTrxForApproval: 8000_000000,
};

const ShastaConfig: NetworkConfigInterface = {
  chainId: 2494104990,
  chainName: "shasta",
  rpcUrl: "https://api.shasta.trongrid.io",
  usdtAddressBase58: "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs",
  justLendBase58: "TQgSxmKZBP2e1vs9PrgiLFUcrd2wGXPEA9",
  routerBase58: "TFAiKcphiJwyLNw2iQ9iJJauvz7PboisEH",
  relayerMinEnergy: 0,
  delegateTrxForApproval: 1000_000000,
  tronProApiKey: import.meta.env.VITE_TRON_PRO_API_KEY,
};

export let NetworkConfig: NetworkConfigInterface;
const chain = import.meta.env.VITE_CHAIN;

if (chain === "mainnet") {
  NetworkConfig = MainnetConfig;
} else if (chain === "shasta") {
  NetworkConfig = ShastaConfig;
} else {
  throw new Error("CHAIN .env variable not set or wrong");
}
