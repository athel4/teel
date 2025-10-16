# Web3 Treasury Dashboard - Quick Start

## Setup (5 minutes)

### 1. Install & Run
```bash
npm install
npm start
```
App opens at `http://localhost:3000`

### 2. MetaMask Setup
- Install MetaMask extension
- App will auto-prompt to add Sepolia network
- Get test ETH: https://sepoliafaucet.com/

### 3. Get Test Tokens
- Connect wallet in app
- Click "🪙 Get Tokens" button
- Or manually: https://faucets.chain.link/sepolia (gives 10 LINK)

## Testing (2 minutes)

### Test Token Transfer
1. **Dashboard**: See your token balances
2. **Send page**: Fill form (recipient address + amount)
3. **Submit**: Approve in MetaMask
4. **Success**: See confirmation + transaction hash

### Verify Transfer Worked
**Recipient wallet:**
1. Add token to MetaMask: `0x779877A7B0D9E8603169DdbD7836e478b4624789` (LINK)
2. Or check: https://sepolia.etherscan.io/address/[RECIPIENT_ADDRESS]

**Sender wallet:**
- Balance decreases in app dashboard

## Requirements Met ✓
- ✅ Wallet connect/disconnect
- ✅ Display 3 ERC-20 token balances  
- ✅ Send tokens with validation
- ✅ Transaction status feedback
- ✅ React + TypeScript + Tailwind

## Troubleshooting
- **"Wrong Network"**: Let app switch to Sepolia
- **"Insufficient balance"**: Get more ETH from faucet
- **Tokens not showing**: Recipient must add token contract to MetaMask