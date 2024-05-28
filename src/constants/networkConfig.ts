interface NetworkConfigInterface {
  chainId: number;
  chainName: string;
  rpcUrl: string;
  usdtAddressBase58: string;
  routerBase58: string;
  tronProApiKey?: string;
  tronscanApi: string;
  explorerUrl: string;
  smoothApiURL: string
}

const MainnetConfig: NetworkConfigInterface = {
  chainId: 728126428,
  chainName: "mainnet",
  rpcUrl: "https://api.trongrid.io",
  usdtAddressBase58: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  routerBase58: "", // TODO: deploy the updated version
  tronscanApi: "https://apilist.tronscanapi.com/api",
  explorerUrl: 'https://tronscan.org/#',
  smoothApiURL: ''// TODO: deploy separate apis for shasta and mainnet
};

const ShastaConfig: NetworkConfigInterface = {
  chainId: 2494104990,
  chainName: "shasta",
  rpcUrl: "https://api.shasta.trongrid.io",
  usdtAddressBase58: "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs",
  routerBase58: "TFAiKcphiJwyLNw2iQ9iJJauvz7PboisEH",
  tronProApiKey: import.meta.env.VITE_TRON_PRO_API_KEY,
  tronscanApi: "https://shastapi.tronscan.org/api",
  explorerUrl: 'https://shasta.tronscan.org/#',
  smoothApiURL: 'https://smooth-shasta.onrender.com'
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
