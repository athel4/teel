# Web3 Treasury Dashboard

A React + TypeScript + Tailwind web application with real MetaMask wallet connection, ERC-20 token balances, and token transfers on Sepolia testnet using ethers.js v6.

## Features

- **Real Wallet Connection**: MetaMask wallet connection/disconnection on Sepolia testnet
- **Token Balances**: Displays real ERC-20 token balances for USDC, DAI, and WETH
- **Token Transfers**: Real blockchain transactions with form validation and gas fee handling
- **Responsive Design**: Clean UI built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **State Management**: Zustand for wallet state management
- **Form Validation**: Zod schema validation for Ethereum addresses and amounts

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Validation**: Zod
- **Notifications**: React Hot Toast
- **Linting**: ESLint + Prettier

## Project Structure

```
src/
├── components/
│   ├── WalletConnect.tsx      # Wallet connection component
│   ├── TokenBalanceCard.tsx   # Token balance display card
│   └── SendTokenForm.tsx      # Token transfer form
├── hooks/
│   ├── useWallet.ts           # Wallet state management
│   ├── useBalances.ts         # Token balances management
│   └── useTransaction.ts      # Transaction handling
├── pages/
│   ├── Dashboard.tsx          # Main dashboard page
│   └── Send.tsx               # Send tokens page
├── mock/
│   └── mockBalances.ts        # Mock data and simulation functions
├── utils/
│   └── validation.ts          # Validation schemas and utilities
├── types/
│   └── token.d.ts             # TypeScript type definitions
└── App.tsx                    # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run lint` - Runs ESLint to check code quality
- `npm run format` - Formats code using Prettier

## Real Web3 Implementation Details

### Wallet Connection
- Real MetaMask connection using ethers.js v6 BrowserProvider
- Connects to Sepolia testnet (Chain ID: 11155111)
- Displays formatted address (first 6 + last 4 characters)
- Handles account and network changes

### Token Balances
- Real ERC-20 token balances fetched from Sepolia testnet
- Supports USDC, DAI, and WETH test tokens
- Refresh functionality fetches updated balances from blockchain
- Error handling for unsupported tokens or network issues

### Real Transactions
- Actual blockchain transactions using ERC-20 transfer function
- Gas fee estimation and transaction confirmation
- Transaction hash linking to Sepolia Etherscan
- Balance validation before sending
- Form validation for Ethereum addresses and positive amounts

## Sepolia Testnet Setup

### Prerequisites
1. **MetaMask Extension**: Install MetaMask browser extension
2. **Sepolia Network**: Add Sepolia testnet to MetaMask:
   - Network Name: Sepolia
   - RPC URL: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   - Chain ID: 11155111
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.etherscan.io

### Getting Test Tokens
1. **Sepolia ETH**: Get free ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
2. **Test ERC-20 Tokens**: The app uses these Sepolia test token addresses:
   - USDC: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
   - DAI: `0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357`
   - WETH: `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`

### Usage Instructions
1. Connect MetaMask to Sepolia testnet
2. Ensure you have Sepolia ETH for gas fees
3. Click "Connect MetaMask" in the app
4. View your real token balances on the Dashboard
5. Send tokens using the Send page (requires gas fees)

### Switching to Mainnet
To use on Ethereum mainnet:
1. Update token addresses in `src/hooks/useBalances.ts` and `src/hooks/useTransaction.ts`
2. Change network configuration in `.env`
3. **Warning**: Mainnet transactions cost real money!

## Development Notes

- Real blockchain interactions with proper error handling
- MetaMask integration with account and network change detection
- ERC-20 token balance fetching with decimal handling
- Transaction confirmation and Etherscan linking
- Form validation prevents invalid Ethereum addresses and amounts
- Responsive design works on mobile and desktop
- TypeScript ensures type safety throughout the application
- Gas fee estimation and insufficient balance checks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Format code: `npm run format`
6. Submit a pull request

## License

This project is licensed under the MIT License.