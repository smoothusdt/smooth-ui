import { BigNumber } from "tronweb"
import { WalletStorageKey } from "./constants"
import { HistoricalTransaction } from "./history"

export interface WalletCache {
    tronAddress: string
    history: HistoricalTransaction[]
    balance: BigNumber
}

export function loadWalletCache(tronAddress: string): WalletCache | undefined {
    const raw = window.localStorage.getItem(WalletStorageKey)
    if (!raw) return;

    let decoded: WalletCache = JSON.parse(raw)
    if (decoded.tronAddress !== tronAddress) return;

    return decoded;
}

function setWalletCache(cache: WalletCache) {
    window.localStorage.setItem(WalletStorageKey, JSON.stringify(cache))
}

export function updateCachedBalance(tronAddress: string, newBalance: BigNumber) {
    let cache = loadWalletCache(tronAddress)
    
    if (!cache) {
        cache = {
            balance: newBalance,
            tronAddress,
            history: []
        }
    } else {
        cache.balance = newBalance
    }

    setWalletCache(cache)
}

export function updateCachedHistory(tronAddress: string, newHistory: HistoricalTransaction[]) {
    let cache = loadWalletCache(tronAddress)

    if (!cache) {
        cache = {
            balance: new BigNumber(0),
            tronAddress,
            history: newHistory
        } 
    } else {
        cache.history = newHistory
    }

    setWalletCache(cache)
} 