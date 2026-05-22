import { type Hex, decodeErrorResult } from 'viem';

import type { ParsedContractError } from '../parseContractError';
import { CONTRACT_ERROR_ABIS } from './constants';

export const decodeWithContractErrorAbis = (
  rawData: Hex,
  signature: Hex,
): ParsedContractError | undefined => {
  for (const abi of CONTRACT_ERROR_ABIS) {
    try {
      const decoded = decodeErrorResult({ abi, data: rawData });
      return { errorName: decoded.errorName, args: decoded.args, signature };
    } catch {
      // selector not in this ABI
    }
  }
  return undefined;
};
