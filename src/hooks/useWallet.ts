import { create } from 'zustand';
import { ethers } from 'ethers';
import { withErrorHandling } from '../utils/errorHandler';
import { isCorrectNetwork } from '../utils/networks';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletStore {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
}

export const useWallet = create<WalletStore>((set, get) => ({
  address: null,
  provider: null,
  isConnected: false,
  isConnecting: false,
  error: null,

  connect: async () => {
    await withErrorHandling(async () => {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not found. Please install MetaMask.');
      }

      set({ isConnecting: true, error: null });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      // Check network and auto-switch
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (!isCorrectNetwork(chainId)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            // Network not added, add it
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia Testnet',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/']
              }]
            });
          } else {
            throw new Error('Please manually switch to Sepolia testnet in MetaMask');
          }
        }
      }
      
      set({ 
        address: accounts[0], 
        provider, 
        isConnected: true, 
        isConnecting: false,
        error: null
      });
    }).catch(error => {
      set({ 
        error: error.message,
        isConnecting: false,
        isConnected: false
      });
    });
  },

  disconnect: () => {
    set({ 
      address: null, 
      provider: null, 
      isConnected: false, 
      isConnecting: false,
      error: null
    });
  },

  clearError: () => {
    set({ error: null });
  }
}));

// Auto-detect existing connection
if (typeof window !== 'undefined' && window.ethereum) {
  withErrorHandling(async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (isCorrectNetwork(chainId)) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        useWallet.setState({ 
          address: accounts[0], 
          provider, 
          isConnected: true 
        });
      }
    }
  });

  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    if (accounts.length > 0) {
      withErrorHandling(async () => {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (isCorrectNetwork(chainId)) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          useWallet.setState({ 
            address: accounts[0], 
            provider, 
            isConnected: true,
            error: null
          });
        } else {
          useWallet.setState({ 
            address: null, 
            provider: null, 
            isConnected: false,
            error: 'Wrong network - please switch to Sepolia'
          });
        }
      });
    } else {
      useWallet.setState({ 
        address: null, 
        provider: null, 
        isConnected: false,
        error: null
      });
    }
  });

  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });
}