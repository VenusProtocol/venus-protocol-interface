import { BaseError, ContractFunctionRevertedError, encodeErrorResult } from 'viem';
import { describe, expect, it } from 'vitest';

import {
  collateralGatewayAbi,
  isolatedPoolComptrollerAbi,
  spokeComptrollerAbi,
} from 'libs/contracts';

import { parseContractError } from '..';

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

  it('decodes a Spoke comptroller revert raised through the collateral gateway', () => {
    const rawData = encodeErrorResult({
      abi: spokeComptrollerAbi,
      errorName: 'SupplyNotAllowed',
      args: [
        '0x7157241D1eaA53C823f292b605522B2B3adC1496',
        '0xD2C567D65875A219dC45a4E6090c3b2E875b448C',
      ],
    });

    const error = new BaseError('execution reverted', {
      cause: { data: rawData } as unknown as Error,
    });

    const parsed = parseContractError(error);
    expect(parsed?.errorName).toBe('SupplyNotAllowed');
    expect(parsed?.signature).toBe('0xb75eecd4');
  });

  it('decodes a collateral gateway revert', () => {
    const rawData = encodeErrorResult({
      abi: collateralGatewayAbi,
      errorName: 'MarketNotRegistered',
      args: ['0x7157241D1eaA53C823f292b605522B2B3adC1496'],
    });

    const error = new BaseError('execution reverted', {
      cause: { data: rawData } as unknown as Error,
    });

    expect(parseContractError(error)?.errorName).toBe('MarketNotRegistered');
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
