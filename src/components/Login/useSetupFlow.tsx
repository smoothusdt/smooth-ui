import { SmoothApiURL } from "@/constants"
import { encryptSecretPhrase, getEncryptedPhrasehash, saveSignerData, useSigner } from "@/hooks/useSigner"
import { WalletContext } from "@/hooks/useWallet"
import { useContext, useState } from "react"
import { TronWeb } from "tronweb"

export function useSetupFlow() {
    const { decrypt } = useSigner()
    const { logIn } = useContext(WalletContext)
    const [secretPhrase, setSecretPhrase] = useState<string>()
    const [pinCode, setPincode] = useState<string>()
    const [tronUserAddress, setTronUserAddress] = useState<string>()

    // 1. Upload pin to the server.
    // 2. Initialize useWallet.
    const onSetupCompleted = async () => {
        const generationData = await encryptSecretPhrase(secretPhrase!)
        saveSignerData({
            encryptedPhraseHex: generationData.encryptedPhraseHex,
            ivHex: generationData.ivHex
        })
        await decrypt(generationData.encryptionKeyHex)
        const phraseHash = getEncryptedPhrasehash()!
        const tronUserAddress = TronWeb.fromMnemonic(secretPhrase!).address

        const response = await fetch(`${SmoothApiURL}/setEncryptionKey`, {
            method: "POST",
            body: JSON.stringify({
                phraseHash,
                pinCode,
                encryptionKeyHex: generationData.encryptionKeyHex,
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
        tronUserAddress,
        setTronUserAddress,
        onSetupCompleted
    }
}