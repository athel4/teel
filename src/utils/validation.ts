import { z } from 'zod';

export const ethereumAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format');

export const sendTokenSchema = z.object({
  recipient: ethereumAddressSchema,
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Amount must be a positive number'),
  token: z.string().min(1, 'Token is required'),
});

export const validateEthereumAddress = (address: string): boolean => {
  return ethereumAddressSchema.safeParse(address).success;
};

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};