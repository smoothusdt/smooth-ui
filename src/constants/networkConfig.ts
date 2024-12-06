interface NetworkConfigInterface {
  chainId: number;
  chainName: string;
  rpcUrl: string;
  usdtAddressBase58: string;
  polarBearBase58: string;
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
  polarBearBase58: "TUus5B7H2DjHiZQnodTo1fMqiwoXUqkmpo",
  tronscanApi: "https://apilist.tronscanapi.com/api",
  explorerUrl: 'https://tronscan.org/#',
  smoothApiURL: 'https://api.smoothusdt.com',
};

const ShastaConfig: NetworkConfigInterface = {
  chainId: 2494104990,
  chainName: "shasta",
  rpcUrl: "https://api.shasta.trongrid.io",
  usdtAddressBase58: "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs",
  polarBearBase58: "TWmLqMhgwHZzYsQmmUHU9SnQx9bhgNNqFx",
  tronProApiKey: import.meta.env.VITE_TRON_PRO_API_KEY,
  tronscanApi: "https://shastapi.tronscan.org/api",
  explorerUrl: 'https://shasta.tronscan.org/#',
  smoothApiURL: 'https://shasta-api.smoothusdt.com'
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
