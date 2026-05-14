import { describe, expect, it } from 'vitest';
import { BaseError, ContractFunctionRevertedError, encodeErrorResult } from 'viem';

import { isolatedPoolComptrollerAbi } from 'libs/contracts';

import { parseContractError } from '../parseContractError';

describe('parseContractError', () => {
  it('decodes a viem ContractFunctionRevertedError that already carries decoded data', () => {
    const data = encodeErrorResult({
      abi: isolatedPoolComptrollerAbi,
      errorName: 'ActionPaused',
      args: ['0xED827b80Bd838192EA95002C01B5c6dA8354219a', 1],
    });

    const error = new ContractFunctionRevertedError({
      abi: isolatedPoolComptrollerAbi,
      data,
      functionName: 'preBorrowHook',
    });

    const parsed = parseContractError(error);
    expect(parsed?.errorName).toBe('ActionPaused');
    expect(parsed?.args).toEqual(['0xED827b80Bd838192EA95002C01B5c6dA8354219a', 1]);
  });

  it('decodes raw hex revert data nested in the cause chain (estimateGas path)', () => {
    const rawData = encodeErrorResult({
      abi: isolatedPoolComptrollerAbi,
      errorName: 'BorrowCapExceeded',
      args: ['0xED827b80Bd838192EA95002C01B5c6dA8354219a', 1000n],
    });

    const error = new BaseError('execution reverted', {
      cause: { data: rawData } as unknown as Error,
    });

    const parsed = parseContractError(error);
    expect(parsed?.errorName).toBe('BorrowCapExceeded');
    expect(parsed?.args?.[1]).toBe(1000n);
  });

  it('returns UnknownContractError when the selector is not in any Venus ABI', () => {
    const error = new BaseError('execution reverted', {
      cause: { data: '0xdeadbeef' } as unknown as Error,
    });

    const parsed = parseContractError(error);
    expect(parsed?.errorName).toBe('UnknownContractError');
    expect(parsed?.signature).toBe('0xdeadbeef');
  });

  it('returns undefined for non-viem errors', () => {
    expect(parseContractError(new Error('random'))).toBeUndefined();
    expect(parseContractError(null)).toBeUndefined();
    expect(parseContractError('boom')).toBeUndefined();
  });
});
