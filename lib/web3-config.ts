export const CONTRACT_ADDRESSES = {
    MODULE_REVIEWS: process.env.NEXT_PUBLIC_MODULE_REVIEWS_ADDRESS || "0x19224E4a264C2c248f3fd50430d2470F471623e9",
    STUDENT_IDENTITY: process.env.NEXT_PUBLIC_STUDENT_IDENTITY_ADDRESS || "0xF93adc88d05D519fFeFf476483C31858F13C54Ec",
}

// Ganache Local Network Configuration
export const GANACHE_CHAIN_ID = 1337

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
