# Web3 Treasury Dashboard - Logic Flow

## Core Flow

### 1. Wallet Connection
```
User clicks "Connect" → MetaMask popup → Auto-switch to Sepolia → Connected
```

### 2. Token Balances
```
Connected → Fetch 3 ERC-20 balances → Display cards → Auto-refresh on changes
```

### 3. Send Tokens
```
Fill form → Blur input → Gas estimate → Submit → MetaMask approval → Blockchain → Success
```

## Key Components

### State Management
- **useWallet**: Connection status, address, provider
- **useBalances**: Token amounts from blockchain contracts
- **useTransaction**: Send status, gas estimation

### Gas Strategy
- **Display**: Show both Legacy + EIP-1559 estimates
- **Execute**: Always use Legacy (Sepolia compatible)
- **Trigger**: Only on input blur (no flickering)

### Error Handling
- Wrong network → Auto-switch prompt
- Invalid address → Form validation
- Insufficient balance → Clear error message

## Real Blockchain Integration
- **Live contracts**: Sepolia ERC-20 tokens (USDC, LINK, WETH)
- **Real transactions**: Actual gas fees, confirmations
- **No mocks**: Direct contract calls for balances