import { ContractReceipt } from 'ethers';

export const checkForTransactionError = vi.fn((receipt: ContractReceipt) => receipt);
export const checkForComptrollerTransactionError = vi.fn((receipt: ContractReceipt) => receipt);
export const checkForTokenTransactionError = vi.fn((receipt: ContractReceipt) => receipt);
export const checkForVaiVaultTransactionError = vi.fn((receipt: ContractReceipt) => receipt);
export const checkForXvsVaultProxyTransactionError = vi.fn((receipt: ContractReceipt) => receipt);
export const checkForVaiControllerTransactionError = vi.fn((receipt: ContractReceipt) => receipt);
