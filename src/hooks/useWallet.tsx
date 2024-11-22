import { WalletStorageKey } from "@/constants";
import { HistoricalTransaction } from "@/history";
import { useState } from "react";
import { BigNumber } from "tronweb";

function saveWalletToStorage(wallet: StoredWallet) {
  window.localStorage.setItem(WalletStorageKey, JSON.stringify(wallet))
}

interface StoredWallet {
  tronAddress: string
  history: HistoricalTransaction[]
  balance: BigNumber
}

export function isLoggedIn() {
  return window.localStorage.getItem(WalletStorageKey) !== null
}

function loadWallet(): StoredWallet | undefined {
  const raw = window.localStorage.getItem(WalletStorageKey)
  if (!raw) return;

  let decoded: { tronAddress: string, history: any[], balance: string } = JSON.parse(raw)

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

// Only to be used when we know the user is logged in
export function useWallet() {
  const [wallet, setWallet] = useState(loadWallet()!)

  const addTransaction = (transaction: HistoricalTransaction) => {
    wallet.history = [transaction].concat(wallet.history)
    setWallet(wallet)
    saveWalletToStorage(wallet)
  }

  const updateBalance = (newBalance: BigNumber) => {
    wallet.balance = newBalance
    setWallet(wallet)
    saveWalletToStorage(wallet)
  }

  const updateHistory = (newHistory: HistoricalTransaction[]) => {
    wallet.history = newHistory
    setWallet(wallet)
    saveWalletToStorage(wallet)
  }

  const findTransaction = (txID: string): HistoricalTransaction | undefined => {
    return wallet.history.find((tx) => tx.txID === txID)
  }

  return {
    wallet,
    addTransaction,
    findTransaction,
    updateBalance,
    updateHistory,
  }
}