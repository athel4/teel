import { useState } from 'react';
import { withErrorHandling } from '../utils/errorHandler';
import { sendEthFromTreasury, getTreasuryBalance } from '../utils/treasury';

export const useFaucet = () => {
  const [requesting, setRequesting] = useState(false);
  const [lastRequest, setLastRequest] = useState<Date | null>(null);

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

  return { requestFromFaucet, requesting, lastRequest, canRequest, getTreasuryInfo };
};