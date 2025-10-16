export interface Token {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  logo: string;
  address?: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  provider: any;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export interface TransactionState {
  status: 'idle' | 'pending' | 'success' | 'error';
  hash: string | null;
  error: string | null;
}

export interface SendTokenForm {
  recipient: string;
  amount: string;
  token: string;
}