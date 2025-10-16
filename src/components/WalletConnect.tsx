import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { formatAddress } from '../utils/validation';

export const WalletConnect: React.FC = () => {
  const { isConnected, address, isConnecting, error, connect, disconnect, clearError } = useWallet();
  const hasMetaMask = typeof window !== 'undefined' && window.ethereum;

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      {error && (
        <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
          {error}
          <button onClick={clearError} className="ml-2 text-red-800 hover:text-red-900">×</button>
        </div>
      )}
      
      {isConnected && address ? (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-mono hidden sm:inline">{formatAddress(address)}</span>
          <span className="text-xs font-mono sm:hidden">{address.slice(0, 8)}...</span>
          <button
            onClick={disconnect}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={connect}
            disabled={isConnecting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </button>
          {!hasMetaMask && (
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              Install MetaMask
            </a>
          )}
        </div>
      )}
    </div>
  );
};