import { ChainId } from '@venusprotocol/chains';
import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { restService } from 'utilities';
import { type Mock, vi } from 'vitest';
import { type ApiAccountHistoricalTransaction, TxType, getAccountTransactionHistory } from '..';

vi.mock('utilities/restService');

const fakeInput = {
  accountAddress: fakeAddress,
  chainId: ChainId.BSC_TESTNET,
  getPoolsData: { pools: poolData },
  contractAddress: 'all',
  page: 1,
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
          txType: TxType.Redeem,
          accountAddress: fakeAddress,
          contractAddress: '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
          amountVTokenMantissa: '99319379197734',
          amountUnderlyingMantissa: '24066181578079398612862',
          chainId: ChainId.BSC_TESTNET,
          underlyingAddress: '0xa11c8d9dc9b66e209ef60f0c8d969d3Cd988782c',
          underlyingTokenPriceMantissa: '1000130000000000000',
        },
        {
          id: 'b0435b135762a7ca2ad7dccb9aa6c7f50237c6139b16a76348d6c64dfece110e-119-56',
          txHash: '0xb0435b135762a7ca2ad7dccb9aa6c7f50237c6139b16a76348d6c64dfece110e',
          txIndex: 119,
          txTimestamp: new Date('2024-08-06T02:18:03.000Z'),
          blockNumber: '41114058',
          txType: TxType.Mint,
          accountAddress: fakeAddress,
          contractAddress: '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
          amountVTokenMantissa: '99319377752025',
          amountUnderlyingMantissa: '24001813290985731455439',
          chainId: ChainId.BSC_TESTNET,
          underlyingAddress: '0xa11c8d9dc9b66e209ef60f0c8d969d3Cd988782c',
          underlyingTokenPriceMantissa: '1000391740000000000',
        },
      ];

      return {
        data: {
        count: '2',
        results: txs,
      }};
    });

    const response = await getAccountTransactionHistory(fakeInput);
    expect(response).toMatchSnapshot();
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
