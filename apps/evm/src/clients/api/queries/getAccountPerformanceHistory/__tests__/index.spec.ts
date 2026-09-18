import { ChainId } from '@venusprotocol/chains';
import fakeAddress from '__mocks__/models/address';
import { restService } from 'utilities';
import { type Mock, vi } from 'vitest';
import { type ApiAccountPerformanceHistoryDataPoint, getAccountPerformanceHistory } from '..';

vi.mock('utilities/restService');

const fakeInput = {
  accountAddress: fakeAddress,
  chainId: ChainId.BSC_TESTNET,
  period: 'month' as const,
};

describe('getAccountPerformanceHistory', () => {
  it('returns correct sum for multiple destinationAmounts', async () => {
    (restService as Mock).mockImplementation(({ endpoint }: { endpoint: string }) => {
      const splitEndpoint = endpoint.split('/');
      const endpointType = splitEndpoint[splitEndpoint.length - 1];

      if (endpointType === 'performance') {
        const performanceDataPoints: ApiAccountPerformanceHistoryDataPoint[] = [
          {
            blockNumber: 1,
            blockTimestampMs: 1714828100000,
            netWorthCents: '10000',
          },
          {
            blockNumber: 3,
            blockTimestampMs: 1714828200000,
            netWorthCents: '11000',
          },
          {
            blockNumber: 5,
            blockTimestampMs: 1714828300000,
            netWorthCents: '9000',
          },
          {
            blockNumber: 7,
            blockTimestampMs: 1714828400000,
            netWorthCents: '8000',
          },
          {
            blockNumber: 9,
            blockTimestampMs: 1714828500000,
            netWorthCents: '20000',
          },
        ];

        return {
          data: {
            performanceDataPoints,
          },
        };
      }

      if (endpointType === 'net-worth') {
        const performanceDataPoints: ApiAccountPerformanceHistoryDataPoint[] = [
          {
            blockNumber: 6,
            blockTimestampMs: 1714828450000,
            netWorthCents: '8500',
          },
          {
            blockNumber: 10,
            blockTimestampMs: 1714828700000,
            netWorthCents: '21000',
          },
        ];

        return {
          data: {
            performanceDataPoints,
          },
        };
      }
    });

    const response = await getAccountPerformanceHistory(fakeInput);
    expect(response).toMatchSnapshot();
  });

  it('does not add an undefined data point when the net-worth endpoint omits the current point', async () => {
    (restService as Mock).mockImplementation(({ endpoint }: { endpoint: string }) => {
      const splitEndpoint = endpoint.split('/');
      const endpointType = splitEndpoint[splitEndpoint.length - 1];

      if (endpointType === 'performance') {
        return {
          data: {
            performanceDataPoints: [
              {
                blockNumber: 1,
                blockTimestampMs: 1714828100000,
                netWorthCents: '10000',
              },
            ] satisfies ApiAccountPerformanceHistoryDataPoint[],
          },
        };
      }

      return {
        data: {
          performanceDataPoints: [
            {
              blockNumber: 6,
              blockTimestampMs: 1714828450000,
              netWorthCents: '8500',
            },
          ] satisfies ApiAccountPerformanceHistoryDataPoint[],
        },
      };
    });

    const response = await getAccountPerformanceHistory(fakeInput);

    expect(response.performanceHistory).toHaveLength(1);
    expect(response.performanceHistory.every(dataPoint => !!dataPoint)).toBe(true);
    expect(response.startOfDayNetWorthCents).toBe(8500);
  });

  it('returns an undefined start of day net worth when the net-worth endpoint returns no point', async () => {
    (restService as Mock).mockResolvedValue({ data: { performanceDataPoints: [] } });

    const response = await getAccountPerformanceHistory(fakeInput);

    expect(response.performanceHistory).toEqual([]);
    expect(response.startOfDayNetWorthCents).toBeUndefined();
  });

  it('throws on error in payload', async () => {
    (restService as Mock).mockResolvedValue({ data: { error: 'Some error' } });

    await expect(getAccountPerformanceHistory(fakeInput)).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });

  it('throws on undefined payload', async () => {
    (restService as Mock).mockResolvedValue({ data: undefined });

    await expect(getAccountPerformanceHistory(fakeInput)).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });
});
