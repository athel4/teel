import React from 'react';
import { useFaucet } from '../hooks/useFaucet';
import { useWallet } from '../hooks/useWallet';
import toast from 'react-hot-toast';

interface AutoTopupProps {
  ethBalance: string;
  onBalanceUpdate: () => void;
}

export const AutoTopup: React.FC<AutoTopupProps> = ({ ethBalance, onBalanceUpdate }) => {
  const { address, provider } = useWallet();
  const { requestFromFaucet, requesting, canRequest, getTreasuryInfo } = useFaucet();
  const [treasuryInfo, setTreasuryInfo] = React.useState<any>(null);

  React.useEffect(() => {
    if (provider) {
      getTreasuryInfo(provider).then(setTreasuryInfo);
    }
  }, [getTreasuryInfo, provider]);

  const handleAutoTopup = async () => {
    if (!address) return;

    try {
      const result = await requestFromFaucet(address, provider);
      
      if (result?.success) {
        if (result.hash) {
          toast.success(`🏦 ${result.amount} sent from Treasury! Hash: ${result.hash.slice(0, 10)}...`);
          // Refresh immediately for treasury transfers
          setTimeout(onBalanceUpdate, 3000);
        } else {
          toast.success(`🎉 Free ETH requested from ${result.faucet}! Check balance in 1-2 minutes.`);
          setTimeout(onBalanceUpdate, 30000);
        }
      } else {
        toast.success('📱 Manual faucet opened in new tab');
      }
    } catch (error: any) {
      toast.error(`Faucet failed: ${error.message}`);
    }
  };

  const needsTopup = parseFloat(ethBalance) < 0.01;
  const isLowBalance = parseFloat(ethBalance) < 0.05;

  if (!needsTopup && !isLowBalance) return null;

  return (
    <div className={`rounded-lg p-4 mb-6 ${needsTopup ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-semibold ${needsTopup ? 'text-red-800' : 'text-yellow-800'}`}>
            {needsTopup ? '⚠️ Low ETH Balance' : '💡 Consider Topping Up'}
          </h3>
          <p className={`text-sm ${needsTopup ? 'text-red-700' : 'text-yellow-700'}`}>
            {needsTopup 
              ? 'You need ETH for gas fees to send transactions'
              : 'Your ETH balance is getting low'
            }
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleAutoTopup}
            disabled={requesting || !canRequest()}
            className={`px-4 py-2 text-white rounded hover:opacity-90 disabled:bg-gray-400 ${
              needsTopup ? 'bg-red-600' : 'bg-yellow-600'
            }`}
          >
            {requesting ? '🔄 Requesting...' : '💰 Get Free ETH'}
          </button>
          
          <a
            href={`https://sepoliafaucet.com/?address=${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Manual Faucet
          </a>
        </div>
      </div>
      
      {!canRequest() && (
        <p className="text-xs text-gray-600 mt-2">
          ⏰ Faucet cooldown active. Try again in 24 hours or use manual faucet.
        </p>
      )}
      
      {treasuryInfo && (
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
          <p className="text-gray-700">
            🏦 Treasury Balance: {treasuryInfo.balance} ETH 
            {treasuryInfo.available ? 
              <span className="text-green-600">(✓ Available for auto-topup)</span> : 
              <span className="text-red-600">(❌ Insufficient funds)</span>
            }
          </p>
        </div>
      )}
    </div>
  );
};