import { useState } from 'react';
import { ethers } from 'ethers';
import { TransactionState, SendTokenForm } from '../types/token';
import { withErrorHandling, handleWeb3Error } from '../utils/errorHandler';
import { getReliableProvider } from '../utils/rpc';

const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)'
];

// Real Sepolia testnet token addresses
const TOKEN_ADDRESSES: Record<string, string> = {
  'USDC': '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  'LINK': '0x779877A7B0D9E8603169DdbD7836e478b4624789',
  'WETH': '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9'
};

export const useTransaction = () => {
  const [transaction, setTransaction] = useState<TransactionState>({
    status: 'idle',
    hash: null,
    error: null,
  });

  const sendToken = async (formData: SendTokenForm, provider: ethers.BrowserProvider) => {
    setTransaction({ status: 'pending', hash: null, error: null });
    
    await withErrorHandling(async () => {
      const signer = await provider.getSigner();
      const tokenAddress = TOKEN_ADDRESSES[formData.token];
      
      if (!tokenAddress) {
        throw new Error(`Token ${formData.token} not supported`);
      }

      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const decimals = await contract.decimals();
      
      // Check balance before sending
      const userAddress = await signer.getAddress();
      const balance = await contract.balanceOf(userAddress);
      const amountToSend = ethers.parseUnits(formData.amount, decimals);
      
      if (balance < amountToSend) {
        throw new Error('Insufficient token balance');
      }

      // Estimate gas
      const gasEstimate = await contract.transfer.estimateGas(formData.recipient, amountToSend);
      const gasPrice = await provider.getFeeData();
      
      // Send transaction with gas settings
      const tx = await contract.transfer(formData.recipient, amountToSend, {
        gasLimit: gasEstimate * BigInt(120) / BigInt(100), // Add 20% buffer
        gasPrice: gasPrice.gasPrice
      });
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        setTransaction({
          status: 'success',
          hash: receipt.hash,
          error: null,
        });
      } else {
        throw new Error('Transaction failed');
      }
    }).catch((error: any) => {
      setTransaction({
        status: 'error',
        hash: null,
        error: handleWeb3Error(error),
      });
    });
  };

  const estimateGas = async (formData: SendTokenForm, provider: ethers.BrowserProvider) => {
    return withErrorHandling(async () => {
      const signer = await provider.getSigner();
      const tokenAddress = TOKEN_ADDRESSES[formData.token];
      
      if (!tokenAddress) throw new Error(`Token ${formData.token} not supported`);

      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const decimals = await contract.decimals();
      const amountToSend = ethers.parseUnits(formData.amount, decimals);
      
      const gasEstimate = await contract.transfer.estimateGas(formData.recipient, amountToSend);
      const gasPrice = await provider.getFeeData();
      
      return {
        gasLimit: gasEstimate,
        gasPrice: gasPrice.gasPrice || BigInt(0),
        totalCost: gasEstimate * (gasPrice.gasPrice || BigInt(0))
      };
    });
  };

  const resetTransaction = () => {
    setTransaction({ status: 'idle', hash: null, error: null });
  };

  return { transaction, sendToken, resetTransaction, estimateGas };
};

export async function sendTokenDirect(
  provider: ethers.BrowserProvider,
  tokenSymbol: string,
  to: string,
  amount: string
) {
  const signer = await provider.getSigner();
  const tokenAddress = TOKEN_ADDRESSES[tokenSymbol];
  
  if (!tokenAddress) {
    throw new Error(`Token ${tokenSymbol} not supported`);
  }
  
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  const decimals = await contract.decimals();
  const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals));
  await tx.wait();
  return tx.hash;
}