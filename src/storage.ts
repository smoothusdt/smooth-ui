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

    let decoded: { tronAddress: string, history: any[], balance: string } = JSON.parse(raw)
    if (decoded.tronAddress !== tronAddress) return;

    const parsedBalance = new BigNumber(decoded.balance)
    const parsedHistory: HistoricalTransaction[] = decoded.history.map((el) => ({
        txID: el.txID,
        amount: new BigNumber(el.amount),
        fee: new BigNumber(el.fee),
        from: el.from,
        to: el.to,
        timestamp: el.timestamp
    }))

    return {
        balance: parsedBalance,
        history: parsedHistory,
        tronAddress: decoded.tronAddress
    };
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

export function addTransaction(tronAddress: string, transaction: HistoricalTransaction) {
    let cache = loadWalletCache(tronAddress)

    if (!cache) {
        cache = {
            balance: new BigNumber(0),
            tronAddress,
            history: [transaction]
        }
    } else {
        if (cache.history.some((el) => el.txID === transaction.txID)) return; // already in history
        cache.history = [transaction].concat(cache.history)
    }

    setWalletCache(cache)
}

export function findTransaction(tronAddress: string, txID: string): HistoricalTransaction | undefined {
    const cache = loadWalletCache(tronAddress)
    const tx = cache?.history.find((el) => el.txID === txID)
    return tx
}