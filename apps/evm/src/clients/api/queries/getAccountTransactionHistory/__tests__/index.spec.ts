import { ChainId } from '@venusprotocol/chains';
import fakeAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import { TX_TYPES } from 'constants/marketTxTypes';
import { restService } from 'utilities';
import type { Address } from 'viem';
import { type Mock, vi } from 'vitest';
import {
  type ApiAccountHistoricalTransaction,
  TX_TYPE_TO_API_FILTER,
  getAccountTransactionHistory,
} from '..';
import { convertToTxType } from '../formatApiTransaction/convertToTxType';

vi.mock('utilities/restService');

const fakeInput = {
  accountAddress: fakeAddress,
  chainId: ChainId.BSC_TESTNET,
  pools: poolData,
  liquidityHubs,
  contractAddress: undefined,
  types: TX_TYPES,
  page: 1,
};

const fakeYieldPlusFields: Pick<
  ApiAccountHistoricalTransaction,
  | 'yieldPlusPositionAccountAddress'
  | 'yieldPlusLongVTokenAddress'
  | 'yieldPlusShortVTokenAddress'
  | 'yieldPlusDsaVTokenAddress'
  | 'yieldPlusCycleId'
  | 'yieldPlusEffectiveLeverageRatio'
  | 'yieldPlusInitialPrincipalMantissa'
  | 'yieldPlusPrincipalAmountMantissa'
  | 'yieldPlusNewTotalPrincipalMantissa'
  | 'yieldPlusRemainingPrincipalMantissa'
  | 'yieldPlusShortAmountMantissa'
  | 'yieldPlusLongAmountMantissa'
  | 'yieldPlusAdditionalPrincipalMantissa'
  | 'yieldPlusCloseFractionBps'
  | 'yieldPlusAmountRepaidMantissa'
  | 'yieldPlusAmountRedeemedMantissa'
  | 'yieldPlusAmountRedeemedDsaMantissa'
  | 'yieldPlusLongDustRedeemedMantissa'
  | 'yieldPlusAmountConvertedToProfitMantissa'
  | 'yieldPlusDsaProfitAmountMantissa'
> = {
  yieldPlusPositionAccountAddress: null,
  yieldPlusLongVTokenAddress: null,
  yieldPlusShortVTokenAddress: null,
  yieldPlusDsaVTokenAddress: null,
  yieldPlusCycleId: null,
  yieldPlusEffectiveLeverageRatio: null,
  yieldPlusInitialPrincipalMantissa: null,
  yieldPlusPrincipalAmountMantissa: null,
  yieldPlusNewTotalPrincipalMantissa: null,
  yieldPlusRemainingPrincipalMantissa: null,
  yieldPlusShortAmountMantissa: null,
  yieldPlusLongAmountMantissa: null,
  yieldPlusAdditionalPrincipalMantissa: null,
  yieldPlusCloseFractionBps: null,
  yieldPlusAmountRepaidMantissa: null,
  yieldPlusAmountRedeemedMantissa: null,
  yieldPlusAmountRedeemedDsaMantissa: null,
  yieldPlusLongDustRedeemedMantissa: null,
  yieldPlusAmountConvertedToProfitMantissa: null,
  yieldPlusDsaProfitAmountMantissa: null,
};

