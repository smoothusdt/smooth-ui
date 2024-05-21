import { NetworkConfig } from "./networkConfig";

export interface SmoothResponse {
  success: boolean;
  txID: string;
}
// misc constants
export const ChainID = NetworkConfig.chainId;
export const ChainName = NetworkConfig.chainName;
export const TronscanApi = NetworkConfig.tronscanApi

// tokens constants
export const USDTAddressBase58 = NetworkConfig.usdtAddressBase58;
export const USDTDecimals = 6;
export const TRXDecimals = 6;

// smooth constants
export const SmoothFeeCollector = "TQyMmeSrADWyxZsV6YvVu6XDV8hdq72ykb";
export const SmoothRouterBase58 = NetworkConfig.routerBase58;

// energy constants
export const MinAdminEnergy = NetworkConfig.relayerMinEnergy; // Relayer must always have at least this amount of energy
export const DelegateTrxForApproval = NetworkConfig.delegateTrxForApproval;
export const JustLendBase58 = NetworkConfig.justLendBase58;

// Smooth API

/** Base URL of the smooth USDT API. Note: no trailing slash. */
export const SmoothApiURL = "https://api.smoothusdt.com";
/** How much does smooth charge for a transaction */
export const SmoothFee = 1.5;

export const SmoothStoragePrefix = "@SmoothUSDT"
export const MnemonicStorageKey = `${SmoothStoragePrefix}/userMnemonic`;
export const ApprovalStatusStorageKey = `${SmoothStoragePrefix}/approvalStatus`
export const ApprovalGrantedValue = 'granted'
export const ApprovalInitiatedStorageKey = `${SmoothStoragePrefix}/approvaInitiatedAt` // at what timestamp (in milliseconds) the approval was initiated