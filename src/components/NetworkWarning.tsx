import React from 'react';
import { useNetwork } from '../hooks/useNetwork';

export const NetworkWarning: React.FC = () => {
  const { isWrongNetwork, switching, switchNetwork } = useNetwork();

  if (!isWrongNetwork) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-red-800 font-semibold">⚠️ Wrong Network</h3>
          <p className="text-red-700 text-sm">Please switch to Sepolia testnet to use this app.</p>
        </div>
        <button
          onClick={switchNetwork}
          disabled={switching}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          {switching ? 'Switching...' : 'Switch to Sepolia'}
        </button>
      </div>
    </div>
  );
};