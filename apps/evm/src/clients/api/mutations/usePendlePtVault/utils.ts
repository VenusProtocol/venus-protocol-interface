import BigNumber from 'bignumber.js';
import type { PendleContractCallParams } from 'clients/api/queries/getPendleSwapQuote';
import _ from 'lodash';
import type { Token, VToken } from 'types';
import { convertMantissaToTokens, convertTokensToMantissa } from 'utilities';

const convertKeysToNumber = (
  obj: Record<string, unknown>,
  {
    bigintKeyPaths = [],
    numberKeyPaths = [],
  }: {
    bigintKeyPaths?: string[];
    numberKeyPaths?: string[];
  },
) => {
  if (!!obj && typeof obj !== 'object') return obj;

  (bigintKeyPaths ?? []).forEach((keyPath: string) => {
    const value = _.get(obj, keyPath);
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
      _.set(obj, keyPath, BigInt(value));
    }
  });

  (numberKeyPaths ?? []).forEach(keyPath => {
    const value = _.get(obj, keyPath);
    if (typeof value === 'string') {
      _.set(obj, keyPath, Number(value));
    }
  });

  return obj;
};

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

export const formatWithdrawParams = (
  params: PendleContractCallParams,
  { fromToken, vToken }: { fromToken: Token; vToken: VToken },
) => {
  if (!Array.isArray(params)) return params;

  // The API handles underlying Token transfer quote, but the SC requres vToken amount instead, so there will be a conversion between the two and this is intentional.
  const amountToken = convertMantissaToTokens({
    value: new BigNumber(params[2]),
    token: fromToken,
  });

  const vTokenMantissa = convertTokensToMantissa({
    value: amountToken,
    token: vToken,
  });

  return [
    params[1], // pendle market
    BigInt(vTokenMantissa.toFixed(0, 1)), // use vToken amount
    convertKeysToNumber(params[3], {
      bigintKeyPaths: ['minTokenOut'],
      numberKeyPaths: ['swapData.swapType'],
    }),
    convertKeysToNumber(params[4], {
      bigintKeyPaths: ['epsSkipMarket'],
    }),
  ];
};
