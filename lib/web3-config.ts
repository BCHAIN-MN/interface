export const CONTRACT_ADDRESSES = {
  // Replace these with your actual deployed addresses from Truffle migrations
  // After running 'truffle migrate', copy the addresses from the migration output
  MODULE_REVIEWS: process.env.NEXT_PUBLIC_MODULE_REVIEWS_ADDRESS || "",
  STUDENT_IDENTITY: process.env.NEXT_PUBLIC_STUDENT_IDENTITY_ADDRESS || "",
}

// Ganache Local Network Configuration
export const GANACHE_CHAIN_ID = 1337 // Default Ganache chain ID

export const NETWORK_CONFIG = {
  chainId: "0x539", // 1337 in hex
  chainName: "Ganache Local Network",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["http://127.0.0.1:8545"],
  blockExplorerUrls: [""],
}
