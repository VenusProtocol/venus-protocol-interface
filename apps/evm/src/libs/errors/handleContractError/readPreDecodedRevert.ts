import { type BaseError, ContractFunctionRevertedError } from 'viem';

import type { ParsedContractError } from './parseContractError';

export const readPreDecodedRevert = (error: BaseError): ParsedContractError | undefined => {
  const layer = error.walk(e => e instanceof ContractFunctionRevertedError);
  if (!(layer instanceof ContractFunctionRevertedError) || !layer.data?.errorName) {
    return undefined;
  }
  return {
    errorName: layer.data.errorName,
    args: layer.data.args,
    signature: layer.signature,
  };
};
