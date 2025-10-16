import React from 'react';
import { SendTokenForm } from '../components/SendTokenForm';
import { useWallet } from '../hooks/useWallet';

export const Send: React.FC = () => {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your MetaMask wallet to send tokens on Sepolia testnet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Send Tokens</h1>
      <p className="text-gray-600 mb-6">Send ERC-20 tokens on Sepolia testnet</p>
      <SendTokenForm />
    </div>
  );
};