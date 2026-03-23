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

export const formatDepositParams = (input: PendleContractCallParams) => {
  if (!Array.isArray(input)) return input;

  return [
    input[1],
    BigInt(input[2]),
    convertKeysToNumber(input[3], {
      bigintKeyPaths: ['guessMin', 'guessMax', 'guessOffchain', 'eps'],
      numberKeyPaths: ['maxIteration'],
    }),
    convertKeysToNumber(input[4], {
      bigintKeyPaths: ['netTokenIn'],
      numberKeyPaths: ['swapData.swapType'],
    }),
    convertKeysToNumber(input[5], { bigintKeyPaths: ['epsSkipMarket'] }),
  ];
};

export const formatDepositNativeParams = (input: PendleContractCallParams) => {
  if (!Array.isArray(input)) return input;

  return [
    input[1],
    BigInt(input[2]),
    convertKeysToNumber(input[3], {
      bigintKeyPaths: ['guessMin', 'guessMax', 'guessOffchain', 'eps'],
      numberKeyPaths: ['maxIteration'],
    }),
    convertKeysToNumber(input[4], {
      bigintKeyPaths: ['netTokenIn'],
      numberKeyPaths: ['swapData.swapType'],
    }),
    convertKeysToNumber(input[5], { bigintKeyPaths: ['epsSkipMarket'] }),
  ];
};

export const formatWithdrawParams = (input: PendleContractCallParams, amountToken: BigNumber) => {
  if (!Array.isArray(input)) return input;

  return [
    input[1], // pendle market
    BigInt(amountToken.toFixed()), // token amount
    convertKeysToNumber(input[3], {
      bigintKeyPaths: ['minTokenOut'],
      numberKeyPaths: ['swapData.swapType'],
    }),
    convertKeysToNumber(input[4], {
      bigintKeyPaths: ['epsSkipMarket'],
    }),
  ];
};

export const formatRedeemParams = (input: PendleContractCallParams, amountToken: BigNumber) => {
  if (!Array.isArray(input)) return input;

  return [
    input[1], // pendle market
    BigInt(amountToken.toFixed()), // token amount
    convertKeysToNumber(input[3], {
      bigintKeyPaths: ['minTokenOut'],
      numberKeyPaths: ['swapData.swapType'],
    }),
    convertKeysToNumber(input[4], {
      bigintKeyPaths: ['epsSkipMarket'],
    }),
  ];
};
