import React from 'react';
import { Token } from '../types/token';

interface TokenBalanceCardProps {
  token: Token;
}

export const TokenBalanceCard: React.FC<TokenBalanceCardProps> = ({ token }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{token.logo}</div>
          <div>
            <h3 className="font-semibold text-lg">{token.symbol}</h3>
            <p className="text-gray-600 text-sm">{token.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{token.balance}</p>
          <p className="text-gray-500 text-sm">{token.symbol}</p>
        </div>
      </div>
    </div>
  );
};