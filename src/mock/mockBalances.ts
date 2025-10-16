import { Token } from '../types/token';

export const mockTokens: Token[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: '1,250.50',
    decimals: 6,
    logo: '💵',
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    balance: '850.75',
    decimals: 18,
    logo: '🟡',
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    balance: '2.45',
    decimals: 18,
    logo: '💎',
  },
];

export const mockWalletAddress = '0x1234567890123456789012345678901234567890';

export const simulateNetworkDelay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const simulateTransactionResult = (): {
  success: boolean;
  hash?: string;
  error?: string;
} => {
  const random = Math.random();
  if (random < 0.7) {
    return {
      success: true,
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    };
  } else {
    return {
      success: false,
      error: 'Transaction failed: Insufficient gas fee',
    };
  }
};