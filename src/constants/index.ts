import { BigNumber, TronWeb } from "tronweb";
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
export const SmoothAdminBase58 = NetworkConfig.adminBase58;
export const SmoothFeeCollector = "TPvSv9BofZrXP4NtkuSmY6X4qFt41yEF6x";
export const TransferTopic = "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

// The fee (in USDT) that the user pays
export const SmoothFee = new BigNumber("1.5");

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