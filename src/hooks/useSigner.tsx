import { SignerStorageKey, tronweb } from "@/constants";
import { SignedTransaction, Transaction, TriggerSmartContract } from "node_modules/tronweb/lib/esm/types";
import { createContext, useContext, useState } from "react";
import { TronWeb } from "tronweb";
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

export function isEncryptedPhraseSet() {
    return loadSignerData() !== undefined
}

export function getEncryptedPhrasehash(): Hex | undefined {
    const signerData = loadSignerData()
    if (!signerData) return;

    const hash = keccak256(signerData.encryptedPhraseHex)
    return hash
}

interface ISignerContext {
    signerReady: boolean
    decrypt: (encryptionKeyHex: Hex) => Promise<string>;
    signTransaction: (transaction: Transaction<TriggerSmartContract>) => Promise<SignedTransaction<TriggerSmartContract>>;
    eraseSigner: () => void;
}

const SignerContext = createContext<ISignerContext>(undefined as any)

export interface ISecretPhraseGenerated {
    encryptedPhraseHex: Hex;
    ivHex: Hex;
    encryptionKeyHex: Hex;
}

// Generates encryption key and a counter for the seceret phrase.
// If no secret phrase is passed - generates the phrase too.
// Doesn't save anything neither to state nor to storage.
export async function encryptSecretPhrase(secretPhrase: string): Promise<ISecretPhraseGenerated> {
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
        console.log("Decrypted secret phrase")
        return decoded // return the secret phrase to show it in wallet creation flow
    }

    const signTransaction = async (transaction: Transaction<TriggerSmartContract>): Promise<SignedTransaction<TriggerSmartContract>> => {
        if (!secretPhrase) throw new Error("No secret phrase is loaded in signTransaction")
        const { address, privateKey } = TronWeb.fromMnemonic(secretPhrase)
        const signedTx = await tronweb.trx.sign(transaction, privateKey.slice(2));
        console.log(`Signed transaction ${transaction.txID} with wallet ${address}. Signature: ${signedTx.signature}`);
        return signedTx
    }

    const eraseSigner = () => {
        saveSignerData(undefined)
        setSecretPhrase(undefined)
    }

    return (
        <SignerContext.Provider value={{
            signerReady: secretPhrase !== undefined,
            decrypt,
            signTransaction,
            eraseSigner
        }}>
            {props.children}
        </SignerContext.Provider>
    );
}

export function useSigner() {
    return useContext(SignerContext)
}