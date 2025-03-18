import { parseFunctionSignature } from 'utilities';
import { encodeAbiParameters } from 'viem';

import { safeJsonParse } from './safeJsonParse';

const encodeCallData = (signature: string, callData: (string | undefined)[]) => {
  const processedCallData = callData.reduce(
    (acc, curr) => {
      if (curr !== undefined) {
        acc.push(safeJsonParse(curr));
      }
      return acc;
    },
    [] as (string | number | string[])[],
  );
  const callDataTypes = parseFunctionSignature(signature)?.inputs;
  return encodeAbiParameters(callDataTypes || [], processedCallData);
};

export default encodeCallData;
