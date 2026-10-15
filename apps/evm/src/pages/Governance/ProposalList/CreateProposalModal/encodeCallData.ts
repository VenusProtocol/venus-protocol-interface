import { parseFunctionSignature } from 'utilities';
import { encodeAbiParameters } from 'viem';

import { parseCallDataValue } from './parseCallDataValue';

const encodeCallData = (signature: string, callData: (string | undefined)[]) => {
  const processedCallData = callData.reduce(
    (acc, curr) => {
      if (curr === undefined) {
        return acc;
      }

      return [...acc, parseCallDataValue(curr)];
    },
    [] as (string | number | string[])[],
  );
  const callDataTypes = parseFunctionSignature(signature)?.inputs;
  return encodeAbiParameters(callDataTypes || [], processedCallData);
};

export default encodeCallData;
