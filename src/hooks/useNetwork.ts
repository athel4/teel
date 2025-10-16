import { useState, useEffect } from 'react';
import { isCorrectNetwork, switchToSepolia } from '../utils/networks';

export const useNetwork = () => {
  const [chainId, setChainId] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        try {
          const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(currentChainId);
          setIsWrongNetwork(!isCorrectNetwork(currentChainId));
        } catch (error) {
          console.error('Failed to get chain ID:', error);
        }
      }
    };

    checkNetwork();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', (newChainId: string) => {
        setChainId(newChainId);
        setIsWrongNetwork(!isCorrectNetwork(newChainId));
      });
    }
  }, []);

  const switchNetwork = async () => {
    setSwitching(true);
    try {
      await switchToSepolia();
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    } finally {
      setSwitching(false);
    }
  };

  return { chainId, isWrongNetwork, switching, switchNetwork };
};