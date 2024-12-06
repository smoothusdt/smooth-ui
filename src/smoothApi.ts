import { PolarBearBase58, SmoothApiURL, SmoothFeeCollector, tronweb, USDTAddressBase58 } from "./constants";
import { BigNumber } from "tronweb";
import { humanToUint } from "./util";
import { SignedTransaction, Transaction } from "node_modules/tronweb/lib/esm/types";

async function fetchTrxFees(recipient: string) {
    const respone = await fetch(`${SmoothApiURL}/getFeeQuote?recipient=${recipient}`)
    const data = await respone.json()
    if (!data.success) throw new Error(`Couldnt fetch fee quote due to ${data.error}`)

    return {
        mainTrxAmount: new BigNumber(data.trxForMainTransfer),
        feeTrxAmount: new BigNumber(data.trxForFeeTransfer)
    }
}

// Signs a message and makes a gasless transfer through the api
export async function transferViaApi(
    {
        toBase58,
        transferAmount,
        feeAmount,
        userAddress,
        signTransaction,
    }: {
        toBase58: string,
        transferAmount: BigNumber, // in human format
        feeAmount: BigNumber, // in fee format
        userAddress: string,
        signTransaction: (transaction: Transaction) => Promise<SignedTransaction>
    }
): Promise<string> {
    const {
        mainTrxAmount,
        feeTrxAmount
    } = await fetchTrxFees(toBase58)

    const mainUsdtAmountUint = humanToUint(transferAmount)
    const functionSelector = 'transfer(address,uint256)';
    const { transaction: mainUsdtTransfer } = await tronweb.transactionBuilder.triggerSmartContract(
        USDTAddressBase58,
        functionSelector,
        {},
        [{ type: 'address', value: toBase58 }, { type: 'uint256', value: mainUsdtAmountUint }],
        userAddress
    );
    const baseBlockHeader = {
        ref_block_bytes: mainUsdtTransfer.raw_data.ref_block_bytes,
        ref_block_hash: mainUsdtTransfer.raw_data.ref_block_hash,
        expiration: mainUsdtTransfer.raw_data.expiration,
        timestamp: mainUsdtTransfer.raw_data.timestamp
    }
    console.log("Main transfer txID:", mainUsdtTransfer.txID)
    console.log("Main transfer transaction:", mainUsdtTransfer)
    const { signature: mainUsdtTransferSignature } = await signTransaction(mainUsdtTransfer)
    console.log("Main transfer signature:", mainUsdtTransferSignature)

    const mainTrxAmountUint = humanToUint(mainTrxAmount)
    const mainTrxTransfer = await tronweb.transactionBuilder.sendTrx(
        PolarBearBase58,
        mainTrxAmountUint,
        userAddress,
        {
            blockHeader: { ...baseBlockHeader, expiration: baseBlockHeader.expiration + 1 * 1000 },
        }
    )
    const { signature: mainTrxTransferSignature } = await signTransaction(mainTrxTransfer)

    const feeUsdtAmountUint = humanToUint(feeAmount)
    const { transaction: feeUsdtTransfer } = await tronweb.transactionBuilder.triggerSmartContract(
        USDTAddressBase58,
        functionSelector,
        {
            txLocal: true,
            blockHeader: { ...baseBlockHeader, expiration: baseBlockHeader.expiration + 2 * 1000 },
        },
        [{ type: 'address', value: SmoothFeeCollector }, { type: 'uint256', value: feeUsdtAmountUint }],
        userAddress
    );
    console.log("Fee transfer txID:", feeUsdtTransfer.txID)
    console.log("Fee transfer transaction:", feeUsdtTransfer)
    const { signature: feeUsdtTransferSignature } = await signTransaction(feeUsdtTransfer)
    console.log("Fee transfer signature:", feeUsdtTransferSignature)

    const feeTrxAmountUint = humanToUint(feeTrxAmount)
    const feeTrxTransfer = await tronweb.transactionBuilder.sendTrx(
        PolarBearBase58,
        feeTrxAmountUint,
        userAddress,
        {
            blockHeader: {...baseBlockHeader, expiration: baseBlockHeader.expiration + 3 * 1000}
        }
    )
    const { signature: feeTrxTransferSignature } = await signTransaction(feeTrxTransfer)

    const response = await fetch(`${SmoothApiURL}/transfer`, {
        method: "POST",
        body: JSON.stringify({
            from: userAddress,
            mainTrxTransfer: {
                to: PolarBearBase58,
                amount: mainTrxAmount.toString(),
                signature: mainTrxTransferSignature[0],
            },
            mainUsdtTransfer: {
                to: toBase58,
                amount: transferAmount.toString(),
                signature: mainUsdtTransferSignature[0]
            },
            feeTrxTransfer: {
                to: PolarBearBase58,
                amount: feeTrxAmount.toString(),
                signature: feeTrxTransferSignature[0]
            },
            feeUsdtTransfer: {
                to: SmoothFeeCollector,
                amount: feeAmount.toString(),
                signature: feeUsdtTransferSignature[0]
            },
            blockHeader: baseBlockHeader
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })

    console.log("API Transfer status code:", response.status)
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