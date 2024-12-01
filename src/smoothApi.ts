import { encodePacked, Hex, hexToNumber, keccak256, sliceHex, zeroAddress } from "viem";
import { ChainID, SmoothAdminBase58, SmoothApiURL, SmoothFee, SmoothFeeCollector, tronweb, USDTAddressBase58, USDTDecimals } from "./constants";
import { SmoothAdminAbi, SmoothProxyBytecode } from "./constants/smooth";
import { BigNumber } from "tronweb";
import { humanToUint } from "./util";
import { USDTAbi } from "./constants/usdtAbi";
import { SignedTransaction, Transaction, TriggerSmartContract } from "node_modules/tronweb/lib/esm/types";

// Signs a message and makes a gasless transfer through the api
export async function transferViaApi(
    {
        toBase58,
        transferAmount,
        signTransaction
    }: {
        toBase58: string,
        transferAmount: BigNumber, // in human format
        signTransaction: (transaction: Transaction<TriggerSmartContract>) => Promise<SignedTransaction<TriggerSmartContract>>
    }
): Promise<string> {
    const amountUint = humanToUint(transferAmount, USDTDecimals)
    const functionSelector = 'transfer(address,uint256)';
    const parameter = [{ type: 'address', value: toBase58 }, { type: 'uint256', value: amountUint }]
    const tx = await tronweb.transactionBuilder.triggerSmartContract(USDTAddressBase58, functionSelector, {}, parameter);
    const signedTx = await signTransaction(tx.transaction);

    const signedTxStringified = JSON.stringify(signedTx)

    console.log("Executing a transfer via api with data", { signedTxStringified })
    const response = await fetch(`${SmoothApiURL}/transfer`, {
        method: "POST",
        body: JSON.stringify({
            signedTxStringified
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