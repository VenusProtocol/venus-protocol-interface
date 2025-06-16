import type { GetSupertransactionReceiptPayloadWithReceipts } from '@biconomy/abstractjs-canary';
import type { TransactionReceipt } from 'viem';
import { getTransactionStatus } from '../index';

describe('getTransactionStatus', () => {
  it('should return undefined when no transaction receipt is provided', () => {
    expect(getTransactionStatus({ transactionReceipt: undefined })).toBeUndefined();
  });

  it('should return success for a successful viem transaction receipt', () => {
    const mockViemReceipt = {
      status: 'success',
    } as TransactionReceipt;

    expect(getTransactionStatus({ transactionReceipt: mockViemReceipt })).toBe('success');
  });

  it('should return failure for a failed viem transaction receipt', () => {
    const mockViemReceipt = {
      status: 'reverted',
    } as TransactionReceipt;

    expect(getTransactionStatus({ transactionReceipt: mockViemReceipt })).toBe('failure');
  });

  it('should return success for a successful biconomy transaction receipt', () => {
    const mockBiconomyReceipt = {
      transactionStatus: 'MINED_SUCCESS',
    } as GetSupertransactionReceiptPayloadWithReceipts;

    expect(getTransactionStatus({ transactionReceipt: mockBiconomyReceipt })).toBe('success');
  });

  it('should return failure for a failed biconomy transaction receipt', () => {
    const mockBiconomyReceipt = {
      transactionStatus: 'MINED_FAIL',
    } as GetSupertransactionReceiptPayloadWithReceipts;

    expect(getTransactionStatus({ transactionReceipt: mockBiconomyReceipt })).toBe('failure');
  });
});
