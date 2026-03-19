import type { PendleContractCallParams } from 'clients/api/queries/getPendleSwapQuote';

const convertToBigIntByKeys = (obj: Record<string, unknown>, keys: string[]) => {
  if (typeof obj !== 'object') return obj;

  return Object.entries(obj).reduce<Record<string, unknown>>((accu, [key, value]) => {
    if (
      keys.includes(key) &&
      (typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'bigint' ||
        typeof value === 'boolean')
    ) {
      accu[key] = BigInt(value);
    } else {
      accu[key] = value;
    }
    return accu;
  }, {});
};

export const formatDepositOutput = (input: PendleContractCallParams) => {
  if (!Array.isArray(input)) return input;

  return [
    input[0],
    BigInt(input[1]),
    BigInt(input[2]),
    convertToBigIntByKeys(input[3], [
      'guessMin',
      'guessMax',
      'guessOffchain',
      'maxIteration',
      'eps',
    ]),
    {
      ...convertToBigIntByKeys(input[4], ['netTokenIn']),
      swapData: input[4].swapData.extCalldata,
    },
    {
      ...convertToBigIntByKeys(input[5], ['epsSkipMarket']),
      optData: input[5].optData,
    },
  ];
};
