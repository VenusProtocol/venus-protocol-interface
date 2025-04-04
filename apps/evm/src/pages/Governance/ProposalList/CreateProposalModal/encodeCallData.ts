import { parseFunctionSignature } from 'utilities';
import { encodeAbiParameters } from 'viem';

import { safeJsonParse } from './safeJsonParse';

const encodeCallData = (signature: string, callData: (string | undefined)[]) => {
  const processedCallData = callData.reduce(
    (acc, curr) => {
      if (curr === undefined) {
        return acc;
      }

      const parsedCurr = safeJsonParse(curr);
      // Output numbers as strings to prevent rounding issues numbers outside the safe integer range
      const formattedCurr = typeof parsedCurr !== 'number' ? parsedCurr : curr.toString();
      return [...acc, formattedCurr];
    },
    [] as (string | number | string[])[],
  );
  const callDataTypes = parseFunctionSignature(signature)?.inputs;
  return encodeAbiParameters(callDataTypes || [], processedCallData);
};

export default encodeCallData;
