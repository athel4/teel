import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Transaction {
  hash: string;
  to: string;
  amount: string;
  token: string;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
}

export const TransactionHistory: React.FC = () => {
  const [transactions] = useLocalStorage<Transaction[]>('transaction_history', []);

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Recent Transactions</h3>
        <p className="text-gray-600 text-sm">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-semibold text-gray-800 mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.slice(0, 5).map((tx) => (
          <div key={tx.hash} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  tx.status === 'success' ? 'bg-green-500' : 
                  tx.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="font-medium text-sm">Sent {tx.amount} {tx.token}</span>
              </div>
              <p className="text-xs text-gray-500">
                To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(tx.timestamp).toLocaleString()}
              </p>
            </div>
            <a
              href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-xs"
            >
              View →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};