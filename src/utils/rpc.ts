import { ethers } from 'ethers';

const RPC_ENDPOINTS = [
  'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
  'https://sepolia.gateway.tenderly.co',
  'https://rpc2.sepolia.org'
];

let fallbackProvider: ethers.JsonRpcProvider | null = null;

export const getFallbackProvider = () => {
  if (!fallbackProvider) {
    fallbackProvider = new ethers.JsonRpcProvider(RPC_ENDPOINTS[0]);
  }
  return fallbackProvider;
};

export const getReliableProvider = (userProvider?: ethers.BrowserProvider) => {
  // Use user's MetaMask provider if available, fallback to RPC
  return userProvider || getFallbackProvider();
};