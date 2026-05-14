import {
  type Abi,
  BaseError,
  ContractFunctionRevertedError,
  type Hex,
  decodeErrorResult,
} from 'viem';

import {
  isolatedPoolComptrollerAbi,
  legacyPoolComptrollerAbi,
  nativeTokenGatewayAbi,
  primeAbi,
  vBep20Abi,
  vBnbAbi,
  vaiControllerAbi,
} from 'libs/contracts';

export interface ParsedContractError {
  errorName: string;
  args?: readonly unknown[];
  signature?: Hex;
}

const VENUS_ABIS: Abi[] = [
  isolatedPoolComptrollerAbi,
  legacyPoolComptrollerAbi,
  vBep20Abi,
  vBnbAbi,
  primeAbi,
  vaiControllerAbi,
  nativeTokenGatewayAbi,
];

// A 4-byte selector takes 10 chars (`0x` + 8 hex digits)
const SELECTOR_LENGTH = 10;

export const parseContractError = (error: unknown): ParsedContractError | undefined => {
  if (!(error instanceof BaseError)) {
    return undefined;
  }

  // Case A: viem already decoded the revert against an ABI it had at call time
  // (writeContract / simulateContract path)
  const revertError = error.walk(e => e instanceof ContractFunctionRevertedError);
  if (revertError instanceof ContractFunctionRevertedError && revertError.data?.errorName) {
    return {
      errorName: revertError.data.errorName,
      args: revertError.data.args,
      signature: revertError.signature,
    };
  }

  // Case B: viem couldn't decode (e.g. estimateGas has no ABI) — pick up the raw
  // revert hex from the cause chain and try each Venus ABI
  const rawData = findRawRevertData(error);
  if (!rawData) {
    return undefined;
  }

  for (const abi of VENUS_ABIS) {
    try {
      const decoded = decodeErrorResult({ abi, data: rawData });
      return {
        errorName: decoded.errorName,
        args: decoded.args,
        signature: rawData.slice(0, SELECTOR_LENGTH) as Hex,
      };
    } catch {
      // selector not in this ABI, try the next one
    }
  }

  return {
    errorName: 'UnknownContractError',
    signature: rawData.slice(0, SELECTOR_LENGTH) as Hex,
  };
};

const getRevertData = (value: unknown): Hex | undefined => {
  const data = (value as { data?: unknown })?.data;
  if (typeof data === 'string' && data.startsWith('0x') && data.length >= SELECTOR_LENGTH) {
    return data as Hex;
  }
  return undefined;
};

const findRawRevertData = (error: BaseError): Hex | undefined => {
  let rawData: Hex | undefined;
  error.walk(e => {
    rawData = getRevertData(e);
    return rawData !== undefined;
  });
  return rawData;
};