describe('getAccountTransactionHistory', () => {
  it('returns transactions formatted', async () => {
    (restService as Mock).mockImplementation(() => {
      const txs: ApiAccountHistoricalTransaction[] = [
        {
          id: 'da13a0f45b10dabd21b863b6b602c6d8776edd4c6b10fe65a0881d491f468f35-207-56',
          txHash: '0xda13a0f45b10dabd21b863b6b602c6d8776edd4c6b10fe65a0881d491f468f35',
          txIndex: 207,
          txTimestamp: new Date('2024-08-23T04:17:09.000Z'),
          blockNumber: '41604851',
          txType: 'redeem',
          accountAddress: fakeAddress,
          contractAddress: '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
          amountVTokenMantissa: '99319379197734',
          amountUnderlyingMantissa: '24066181578079398612862',
          chainId: ChainId.BSC_TESTNET,
          underlyingAddress: '0xa11c8d9dc9b66e209ef60f0c8d969d3Cd988782c',
          underlyingTokenPriceMantissa: '1000130000000000000',
          migrationVTokenAddress: null,
          migrationVTokenAmountMantissa: null,
          ...fakeYieldPlusFields,
        },
        {
          id: 'b0435b135762a7ca2ad7dccb9aa6c7f50237c6139b16a76348d6c64dfece110e-119-56',
          txHash: '0xb0435b135762a7ca2ad7dccb9aa6c7f50237c6139b16a76348d6c64dfece110e',
          txIndex: 119,
          txTimestamp: new Date('2024-08-06T02:18:03.000Z'),
          blockNumber: '41114058',
          txType: 'mint',
          accountAddress: fakeAddress,
          contractAddress: '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
          amountVTokenMantissa: '99319377752025',
          amountUnderlyingMantissa: '24001813290985731455439',
          chainId: ChainId.BSC_TESTNET,
          underlyingAddress: '0xa11c8d9dc9b66e209ef60f0c8d969d3Cd988782c',
          underlyingTokenPriceMantissa: '1000391740000000000',
          migrationVTokenAddress: null,
          migrationVTokenAmountMantissa: null,
          ...fakeYieldPlusFields,
        },
      ];

      return {
        data: {
          count: '2',
          results: txs,
        },
      };
    });

    const response = await getAccountTransactionHistory(fakeInput);
    expect(response).toMatchSnapshot();
  });

  it.each([
    ['supply', 0],
    ['borrow', 1],
    ['withdraw', 2],
    ['repay', 3],
    ['enterMarket', 4],
    ['exitMarket', 5],
    ['principalSupplied', 9],
    ['principalWithdrawn', 10],
    ['positionIncreased', 15],
    ['positionOpened', 16],
    ['positionReducedWithProfit', 18],
    ['positionReducedWithLoss', 19],
    ['positionClosedWithProfit', 20],
    ['positionClosedWithLoss', 21],
    ['profitConverted', 13],
    ['hubSupply', 39],
    ['hubWithdraw', 40],
    ['hubSupplyFromCollateral', 41],
  ] as const)('sends %s as API filter %i', async (type, apiType) => {
    (restService as Mock).mockResolvedValue({
      data: {
        count: '0',
        results: [],
      },
    });

    await getAccountTransactionHistory({
      ...fakeInput,
      types: [type],
    });

    expect(restService).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          types: [apiType],
        }),
      }),
    );
  });

  it('sends all supported frontend transaction types as API filters', async () => {
    (restService as Mock).mockResolvedValue({
      data: {
        count: '0',
        results: [],
      },
    });

    await getAccountTransactionHistory(fakeInput);

    expect(restService).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          types: TX_TYPES.map(type => TX_TYPE_TO_API_FILTER[type]),
        }),
      }),
    );
  });

  it('formats trade and market transactions together', async () => {
    (restService as Mock).mockResolvedValue({
      data: {
        count: '2',
        results: [
          {
            id: 'position-opened',
            txHash: '0x1',
            txIndex: 1,
            txTimestamp: new Date('2024-08-23T04:17:09.000Z'),
            blockNumber: '41604851',
            txType: 'position_opened_with_principal',
            accountAddress: fakeAddress,
            contractAddress: '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
            amountVTokenMantissa: null,
            amountUnderlyingMantissa: null,
            chainId: ChainId.BSC_TESTNET,
            underlyingAddress: '0xa11c8d9dc9b66e209ef60f0c8d969d3Cd988782c',
            underlyingTokenPriceMantissa: null,
            migrationVTokenAddress: null,
            migrationVTokenAmountMantissa: null,
            ...fakeYieldPlusFields,
          },
          {
            id: 'borrow',
            txHash: '0x2',
            txIndex: 2,
            txTimestamp: new Date('2024-08-24T04:17:09.000Z'),
            blockNumber: '41604852',
            txType: 'borrow',
            accountAddress: fakeAddress,
            contractAddress: '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
            amountVTokenMantissa: null,
            amountUnderlyingMantissa: '24066181578079398612862',
            chainId: ChainId.BSC_TESTNET,
            underlyingAddress: '0xa11c8d9dc9b66e209ef60f0c8d969d3Cd988782c',
            underlyingTokenPriceMantissa: '1000130000000000000',
            migrationVTokenAddress: null,
            migrationVTokenAmountMantissa: null,
            ...fakeYieldPlusFields,
          },
        ] satisfies ApiAccountHistoricalTransaction[],
      },
    });

    const response = await getAccountTransactionHistory(fakeInput);

    expect(response.transactions).toHaveLength(2);
    expect(response.transactions.map(transaction => transaction.txType)).toEqual([
      'positionOpened',
      'borrow',
    ]);
  });

  it('formats Liquidity Hub supply, withdrawal and migration transactions', async () => {
    const [liquidityHub] = liquidityHubs;
    const commonTransactionFields = {
      accountAddress: fakeAddress as Address,
      amountUnderlyingMantissa: '1000000000000000000',
      amountVTokenMantissa: '1000000000000000000',
      blockNumber: '41604853',
      chainId: ChainId.BSC_TESTNET,
      contractAddress: liquidityHub.vhToken.address,
      underlyingAddress: liquidityHub.vhToken.underlyingToken.address,
      underlyingTokenPriceMantissa: '7000000000000000000',
      migrationVTokenAddress: null,
      migrationVTokenAmountMantissa: null,
      ...fakeYieldPlusFields,
    };

    (restService as Mock).mockResolvedValue({
      data: {
        count: '3',
        results: [
          {
            ...commonTransactionFields,
            id: 'liquidity-hub-supply',
            txHash: '0x3',
            txIndex: 3,
            txTimestamp: new Date('2024-08-25T04:17:09.000Z'),
            txType: 'hub_supply',
          },
          {
            ...commonTransactionFields,
            id: 'liquidity-hub-withdraw',
            txHash: '0x4',
            txIndex: 4,
            txTimestamp: new Date('2024-08-26T04:17:09.000Z'),
            txType: 'hub_withdraw',
          },
          {
            ...commonTransactionFields,
            id: 'liquidity-hub-migration',
            txHash: '0x5',
            txIndex: 5,
            txTimestamp: new Date('2024-08-27T04:17:09.000Z'),
            txType: 'hub_migration',
          },
        ] satisfies ApiAccountHistoricalTransaction[],
      },
    });

    const response = await getAccountTransactionHistory(fakeInput);

    expect(response.transactions).toHaveLength(3);
    expect(response.transactions).toEqual([
      expect.objectContaining({
        txType: 'hubSupply',
        vhToken: liquidityHub.vhToken,
      }),
      expect.objectContaining({
        txType: 'hubWithdraw',
        vhToken: liquidityHub.vhToken,
      }),
      expect.objectContaining({
        txType: 'hubSupplyFromCollateral',
        vhToken: liquidityHub.vhToken,
      }),
    ]);

    response.transactions.slice(0, 2).forEach(transaction => {
      expect(transaction.amounts?.[0]?.amountTokens.isEqualTo(1)).toBe(true);
      expect(transaction.amounts?.[0]?.amountCents).toBe(700);
    });

    const migrationTransaction = response.transactions[2];
    expect(migrationTransaction.amounts).toHaveLength(2);
    expect(migrationTransaction.amounts?.[0]?.amountTokens.isEqualTo(-1)).toBe(true);
    expect(migrationTransaction.amounts?.[0]?.amountCents).toBe(-700);
    expect(migrationTransaction.amounts?.[1]?.amountTokens.isEqualTo(1)).toBe(true);
    expect(migrationTransaction.amounts?.[1]?.amountCents).toBe(700);
  });

  it('filters Liquidity Hub transactions with unavailable amounts', async () => {
    const [liquidityHub] = liquidityHubs;
    const commonTransactionFields = {
      accountAddress: fakeAddress as Address,
      amountVTokenMantissa: '1000000000000000000',
      blockNumber: '41604853',
      chainId: ChainId.BSC_TESTNET,
      contractAddress: liquidityHub.vhToken.address,
      migrationVTokenAddress: null,
      migrationVTokenAmountMantissa: null,
      txType: 'hub_supply' as const,
      underlyingAddress: liquidityHub.vhToken.underlyingToken.address,
      ...fakeYieldPlusFields,
    };

    (restService as Mock).mockResolvedValue({
      data: {
        count: '2',
        results: [
          {
            ...commonTransactionFields,
            amountUnderlyingMantissa: null,
            id: 'liquidity-hub-supply-missing-amount',
            txHash: '0x6',
            txIndex: 6,
            txTimestamp: new Date('2024-08-28T04:17:09.000Z'),
            underlyingTokenPriceMantissa: '7000000000000000000',
          },
          {
            ...commonTransactionFields,
            amountUnderlyingMantissa: '1000000000000000000',
            id: 'liquidity-hub-supply-missing-price',
            txHash: '0x7',
            txIndex: 7,
            txTimestamp: new Date('2024-08-29T04:17:09.000Z'),
            underlyingTokenPriceMantissa: null,
          },
        ] satisfies ApiAccountHistoricalTransaction[],
      },
    });

    const response = await getAccountTransactionHistory(fakeInput);

    expect(response.transactions).toHaveLength(0);
  });

  it('throws on error in payload', async () => {
    (restService as Mock).mockResolvedValue({ data: { error: 'Some error' } });

    await expect(getAccountTransactionHistory(fakeInput)).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });

  it('throws on undefined payload', async () => {
    (restService as Mock).mockResolvedValue({ data: undefined });

    await expect(getAccountTransactionHistory(fakeInput)).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });
});

describe('convertToTxType', () => {
  it.each([
    ['mint', 'supply'],
    ['borrow', 'borrow'],
    ['redeem', 'withdraw'],
    ['repay', 'repay'],
    ['enter_market', 'enterMarket'],
    ['exit_market', 'exitMarket'],
    ['principal_supplied', 'principalSupplied'],
    ['principal_withdrawn', 'principalWithdrawn'],
    ['position_opened_with_principal', 'positionOpened'],
    ['position_closed_with_profit_and_deactivated', 'positionClosedWithProfit'],
    ['position_closed_with_loss_and_deactivated', 'positionClosedWithLoss'],
    ['position_closed_with_profit', 'positionReducedWithProfit'],
    ['position_closed_with_loss', 'positionReducedWithLoss'],
    ['position_scaled', 'positionIncreased'],
    ['profit_converted', 'profitConverted'],
    ['hub_supply', 'hubSupply'],
    ['hub_withdraw', 'hubWithdraw'],
    ['hub_migration', 'hubSupplyFromCollateral'],
  ] as const)('converts %s to %s', (apiTxType, txType) => {
    expect(convertToTxType(apiTxType)).toBe(txType);
  });
});
