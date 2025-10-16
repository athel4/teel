import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { Token } from '../types/token';
import { getReliableProvider } from '../utils/rpc';
import { withErrorHandling } from '../utils/errorHandler';

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)'
];

// Real Sepolia testnet token addresses
const SEPOLIA_TOKENS = [
  {
    symbol: 'USDC',
    name: 'USD Coin (Test)',
    address: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8', // Real Sepolia USDC
    decimals: 6,
    logo: '💵'
  },
  {
    symbol: 'LINK',
    name: 'Chainlink Token',
    address: '0x779877A7B0D9E8603169DdbD7836e478b4624789', // Real Sepolia LINK
    decimals: 18,
    logo: '🔗'
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9', // Real Sepolia WETH
    decimals: 18,
    logo: '💎'
  }
];

export function useBalances(provider: ethers.BrowserProvider | null, address: string | null) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshBalances = useCallback(async () => {
    if (!address) return;
    
    setLoading(true);
    
    await withErrorHandling(async () => {
      const reliableProvider = getReliableProvider(provider || undefined);
      
      const results = await Promise.all(
        SEPOLIA_TOKENS.map(async (tokenInfo) => {
          return withErrorHandling(async () => {
            const contract = new ethers.Contract(tokenInfo.address, ERC20_ABI, reliableProvider);
            const balance = await contract.balanceOf(address);
            const formattedBalance = ethers.formatUnits(balance, tokenInfo.decimals);
            
            return {
              symbol: tokenInfo.symbol,
              name: tokenInfo.name,
              balance: parseFloat(formattedBalance).toFixed(4),
              decimals: tokenInfo.decimals,
              logo: tokenInfo.logo,
              address: tokenInfo.address
            };
          }, {
            symbol: tokenInfo.symbol,
            name: tokenInfo.name + ' (Unavailable)',
            balance: '0.0000',
            decimals: tokenInfo.decimals,
            logo: '❌',
            address: tokenInfo.address
          });
        })
      );
      
      setTokens(results);
      setLastUpdated(new Date());
    }, undefined).finally(() => {
      setLoading(false);
    });
  }, [provider, address]);

  useEffect(() => {
    refreshBalances();
  }, [refreshBalances]);

  return { tokens, loading, refreshBalances, lastUpdated };
}