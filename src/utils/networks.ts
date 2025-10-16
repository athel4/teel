export const NETWORKS = {
  SEPOLIA: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://rpc.sepolia.org',
      'https://sepolia.gateway.tenderly.co',
      'https://ethereum-sepolia.blockpi.network/v1/rpc/public'
    ],
    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
  },
};

export const switchToSepolia = async () => {
  if (!window.ethereum) throw new Error('MetaMask not found');
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: NETWORKS.SEPOLIA.chainId }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [NETWORKS.SEPOLIA],
      });
    } else {
      throw switchError;
    }
  }
};

export const isCorrectNetwork = (chainId: string) => {
  return chainId === NETWORKS.SEPOLIA.chainId;
};