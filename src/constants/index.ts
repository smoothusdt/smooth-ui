import { TronWeb } from "tronweb";
import { NetworkConfig } from "./networkConfig";

// misc constants
export const ChainID = NetworkConfig.chainId;
export const ChainName = NetworkConfig.chainName;

// Tronscan
export const TronscanApi = NetworkConfig.tronscanApi
export const ExplorerUrl = NetworkConfig.explorerUrl

// tokens constants
export const USDTAddressBase58 = NetworkConfig.usdtAddressBase58;
export const USDTDecimals = 6;
export const TRXDecimals = 6;

// smooth onchain constants
export const SmoothFeeCollector = "TVMyApMywQDgLjzTJMF7SRWZefKnPHJw5T";
export const PolarBearBase58 = NetworkConfig.polarBearBase58

// Base URL of the smooth USDT API
export const SmoothApiURL = NetworkConfig.smoothApiURL;

export const tronweb = new TronWeb({
    fullHost: NetworkConfig.rpcUrl,
    privateKey: "01"
});

export const StoragePrefix = "@Smooth"
export const WalletStorageKey = `${StoragePrefix}/wallet`
export const SignerStorageKey = `${StoragePrefix}/signer`
export const PreferencesStorageKey = `${StoragePrefix}/preferences`