import { BigNumber } from "tronweb";
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
export const SmoothFeeCollector = "TQyMmeSrADWyxZsV6YvVu6XDV8hdq72ykb";
export const SmoothRouterBase58 = NetworkConfig.routerBase58;

// Smooth API
/** Base URL of the smooth USDT API. Note: no trailing slash. */
export const SmoothApiURL = NetworkConfig.smoothApiURL;
/** How much USDT does smooth charge for a transaction */
export const SmoothFee = new BigNumber(1.5);

// Related to window.localStorage
export const SmoothStoragePrefix = "@SmoothUSDT"
export const MnemonicStorageKey = `${SmoothStoragePrefix}/userMnemonic`;
export const ApprovalStatusStorageKey = `${SmoothStoragePrefix}/approvalStatus`
export const ApprovalGrantedValue = 'granted'
