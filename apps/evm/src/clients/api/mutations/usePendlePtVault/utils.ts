import type BigNumber from 'bignumber.js';
import type { PendleContractCallParams } from 'clients/api/queries/getPendleSwapQuote';
import _ from 'lodash';

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

export const formatDepositNativeParams = (params: PendleContractCallParams) => {
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

export const formatWithdrawParams = (params: PendleContractCallParams, amountToken: BigNumber) => {
  if (!Array.isArray(params)) return params;

  return [
    params[1], // pendle market
    BigInt(amountToken.toFixed()), // use vToken amount
    convertKeysToNumber(params[3], {
      bigintKeyPaths: ['minTokenOut'],
      numberKeyPaths: ['swapData.swapType'],
    }),
    convertKeysToNumber(params[4], {
      bigintKeyPaths: ['epsSkipMarket'],
    }),
  ];
};

export const formatRedeemParams = (params: PendleContractCallParams, amountToken: BigNumber) => {
  if (!Array.isArray(params)) return params;

  return [
    params[1], // pendle market
    BigInt(amountToken.toFixed()), // use vToken amount
    convertKeysToNumber(params[3], {
      bigintKeyPaths: ['minTokenOut'],
      numberKeyPaths: ['swapData.swapType'],
    }),
    convertKeysToNumber(params[4], {
      bigintKeyPaths: ['epsSkipMarket'],
    }),
  ];
};
