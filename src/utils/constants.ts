export const APP_CONFIG = {
  NETWORK: {
    CHAIN_ID: 11155111,
    NAME: 'Sepolia',
    CURRENCY: 'ETH',
    EXPLORER: 'https://sepolia.etherscan.io'
  },
  CACHE: {
    BALANCE_TTL: 30000, // 30 seconds
    TRANSACTION_TTL: 300000 // 5 minutes
  },
  UI: {
    TOAST_DURATION: 5000,
    DEBOUNCE_DELAY: 500
  }
};

export const SUPPORTED_WALLETS = {
  METAMASK: {
    name: 'MetaMask',
    icon: '🦊',
    downloadUrl: 'https://metamask.io/download/'
  }
};