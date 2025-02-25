import { parseFunctionSignature } from 'utilities';
import { encodeAbiParameters } from 'viem';

import formatIfArray from './formatIfArray';

const encodeCallData = (signature: string, callData: (string | undefined)[]) => {
  const processedCallData = callData.reduce(
    (acc, curr) => {
      if (curr !== undefined) {
        acc.push(formatIfArray(curr));
      }
      return acc;
    },
    [] as (string | number | string[])[],
  );
  const callDataTypes = parseFunctionSignature(signature)?.inputs.map(input => input);
  return encodeAbiParameters(callDataTypes || [], processedCallData);
};

export default encodeCallData;
