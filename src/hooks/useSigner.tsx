import { SignerStorageKey } from "@/constants";
import { createContext, useContext, useState } from "react";
import { TronWeb } from "tronweb";
import { ECKeySign } from "tronweb/utils";
import { bytesToHex, Hex, hexToBytes, keccak256 } from "viem";

interface SignerData {
    encryptedPhraseHex: Hex;
    ivHex: Hex;
}

export function saveSignerData(data: SignerData | undefined) {
    if (data === undefined) {
        window.localStorage.removeItem(SignerStorageKey)
    } else {
        window.localStorage.setItem(SignerStorageKey, JSON.stringify(data))
    }
}

function loadSignerData(): SignerData | undefined {
    const raw = localStorage.getItem(SignerStorageKey)
    if (!raw) return;

    const decoded: { encryptedPhraseHex: Hex; ivHex: Hex } = JSON.parse(raw)
    return {
        encryptedPhraseHex: decoded.encryptedPhraseHex,
        ivHex: decoded.ivHex
    }
}

export function getEncryptedPhrasehash(): Hex | undefined {
    const signerData = loadSignerData()
    if (!signerData) return;

    const hash = keccak256(signerData.encryptedPhraseHex)
    return hash
}

interface ISignerContext {
    decrypt: (encryptionKeyHex: Hex) => Promise<string>;
    logOut: () => void;
    signRawMessage: (message: Hex) => string;
}

const SignerContext = createContext<ISignerContext>(undefined as any)

export interface ISecretPhraseGenerated {
    encryptedPhraseHex: Hex;
    ivHex: Hex;
    encryptionKeyHex: Hex;
}

export async function generateSecretPhrase(): Promise<ISecretPhraseGenerated> {
    const secretPhrase = TronWeb.createRandom().mnemonic!.phrase
    const encodedPhrase = new TextEncoder().encode(secretPhrase)

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptionKey = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    )
    const encryptedPhrase = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        encryptionKey,
        encodedPhrase
    )
    const encryptedPhraseBytes = new Uint8Array(encryptedPhrase)

    const rawEncryptionKey = await window.crypto.subtle.exportKey("raw", encryptionKey)
    const encryptionKeyBytes = new Uint8Array(rawEncryptionKey)

    return {
        encryptedPhraseHex: bytesToHex(encryptedPhraseBytes),
        ivHex: bytesToHex(iv),
        encryptionKeyHex: bytesToHex(encryptionKeyBytes) 
    }
}

export function SignerProvider(props: { children: any }) {
    const [secretPhrase, setSecretPhrase] = useState<string>()

    // Signer data must be set in local storage for decrypting.
    const decrypt = async (encryptionKeyHex: Hex): Promise<string> => {
        const encryptionKey = await window.crypto.subtle.importKey(
            "raw",
            hexToBytes(encryptionKeyHex),
            "AES-GCM",
            false,
            ["encrypt", "decrypt"]
        )

        const storageData = loadSignerData()
        if (!storageData) throw new Error("No signer data was found in storage")

        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: hexToBytes(storageData.ivHex) },
            encryptionKey,
            hexToBytes(storageData.encryptedPhraseHex)
        )

        const decoded = new TextDecoder().decode(decrypted)
        setSecretPhrase(decoded)
        return decoded // return the secret phrase to show it in wallet creation flow
    }

    const logOut = () => {
        saveSignerData(undefined)
        setSecretPhrase(undefined)
    }

    const signRawMessage = (message: Hex): string => {
        if (!secretPhrase) throw new Error("No secret phrase is loaded")
        const { address, privateKey } = TronWeb.fromMnemonic(secretPhrase)
        console.log("TODO: REMOVE THIS LINE", { privateKey })
        console.log(`Signing raw message ${message} with address ${address}`)

        const signature = ECKeySign(hexToBytes(message), hexToBytes(privateKey as Hex))
        return signature
    }

    return (
        <SignerContext.Provider value={{
            decrypt,
            logOut,
            signRawMessage
        }}>
            {props.children}
        </SignerContext.Provider>
    );
}

export function useSigner() {
    return useContext(SignerContext)
}