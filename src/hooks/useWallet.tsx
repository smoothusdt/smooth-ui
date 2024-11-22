import { WalletStorageKey } from "@/constants";
import { fetchUsdtBalance, HistoricalTransaction, queryUsdtHistory } from "@/chainQuery";
import { createContext, Dispatch, useContext, useReducer } from "react";
import { BigNumber } from "tronweb";

function saveWalletToStorage(wallet: StoredWallet) {
  console.log("Saving wallet to storage", wallet.balance.toString())
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

export function logIn(tronAddress: string) {
  saveWalletToStorage({
    balance: new BigNumber(0),
    history: [],
    tronAddress,
  })
}

export function logOut() {
  window.localStorage.removeItem(WalletStorageKey)
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

type Action =
  { type: "UpdateBalance"; newBalance: BigNumber } |
  { type: "AddTransactions"; transactions: HistoricalTransaction[] }

interface IWalletContext {
  wallet: StoredWallet | undefined
  dispatch: Dispatch<Action>
}

// the value is set in WalletProvider always
const WalletContext = createContext<IWalletContext>(undefined as any)

function reducer(state: StoredWallet | undefined, action: Action): StoredWallet | undefined {
  if (state === undefined) throw new Error("state is undefined in wallet reducer")

  let newState: StoredWallet
  if (action.type === "UpdateBalance") {
    newState = { ...state, balance: action.newBalance }
  } else if (action.type === "AddTransactions") {
    // Add transactions to history that are not there yet
    const newHistory = [...state.history]
    for (let newTx of action.transactions) {
      if (!newHistory.some((el) => el.txID === newTx.txID)) {
        newHistory.push(newTx)
      }
    }

    // Sort by timestamp, most recent transactions first
    newHistory.sort((a, b) => {
      if (a.timestamp < b.timestamp) return 1;
      if (a.timestamp === b.timestamp) return 0;
      else return -1;
    })
    
    return {...state, history: newHistory}
  } else {
    throw new Error(`Unexpected action ${(action as any).type} in wallet reducer`)
  }

  saveWalletToStorage(newState)
  return newState
}

// Using a reducer because there is a chance of concurrent updates
// (e.g. simoultaneous balance and history update) and in this case
// the mazafucking state gets stale if we use the traditional useState.
export function WalletProvider(props: { children: any }) {
  const [wallet, dispatch] = useReducer(reducer, loadWallet())

  return (
    <WalletContext.Provider value={{
      wallet,
      dispatch
    }}>
      {props.children}
    </WalletContext.Provider>
  );
}

// Only to be used when we know the user is logged in
export function useWallet() {
  const { wallet, dispatch } = useContext(WalletContext)
  if (wallet === undefined) throw new Error("wallet is undefined in useWallet")

  const findTransaction = (txID: string): HistoricalTransaction | undefined => {
    return wallet.history.find((tx) => tx.txID === txID)
  }

  const addTransactions = (transactions: HistoricalTransaction[]) => {
    dispatch({
      type: "AddTransactions",
      transactions
    })
    console.log("Added transactions")
  }

  const updateBalance = (newBalance: BigNumber) => {
    dispatch({
      type: "UpdateBalance",
      newBalance
    })
    console.log("Updated balance")
  }

  const refreshHistory = async () => {
    const newHistory = await queryUsdtHistory(wallet.tronAddress);
    addTransactions(newHistory);
    console.log("Refreshed history")
  }

  const refreshBalance = async () => {
    const newBalance = await fetchUsdtBalance(wallet.tronAddress)
    updateBalance(newBalance)
    console.log("Refreshed balance")
  }

  return {
    wallet,
    findTransaction,
    addTransactions,
    refreshHistory,
    refreshBalance
  }
}
