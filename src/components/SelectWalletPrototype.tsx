import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { WalletActionButton } from "@tronweb3/tronwallet-adapter-react-ui";

export function SelectWalletPrototype() {
    const { address, wallet } = useWallet();
    
    return (
        <div>
            <WalletActionButton />
            <p>Current Address: {address}</p>
            <p>Connection Status: {wallet?.state}</p>
        </div>
    );
}