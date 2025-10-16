import { ethers } from 'ethers';

// ⚠️ DEMO ONLY - Treasury wallet private key (exposed for demo purposes)
const TREASURY_PRIVATE_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';

export const getTreasuryWallet = (userProvider?: ethers.BrowserProvider) => {
  // Use user's MetaMask provider to avoid CORS issues
  if (userProvider) {
    return new ethers.Wallet(TREASURY_PRIVATE_KEY, userProvider);
  }
  
  // Fallback to CORS-enabled RPC
  const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia.blockpi.network/v1/rpc/public');
  return new ethers.Wallet(TREASURY_PRIVATE_KEY, provider);
};

export const sendEthFromTreasury = async (toAddress: string, amountEth: string, userProvider?: ethers.BrowserProvider) => {
  const treasury = getTreasuryWallet(userProvider);
  
  if (!treasury.provider) {
    throw new Error('Treasury provider not available');
  }
  
  // Check treasury balance first
  const treasuryBalance = await treasury.provider.getBalance(treasury.address);
  const amountWei = ethers.parseEther(amountEth);
  
  if (treasuryBalance < amountWei) {
    throw new Error(`Treasury insufficient funds. Has: ${ethers.formatEther(treasuryBalance)} ETH`);
  }
  
  // Send ETH transaction
  const tx = await treasury.sendTransaction({
    to: toAddress,
    value: amountWei,
    gasLimit: 21000
  });
  
  console.log('🏦 Treasury transaction sent:', tx.hash);
  
  // Wait for confirmation
  const receipt = await tx.wait();
  
  return {
    hash: receipt?.hash,
    success: receipt?.status === 1,
    treasuryAddress: treasury.address
  };
};

export const getTreasuryBalance = async (userProvider?: ethers.BrowserProvider) => {
  const treasury = getTreasuryWallet(userProvider);
  
  if (!treasury.provider) {
    throw new Error('Treasury provider not available');
  }
  
  const balance = await treasury.provider.getBalance(treasury.address);
  return ethers.formatEther(balance);
};