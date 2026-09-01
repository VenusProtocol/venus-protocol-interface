import BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { ChainId } from 'types';
import { formatToTradeTransaction } from '..';
import type { ApiAccountHistoricalTransaction, VTokenAssetMapping } from '../../../types';

const dsaAsset = assetData[0];
const longAsset = assetData[1];
const shortAsset = assetData[2];

const vTokenAssetMapping: VTokenAssetMapping = {
  [dsaAsset.vToken.address.toLowerCase() as Address]: {
    ...dsaAsset,
    poolName: 'Core pool',
  },
  [longAsset.vToken.address.toLowerCase() as Address]: {
    ...longAsset,
    poolName: 'Core pool',
  },
  [shortAsset.vToken.address.toLowerCase() as Address]: {
    ...shortAsset,
    poolName: 'Core pool',
  },
};

export const fakeApiTradeTransaction: ApiAccountHistoricalTransaction = {
  id: 'fake-id',
  chainId: ChainId.BSC_TESTNET,
  txHash: '0xfakehash',
  txIndex: 1,
  txTimestamp: new Date('2024-08-23T04:17:09.000Z'),
  blockNumber: '41604851',
  txType: 'position_opened_with_principal',
  accountAddress: fakeAccountAddress,
  contractAddress: '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
  amountVTokenMantissa: null,
  amountUnderlyingMantissa: null,
  underlyingAddress: dsaAsset.vToken.underlyingToken.address,
  underlyingTokenPriceMantissa: null,
  yieldPlusPositionAccountAddress: null,
  yieldPlusLongVTokenAddress: longAsset.vToken.address,
  yieldPlusShortVTokenAddress: shortAsset.vToken.address,
  yieldPlusDsaVTokenAddress: dsaAsset.vToken.address,
  yieldPlusCycleId: null,
  yieldPlusEffectiveLeverageRatio: null,
  yieldPlusInitialPrincipalMantissa: null,
  yieldPlusPrincipalAmountMantissa: '1000000000000000000',
  yieldPlusNewTotalPrincipalMantissa: null,
  yieldPlusRemainingPrincipalMantissa: null,
  yieldPlusShortAmountMantissa: '3000000',
  yieldPlusLongAmountMantissa: '2000000',
  yieldPlusAdditionalPrincipalMantissa: null,
  yieldPlusCloseFractionBps: null,
  yieldPlusAmountRepaidMantissa: '500000',
  yieldPlusAmountRedeemedMantissa: '750000',
  yieldPlusAmountRedeemedDsaMantissa: '250000000000000000',
  yieldPlusLongDustRedeemedMantissa: null,
  yieldPlusAmountConvertedToProfitMantissa: null,
  yieldPlusDsaProfitAmountMantissa: '125000000000000000',
  migrationVTokenAddress: null,
  migrationVTokenAmountMantissa: null,
};

describe('formatToTradeTransaction', () => {
  it('formats trade transaction metadata and all supported amount fields', () => {
    const transaction = formatToTradeTransaction({
      vTokenAssetMapping,
      apiTransaction: {
        ...fakeApiTradeTransaction,
        yieldPlusCycleId: '42',
      },
      txType: 'positionReducedWithProfit',
    });

    expect(transaction).toMatchObject({
      cycleId: '42',
      txType: 'positionReducedWithProfit',
      hash: fakeApiTradeTransaction.txHash,
      blockTimestamp: fakeApiTradeTransaction.txTimestamp,
      blockNumber: fakeApiTradeTransaction.blockNumber,
      accountAddress: fakeApiTradeTransaction.accountAddress,
      contractAddress: fakeApiTradeTransaction.contractAddress,
      chainId: fakeApiTradeTransaction.chainId,
    });
    expect(
      transaction.amounts?.map(amount => ({
        symbol: amount.token.symbol,
        amountTokens: amount.amountTokens.toString(),
      })),
    ).toEqual([
      {
        symbol: dsaAsset.vToken.underlyingToken.symbol,
        amountTokens: '1',
      },
      {
        symbol: dsaAsset.vToken.underlyingToken.symbol,
        amountTokens: '-0.25',
      },
      {
        symbol: dsaAsset.vToken.underlyingToken.symbol,
        amountTokens: '0.125',
      },
      {
        symbol: longAsset.vToken.underlyingToken.symbol,
        amountTokens: '2',
      },
      {
        symbol: longAsset.vToken.underlyingToken.symbol,
        amountTokens: '-0.75',
      },
      {
        symbol: shortAsset.vToken.underlyingToken.symbol,
        amountTokens: '3',
      },
      {
        symbol: shortAsset.vToken.underlyingToken.symbol,
        amountTokens: '-0.5',
      },
    ]);
  });

  it('uses a default cycle ID and skips amount fields without an asset mapping', () => {
    const transaction = formatToTradeTransaction({
      vTokenAssetMapping: {
        [dsaAsset.vToken.address.toLowerCase() as Address]:
          vTokenAssetMapping[dsaAsset.vToken.address.toLowerCase() as Address],
      },
      apiTransaction: fakeApiTradeTransaction,
      txType: 'positionOpened',
    });

    expect(transaction.cycleId).toBe('1');
    expect(
      transaction.amounts?.map(amount => ({
        symbol: amount.token.symbol,
        amountTokens: amount.amountTokens.toString(),
      })),
    ).toEqual([
      {
        symbol: dsaAsset.vToken.underlyingToken.symbol,
        amountTokens: '1',
      },
      {
        symbol: dsaAsset.vToken.underlyingToken.symbol,
        amountTokens: '-0.25',
      },
      {
        symbol: dsaAsset.vToken.underlyingToken.symbol,
        amountTokens: '0.125',
      },
    ]);
  });

  it('ignores zero amount fields', () => {
    const transaction = formatToTradeTransaction({
      vTokenAssetMapping,
      apiTransaction: {
        ...fakeApiTradeTransaction,
        yieldPlusPrincipalAmountMantissa: '0',
        yieldPlusShortAmountMantissa: '0',
        yieldPlusLongAmountMantissa: '0',
        yieldPlusAmountRepaidMantissa: '0',
        yieldPlusAmountRedeemedMantissa: '0',
        yieldPlusAmountRedeemedDsaMantissa: '0',
        yieldPlusDsaProfitAmountMantissa: '0',
      },
      txType: 'positionOpened',
    });

    expect(transaction.amounts).toEqual([]);
  });

  it('calculates amount cents from the mapped asset price', () => {
    const transaction = formatToTradeTransaction({
      vTokenAssetMapping,
      apiTransaction: {
        ...fakeApiTradeTransaction,
        yieldPlusShortAmountMantissa: null,
        yieldPlusLongAmountMantissa: null,
        yieldPlusAmountRepaidMantissa: null,
        yieldPlusAmountRedeemedMantissa: null,
        yieldPlusAmountRedeemedDsaMantissa: null,
        yieldPlusDsaProfitAmountMantissa: null,
      },
      txType: 'principalSupplied',
    });

    expect(transaction.amounts?.[0].amountCents).toBe(
      new BigNumber(1).multipliedBy(dsaAsset.tokenPriceCents).toNumber(),
    );
  });
});
