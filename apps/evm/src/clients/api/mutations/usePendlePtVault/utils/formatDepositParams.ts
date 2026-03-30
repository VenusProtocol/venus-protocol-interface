import type { PendleContractCallParams } from 'clients/api';
import { convertKeysToNumber } from './convertKeysToNumber';

export const formatDepositParams = (params: PendleContractCallParams) => {
  if (!Array.isArray(params)) return params;

  return [
    params[1],
    BigInt(params[2]),
    convertKeysToNumber(params[3], {
      bigintKeyPaths: ['guessMin', 'guessMax', 'guessOffchain', 'eps'],
      numberKeyPaths: ['maxIteration'],
    }),
    convertKeysToNumber(params[4], {
      bigintKeyPaths: ['netTokenIn'],
      numberKeyPaths: ['swapData.swapType'],
    }),
    convertKeysToNumber(params[5], { bigintKeyPaths: ['epsSkipMarket'] }),
  ];
};
