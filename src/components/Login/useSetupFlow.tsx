import { SmoothApiURL } from "@/constants"
import { getEncryptedPhrasehash } from "@/hooks/useSigner"
import { WalletContext } from "@/hooks/useWallet"
import { useContext, useState } from "react"
import { TronWeb } from "tronweb"

export function useSetupFlow() {
    const { logIn } = useContext(WalletContext)
    const [secretPhrase, setSecretPhrase] = useState<string>()
    const [pinCode, setPincode] = useState<string>()
    const [encryptionKeyHex, setEncryptionKeyHex] = useState<string>()
    const [tronUserAddress, setTronUserAddress] = useState<string>()

    // 1. Upload pin to the server.
    // 2. Initialize useWallet.
    const onSetupCompleted = async () => {
        const phraseHash = getEncryptedPhrasehash()!
        const tronUserAddress = TronWeb.fromMnemonic(secretPhrase!).address

        const response = await fetch(`${SmoothApiURL}/setEncryptionKey`, {
            method: "POST",
            body: JSON.stringify({
                phraseHash,
                pinCode,
                encryptionKeyHex,
                tronUserAddress
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        if (!data.success) {
            let message = "Couldnt set user pin code"
            if (data.error) message = `${message} due to ${data.error}`
            throw new Error(message)
        }

        // Successfully set the pin code! Set the current wallet address.
        logIn(tronUserAddress!)
    }

    return {
        secretPhrase,
        setSecretPhrase,
        pinCode,
        setPincode,
        encryptionKeyHex,
        setEncryptionKeyHex,
        tronUserAddress,
        setTronUserAddress,
        onSetupCompleted
    }
}