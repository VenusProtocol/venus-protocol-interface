import type { TransactionReceipt } from 'viem';

export const checkForTransactionError = vi.fn((receipt: TransactionReceipt) => receipt);
export const checkForComptrollerTransactionError = vi.fn((receipt: TransactionReceipt) => receipt);
export const checkForTokenTransactionError = vi.fn((receipt: TransactionReceipt) => receipt);
export const checkForVaiVaultTransactionError = vi.fn((receipt: TransactionReceipt) => receipt);
export const checkForXvsVaultProxyTransactionError = vi.fn(
  (receipt: TransactionReceipt) => receipt,
);
export const checkForVaiControllerTransactionError = vi.fn(
  (receipt: TransactionReceipt) => receipt,
);
