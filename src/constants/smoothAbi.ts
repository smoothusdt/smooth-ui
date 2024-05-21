export const smoothAbi = [
  {
    outputs: [{ type: "uint256" }],
    inputs: [{ type: "address" }],
    name: "nonces",
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenAddress", type: "address" },
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "transferAmount", type: "uint256" },
      { name: "feeCollector", type: "address" },
      { name: "feeAmount", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    name: "transfer",
    stateMutability: "Nonpayable",
    type: "Function",
  },
];
