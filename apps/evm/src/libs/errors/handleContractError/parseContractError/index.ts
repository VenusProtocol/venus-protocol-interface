import { BaseError, type Hex } from 'viem';

import { SELECTOR_LENGTH } from '../constants';
import { decodeWithContractErrorAbis } from '../decodeWithContractErrorAbis';
import { readPreDecodedRevert } from '../readPreDecodedRevert';
import { readRawRevertData } from '../readRawRevertData';

export interface ParsedContractError {
  errorName: string;
  args?: readonly unknown[];
  signature?: Hex;
}

export const parseContractError = (error: unknown): ParsedContractError | undefined => {
  if (!(error instanceof BaseError)) {
    return undefined;
  }

  // viem already decoded the revert via the ABI used at call time (writeContract / simulateContract path)
  const preDecoded = readPreDecodedRevert(error);
  if (preDecoded) {
    return preDecoded;
  }

  const rawData = readRawRevertData(error);
  if (!rawData) {
    return undefined;
  }
  const signature = rawData.slice(0, SELECTOR_LENGTH) as Hex;
  return (
    decodeWithContractErrorAbis(rawData, signature) ?? {
      errorName: 'UnknownContractError',
      signature,
    }
  );
};
