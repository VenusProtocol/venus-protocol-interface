/**
 * Demo: visualise what `parseContractError` does to a raw viem revert.
 *
 * Run with: `yarn vitest run src/libs/errors/handleContractError/__tests__/beforeAfterDemo`
 */
import { describe, expect, it } from 'vitest';
import { BaseError, ContractFunctionRevertedError, encodeErrorResult } from 'viem';

import { isolatedPoolComptrollerAbi } from 'libs/contracts';

import { parseContractError } from '../parseContractError';

describe('parseContractError — what we get back', () => {
  it('viem-decoded path: writeContract / simulateContract style', () => {
    const data = encodeErrorResult({
      abi: isolatedPoolComptrollerAbi,
      errorName: 'ActionPaused',
      args: ['0xED827b80Bd838192EA95002C01B5c6dA8354219a', 1],
    });
    const input = new ContractFunctionRevertedError({
      abi: isolatedPoolComptrollerAbi,
      data,
      functionName: 'preBorrowHook',
    });

    console.log('\n========== CASE A: viem-already-decoded ==========');
    console.log('INPUT (what we received from viem):');
    console.log('  type            =', input.constructor.name);
    console.log('  raw hex (data)  =', data);
    console.log('  4-byte selector =', data.slice(0, 10));

    const output = parseContractError(input);

    console.log('\nOUTPUT (what parseContractError returns):');
    console.log('  ', JSON.stringify(output, bigintReplacer, 2));
    console.log('==================================================\n');

    expect(output?.errorName).toBe('ActionPaused');
  });

  it('raw-hex path: estimateGas style — this is what the screenshot shows', () => {
    const data = encodeErrorResult({
      abi: isolatedPoolComptrollerAbi,
      errorName: 'BorrowCapExceeded',
      args: ['0xED827b80Bd838192EA95002C01B5c6dA8354219a', 1000n],
    });
    const input = new BaseError(`Execution reverted with reason: ${data.slice(0, 10)}.`, {
      cause: { data } as unknown as Error,
    });

    console.log('\n========== CASE B: raw-hex (the screenshot case) ==========');
    console.log('INPUT (what we received from viem):');
    console.log('  type                 =', input.constructor.name);
    console.log('  error.message        =', input.message);
    console.log('  error.cause.data     =', (input.cause as { data: string }).data);
    console.log('  4-byte selector      =', data.slice(0, 10));
    console.log('  ← viem did NOT decode this because estimateGas has no ABI context');

    const output = parseContractError(input);

    console.log('\nOUTPUT (what parseContractError returns):');
    console.log('  ', JSON.stringify(output, bigintReplacer, 2));
    console.log('  ← we decoded it ourselves by trying each Venus ABI');
    console.log('============================================================\n');

    expect(output?.errorName).toBe('BorrowCapExceeded');
  });

  it('unknown selector: falls back to UnknownContractError', () => {
    const input = new BaseError('Execution reverted', {
      cause: { data: '0xdeadbeef' } as unknown as Error,
    });

    console.log('\n========== CASE C: unknown selector ==========');
    console.log('INPUT (what we received from viem):');
    console.log('  error.cause.data =', '0xdeadbeef');
    console.log('  ← not in any Venus ABI');

    const output = parseContractError(input);

    console.log('\nOUTPUT (what parseContractError returns):');
    console.log('  ', JSON.stringify(output, bigintReplacer, 2));
    console.log('  ← name=UnknownContractError signals "fall back to generic toast"');
    console.log('==============================================\n');

    expect(output?.errorName).toBe('UnknownContractError');
  });

  it('non-viem error: parseContractError stays out of the way', () => {
    const input = new Error('something random');

    console.log('\n========== CASE D: not a viem error ==========');
    console.log('INPUT  =', input);

    const output = parseContractError(input);

    console.log('OUTPUT =', output);
    console.log('  ← undefined → handleError uses its existing logic, no behaviour change');
    console.log('==============================================\n');

    expect(output).toBeUndefined();
  });
});

const bigintReplacer = (_key: string, value: unknown) =>
  typeof value === 'bigint' ? `${value}n` : value;
