import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useTransaction } from '../hooks/useTransaction';
import { useWallet } from '../hooks/useWallet';
import { useNetwork } from '../hooks/useNetwork';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { sendTokenSchema } from '../utils/validation';
import toast from 'react-hot-toast';

const AVAILABLE_TOKENS = [
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'LINK', name: 'Chainlink Token' },
  { symbol: 'WETH', name: 'Wrapped Ethereum' }
];

export const SendTokenForm: React.FC = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    token: 'USDC',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gasEstimate, setGasEstimate] = useState<any>(null);
  const [estimating, setEstimating] = useState(false);
  const { transaction, sendToken, resetTransaction, estimateGas } = useTransaction();
  const { provider } = useWallet();
  const { isWrongNetwork } = useNetwork();
  const [transactions, setTransactions] = useLocalStorage<any[]>('transaction_history', []);

  // Auto-estimate gas when form is valid
  useEffect(() => {
    const estimateGasForTransaction = async () => {
      if (!provider || !formData.recipient || !formData.amount || isWrongNetwork) {
        setGasEstimate(null);
        return;
      }

      const validation = sendTokenSchema.safeParse(formData);
      if (!validation.success) {
        setGasEstimate(null);
        return;
      }

      setEstimating(true);
      try {
        const estimate = await estimateGas(formData, provider);
        setGasEstimate(estimate);
      } catch (error) {
        setGasEstimate(null);
      } finally {
        setEstimating(false);
      }
    };

    const debounce = setTimeout(estimateGasForTransaction, 500);
    return () => clearTimeout(debounce);
  }, [formData, provider, estimateGas, isWrongNetwork]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!provider) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    const validation = sendTokenSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await sendToken(formData, provider);
  };

  React.useEffect(() => {
    if (transaction.status === 'success') {
      toast.success(`Transaction successful! Hash: ${transaction.hash?.slice(0, 10)}...`);
      
      // Log transaction to history
      const newTx = {
        hash: transaction.hash!,
        to: formData.recipient,
        amount: formData.amount,
        token: formData.token,
        timestamp: Date.now(),
        status: 'success' as const
      };
      setTransactions(prev => [newTx, ...prev]);
      
      setFormData({ recipient: '', amount: '', token: 'USDC' });
      setTimeout(resetTransaction, 5000);
    } else if (transaction.status === 'error') {
      toast.error(transaction.error || 'Transaction failed');
      setTimeout(resetTransaction, 5000);
    }
  }, [transaction.status, transaction.hash, transaction.error, resetTransaction, formData, setTransactions]);

  return (
    <div className="space-y-4 max-w-md">
      {isWrongNetwork ? (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <p className="text-sm text-red-800">
            <strong>Wrong Network:</strong> Please switch to Sepolia testnet to send tokens.
          </p>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Sepolia Testnet:</strong> This will send real test tokens. Make sure you have sufficient balance and ETH for gas.
          </p>
        </div>
      )}

      {gasEstimate && (
        <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Gas Estimate</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Gas Limit: {gasEstimate.gasLimit?.toString()}</p>
            <p>Gas Price: {ethers.formatUnits(gasEstimate.gasPrice || 0, 'gwei')} gwei</p>
            <p>Total Cost: ~{ethers.formatEther(gasEstimate.totalCost || 0)} ETH</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Token</label>
          <select
            value={formData.token}
            onChange={(e) => setFormData({ ...formData, token: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            {AVAILABLE_TOKENS.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol} - {token.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Recipient Address</label>
          <input
            type="text"
            value={formData.recipient}
            onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
            placeholder="0x..."
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.recipient && <p className="text-red-500 text-sm mt-1">{errors.recipient}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="text"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <button
          type="submit"
          disabled={transaction.status === 'pending' || !provider || isWrongNetwork || estimating}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {transaction.status === 'pending' ? 'Sending Transaction...' : 
           estimating ? 'Estimating Gas...' :
           isWrongNetwork ? 'Wrong Network' :
           'Send Token'}
        </button>

        {transaction.status === 'success' && (
          <div className="p-3 bg-green-100 border border-green-400 rounded">
            <p className="text-green-700">Transaction successful!</p>
            <p className="text-sm text-green-600 font-mono break-all">{transaction.hash}</p>
            <a 
              href={`https://sepolia.etherscan.io/tx/${transaction.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              View on Etherscan
            </a>
          </div>
        )}

        {transaction.status === 'error' && (
          <div className="p-3 bg-red-100 border border-red-400 rounded">
            <p className="text-red-700">{transaction.error}</p>
          </div>
        )}
      </form>
    </div>
  );
};