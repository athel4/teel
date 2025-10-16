export class Web3Error extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'Web3Error';
  }
}

export const handleWeb3Error = (error: any): string => {
  if (error.code === 4001) {
    return 'Transaction rejected by user';
  }
  if (error.code === -32603) {
    return 'Internal JSON-RPC error';
  }
  if (error.message?.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  if (error.message?.includes('gas')) {
    return 'Gas estimation failed - check your balance';
  }
  if (error.message?.includes('network')) {
    return 'Network connection failed - please try again';
  }
  return error.message || 'Unknown error occurred';
};

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.error('Operation failed:', error);
    if (fallback !== undefined) return fallback;
    throw new Web3Error(handleWeb3Error(error));
  }
};