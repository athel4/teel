import { useState } from 'react';
import { ethers } from 'ethers';
import { withErrorHandling } from '../utils/errorHandler';
import { sendEthFromTreasury, getTreasuryBalance } from '../utils/treasury';

const WETH_ADDRESS = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9';
const WETH_ABI = [
  'function deposit() payable',
  'function balanceOf(address) view returns (uint256)'
];

export const useFaucet = () => {
  const [requesting, setRequesting] = useState(false);
  const [lastRequest, setLastRequest] = useState<Date | null>(null);
  const [requestingTokens, setRequestingTokens] = useState(false);

  const requestFromFaucet = async (address: string, userProvider?: any) => {
    setRequesting(true);
    
    return withErrorHandling(async () => {
      console.log('🏦 Attempting direct treasury transfer...');
      
      try {
        // Try direct treasury transfer first (0.1 ETH)
        const result = await sendEthFromTreasury(address, '0.1', userProvider);
        
        if (result.success) {
          setLastRequest(new Date());
          return { 
            success: true, 
            faucet: 'Treasury Wallet', 
            hash: result.hash,
            amount: '0.1 ETH',
            treasuryAddress: result.treasuryAddress
          };
        }
      } catch (treasuryError) {
        console.log('💰 Treasury transfer failed:', treasuryError);
        
        // Fallback to external faucets
        const faucets = [
          {
            name: 'Sepolia Faucet',
            url: 'https://sepoliafaucet.com/api/faucet',
            method: 'POST',
            body: { address }
          }
        ];

        for (const faucet of faucets) {
          try {
            const response = await fetch(faucet.url, {
              method: faucet.method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(faucet.body)
            });

            if (response.ok) {
              const data = await response.json();
              setLastRequest(new Date());
              return { success: true, faucet: faucet.name, data };
            }
          } catch (error) {
            console.log(`${faucet.name} failed:`, error);
            continue;
          }
        }
      }

      // If all methods fail, open manual faucet
      window.open(`https://sepoliafaucet.com/?address=${address}`, '_blank');
      return { success: false, message: 'Opened manual faucet' };
      
    }).finally(() => {
      setRequesting(false);
    });
  };

  const getTreasuryInfo = async (userProvider?: any) => {
    try {
      const balance = await getTreasuryBalance(userProvider);
      return { balance, available: parseFloat(balance) > 0.1 };
    } catch (error) {
      return { balance: '0', available: false };
    }
  };

  const canRequest = () => {
    if (!lastRequest) return true;
    const hoursSinceLastRequest = (Date.now() - lastRequest.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastRequest >= 24;
  };

  const requestERC20Tokens = async (address: string, provider?: any) => {
    setRequestingTokens(true);
    const results: any[] = [];
    
    return withErrorHandling(async () => {
      if (!provider) throw new Error('Provider required');
      
      const signer = await provider.getSigner();
      
      // 1. Try WETH faucet (free tokens)
      try {
        console.log('🔄 Requesting free WETH from faucet...');
        const response = await fetch('https://faucet.paradigm.xyz/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, token: 'WETH', network: 'sepolia' })
        });
        
        if (response.ok) {
          results.push({ token: 'WETH', success: true, faucet: 'Paradigm' });
        } else {
          throw new Error('WETH faucet failed');
        }
      } catch (error) {
        results.push({ token: 'WETH', success: false, error: (error as Error).message });
      }
      
      // 2. Open Chainlink faucet for LINK only (no mainnet LINK required for testnet LINK)
      try {
        console.log('🔄 Opening Chainlink faucet for LINK tokens...');
        window.open(`https://faucets.chain.link/sepolia?address=${address}&token=link`, '_blank');
        results.push({ token: 'LINK', success: true, faucet: 'Chainlink (LINK only)' });
      } catch (error) {
        results.push({ token: 'LINK', success: false, error: (error as Error).message });
      }
      
      // 3. Try alternative faucets for USDC (free tokens)
      try {
        console.log('🔄 Requesting free USDC from faucet...');
        const faucets = [
          { url: 'https://faucet.circle.com/api/faucet', name: 'Circle' },
          { url: 'https://sepoliafaucet.com/api/faucet', name: 'Sepolia' },
          { url: 'https://faucet.quicknode.com/sepolia', name: 'QuickNode' }
        ];
        
        let usdcSuccess = false;
        let successFaucet = '';
        
        for (const faucet of faucets) {
          try {
            const response = await fetch(faucet.url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address, token: 'USDC', network: 'sepolia' })
            });
            
            if (response.ok) {
              usdcSuccess = true;
              successFaucet = faucet.name;
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        results.push({ 
          token: 'USDC', 
          success: usdcSuccess, 
          faucet: successFaucet,
          error: usdcSuccess ? null : 'All faucets failed' 
        });
      } catch (error) {
        results.push({ token: 'USDC', success: false, error: (error as Error).message });
      }
      
      setLastRequest(new Date());
      return { success: true, results };
      
    }).finally(() => {
      setRequestingTokens(false);
    });
  };

  return { 
    requestFromFaucet, 
    requesting, 
    lastRequest, 
    canRequest, 
    getTreasuryInfo,
    requestERC20Tokens,
    requestingTokens
  };
};