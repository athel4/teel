import React from 'react';
import { ethers } from 'ethers';
import { TokenBalanceCard } from '../components/TokenBalanceCard';
import { NetworkWarning } from '../components/NetworkWarning';
import { AutoTopup } from '../components/AutoTopup';
import { TransactionHistory } from '../components/TransactionHistory';
import { useBalances } from '../hooks/useBalances';
import { useWallet } from '../hooks/useWallet';
import { useNetwork } from '../hooks/useNetwork';

export const Dashboard: React.FC = () => {
  const { isConnected, address, provider, isConnecting, error } = useWallet();
  const { tokens, loading, refreshBalances, lastUpdated } = useBalances(provider, address);
  const { isWrongNetwork } = useNetwork();
  const [ethBalance, setEthBalance] = React.useState<string>('...');

  const [ethLastUpdated, setEthLastUpdated] = React.useState<Date | null>(null);

  const refreshEthBalance = React.useCallback(async () => {
    if (provider && address) {
      setEthBalance('Loading...');
      try {
        console.log('🔄 Fetching ETH balance from blockchain...');
        
        // Get balance via MetaMask (which uses real RPC)
        const balance = await provider.getBalance(address, 'latest');
        const formattedBalance = ethers.formatEther(balance);
        
        console.log('✅ ETH Balance fetched:', formattedBalance);
        
        setEthBalance(formattedBalance);
        setEthLastUpdated(new Date());
      } catch (error) {
        console.error('❌ Balance fetch failed:', error);
        setEthBalance('Error');
      }
    } else {
      setEthBalance('...');
      setEthLastUpdated(null);
    }
  }, [provider, address]);

  React.useEffect(() => {
    refreshEthBalance();
  }, [refreshEthBalance]);

  if (isConnecting) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-4">Connecting to MetaMask...</h2>
        <p className="text-gray-600">Please check MetaMask and approve the connection.</p>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your MetaMask wallet to view your token balances on Sepolia testnet.</p>
        <p className="text-sm text-gray-500 mt-2">Make sure you're connected to Sepolia testnet in MetaMask.</p>
      </div>
    );
  }

  return (
    <div>
      <NetworkWarning />
      
      <AutoTopup 
        ethBalance={ethBalance} 
        onBalanceUpdate={() => { refreshEthBalance(); refreshBalances(); }}
      />
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
          <p className="text-red-800">❌ {error}</p>
        </div>
      )}
      
      {!isWrongNetwork && (
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
          <h3 className="font-bold text-green-800 mb-2">✅ Connected to Sepolia Testnet</h3>
          <p className="text-sm text-green-700">Address: <span className="font-mono bg-green-100 px-1 rounded">{address}</span></p>
          <p className="text-sm text-green-700">ETH Balance: <span className="font-mono bg-green-100 px-1 rounded">{ethBalance} ETH</span></p>
          <div className="text-xs text-green-600 mt-1 space-y-1">
            <p>🔴 LIVE DATA from Sepolia blockchain</p>
            {ethLastUpdated && <p>ETH updated: {ethLastUpdated.toLocaleTimeString()}</p>}
            {lastUpdated && <p>Tokens updated: {lastUpdated.toLocaleTimeString()}</p>}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Token Balances</h1>
          <p className="text-sm text-gray-600">Sepolia Testnet</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => { refreshBalances(); refreshEthBalance(); }}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Refreshing...' : '🔄 Refresh All'}
          </button>
          <button
            onClick={refreshEthBalance}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            ETH
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {tokens.length === 0 && !loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No token balances found or unable to fetch balances.</p>
              <p className="text-sm text-gray-500 mt-2">Make sure you're connected to Sepolia testnet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tokens.map((token) => (
                <TokenBalanceCard key={token.symbol} token={token} />
              ))}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};