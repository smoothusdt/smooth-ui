// import { WalletStorageKey } from "@/constants";
import { usePrivy } from "@privy-io/react-auth"

export function Welcome() {
    const { login } = usePrivy();
    // localStorage.setItem(WalletStorageKey, JSON.stringify({
    //     tronAddress: "TGQVAn7BQBrW8KHn4m3JHYaNoSdv1cvpET",
    //     history: [],
    //     balance: "0"
    // }))

    return <button onClick={login}>log in</button>
}