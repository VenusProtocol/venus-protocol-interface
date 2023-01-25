import { ContractReceipt } from 'ethers';

export const checkForTransactionError = jest.fn((receipt: ContractReceipt) => receipt);
export const checkForComptrollerTransactionError = jest.fn((receipt: ContractReceipt) => receipt);
export const checkForTokenTransactionError = jest.fn((receipt: ContractReceipt) => receipt);
export const checkForVaiVaultTransactionError = jest.fn((receipt: ContractReceipt) => receipt);
export const checkForXvsVaultProxyTransactionError = jest.fn((receipt: ContractReceipt) => receipt);
export const checkForVaiControllerTransactionError = jest.fn((receipt: ContractReceipt) => receipt);
