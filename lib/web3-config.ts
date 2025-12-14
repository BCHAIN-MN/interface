export const CONTRACT_ADDRESSES = {
  // Replace these with your actual deployed addresses from Truffle migrations
  // After running 'truffle migrate', copy the addresses from the migration output
  MODULE_REVIEWS: process.env.NEXT_PUBLIC_MODULE_REVIEWS_ADDRESS || "0x1ba60a98E0aE46CD47dc85C440057f6ef9f5E2E1",
  STUDENT_IDENTITY: process.env.NEXT_PUBLIC_STUDENT_IDENTITY_ADDRESS || "0x12988870ec1aDb756E57970279ac3475715368Df",
}

// Ganache Local Network Configuration
export const GANACHE_CHAIN_ID = 1337 // Default Ganache chain ID

export const NETWORK_CONFIG = {
  chainId: "0x13882",
  chainName: "amoy",
  nativeCurrency: {
    name: "POL",
    symbol: "POL",
    decimals: 18,
  },
  rpcUrls: ["https://polygon-amoy.drpc.org"],
  blockExplorerUrls: [""],
}
