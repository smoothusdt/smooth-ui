import { Hex } from "viem"

export const SmoothProxyBytecode: Hex = "0x60a060405234801561000f575f80fd5b50d3801561001b575f80fd5b50d28015610027575f80fd5b503360805260805161020d6100495f395f81816055015260b3015261020d5ff3fe608060405234801561000f575f80fd5b50d3801561001b575f80fd5b50d28015610027575f80fd5b506004361061004c575f3560e01c806301bc45c914610050578063beabacc814610093575b5f80fd5b6100777f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200160405180910390f35b6100a66100a1366004610178565b6100a8565b005b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146100dc575f80fd5b60405163a9059cbb60e01b81526001600160a01b0383811660048301526024820183905284169063a9059cbb906044016020604051808303815f875af1158015610128573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061014c91906101b1565b50505050565b5f81356001600160a81b0381168114610169575f80fd5b6001600160a01b031692915050565b5f805f6060848603121561018a575f80fd5b61019384610152565b92506101a160208501610152565b9150604084013590509250925092565b5f602082840312156101c1575f80fd5b815180151581146101d0575f80fd5b939250505056fea26474726f6e58221220c8f8ee15e44f7a989ee0872f1a955e4703176be7f9008a3f7294cea2be7e073864736f6c63430008150033"
export const SmoothAdminAbi = [
    {
        "inputs": [],
        "name": "Create2EmptyBytecode",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FailedDeployment",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "signer",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "code",
                "type": "bytes"
            },
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "transferAmount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "feeCollector",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "feeAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "nonce",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "v",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "r",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "createAndTransfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "signer",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "code",
                "type": "bytes"
            }
        ],
        "name": "createWallet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "transferAmount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "feeCollector",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "feeAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "nonce",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "v",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "r",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "wallets",
        "outputs": [
            {
                "internalType": "address",
                "name": "signer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "nonce",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
