import { encodePacked, Hex, hexToNumber, keccak256, sliceHex, zeroAddress } from "viem";
import { ChainID, SmoothAdminBase58, SmoothApiURL, SmoothFee, SmoothFeeCollector, tronweb, USDTAddressBase58, USDTDecimals } from "./constants";
import { SmoothAdminAbi, SmoothProxyBytecode } from "./constants/smooth";
import { BigNumber } from "tronweb";
import { humanToUint } from "./util";

function computeMessageDigest(
    fromBase58: string,
    toBase58: string,
    transferAmount: BigNumber, // in human format
    nonce: number,
): Hex {
    const adminHex = ("0x" +
        tronweb.utils.address.toHex(SmoothAdminBase58).slice(2)) as Hex;
    const usdtHex = ("0x" +
        tronweb.utils.address.toHex(USDTAddressBase58).slice(2)) as Hex;
    const fromHex = ("0x" +
        tronweb.utils.address.toHex(fromBase58).slice(2)) as Hex;
    const toHex = ("0x" + tronweb.utils.address.toHex(toBase58).slice(2)) as Hex;
    const feeCollectorHex = ("0x" +
        tronweb.utils.address.toHex(SmoothFeeCollector).slice(2)) as Hex;
    const transferAmountUint = BigInt(humanToUint(transferAmount, USDTDecimals));
    const feeAmountUint = BigInt(humanToUint(SmoothFee, USDTDecimals));

    const encodePackedValues = encodePacked(
        [
            "string",
            "uint256",
            "address",
            "address",
            "address",
            "address",
            "uint256",
            "address",
            "uint256",
            "uint256",
        ],
        [
            "Smooth",
            BigInt(ChainID),
            adminHex,
            usdtHex,
            fromHex,
            toHex,
            transferAmountUint,
            feeCollectorHex,
            feeAmountUint,
            BigInt(nonce),
        ],
    );

    const digestHex = keccak256(encodePackedValues);
    return digestHex;
}


async function getWalletData(tronUserAddress: string): Promise<{ signerHex: Hex; nonce: number }> {
    const smoothAdminContract = tronweb.contract(SmoothAdminAbi, SmoothAdminBase58);
    const [rawSigner, rawNonce] = await smoothAdminContract.methods.wallets(tronUserAddress).call();
    const signerHex = `0x${rawSigner.slice(2)}` as Hex // remove "41" prefix;
    const nonce = Number(rawNonce)
    return { signerHex, nonce }
}


// Signs a message and makes a gasless transfer through the api
export async function transferViaApi(
    {
        tronUserAddress,
        toBase58,
        transferAmount,
        signerAddress,
        signMessage
    }: {
        tronUserAddress: string,
        toBase58: string,
        transferAmount: BigNumber, // in human format
        signerAddress: Hex,
        signMessage: (message: string) => Promise<string>
    }
): Promise<string> {
    const { signerHex, nonce } = await getWalletData(tronUserAddress)

    const messageDigest = computeMessageDigest(
        tronUserAddress,
        toBase58,
        transferAmount,
        nonce
    )
    const signature = await signMessage(messageDigest) as Hex
    const r = sliceHex(signature, 0, 32);
    const s = sliceHex(signature, 32, 64);
    const v = hexToNumber(sliceHex(signature, 64));

    let callArguments: any[] = [
        USDTAddressBase58,
        tronUserAddress,
        toBase58,
        humanToUint(transferAmount, USDTDecimals).toString(),
        SmoothFeeCollector,
        humanToUint(SmoothFee, USDTDecimals).toString(),
        nonce,
        v,
        r,
        s
    ]

    const isNewWallet = signerHex === zeroAddress;
    if (isNewWallet) {
        const newWalletArguments = [tronweb.address.fromHex(signerAddress), SmoothProxyBytecode]
        callArguments = newWalletArguments.concat(callArguments)
    }

    console.log("Executing a transfer via api with data", { callArguments, isNewWallet })
    const response = await fetch(`${SmoothApiURL}/transfer`, {
        method: "POST",
        body: JSON.stringify({
            isNewWallet,
            callArguments
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })

    const data = await response.json()

    const txID = data.txID;
    if (!txID) {
        let errorText = "Couldnt execute a transfer via api"
        if (data.error) errorText = `Couldnt execute a transfer via api due to ${data.error}`
        throw new Error(errorText)
    }

    console.log("Executed a transfer via api. Transaction id:", txID)
    return txID
}

export async function getFreeUsdt(recipient: string): Promise<string> {
    const response = await fetch(`${SmoothApiURL}/getFreeUsdt`, {
        method: "POST",
        body: JSON.stringify({
            recipient
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    const data = await response.json()
    const txID = data.txID;
    if (!txID) {
        let errorText = "Couldnt get free usdt via api"
        if (data.error) errorText = `Couldnt get free usdt via api due to ${data.error}`
        throw new Error(errorText)
    }
    
    console.log("Got free usdt via appi. Transaction id:", txID)
    return txID
}