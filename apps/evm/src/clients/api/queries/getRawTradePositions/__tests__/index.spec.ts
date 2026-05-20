import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';
import type { Mock } from 'vitest';

import fakeAddress, { altAddress } from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import tokens from '__mocks__/models/tokens';
import { apiTradePositions } from '__mocks__/models/trade';
import { logError } from 'libs/errors';
import { ChainId } from 'types';
import { formatToTradePosition, restService } from 'utilities';
import { type GetRawTradePositionsInput, getRawTradePositions } from '..';
import { getPools } from '../../useGetPools/getPools';

vi.mock('utilities/restService');
vi.mock('../../useGetPools/getPools', () => ({
  getPools: vi.fn(),
}));
vi.mock('libs/errors', async () => {
  const actual = await vi.importActual<typeof import('libs/errors')>('libs/errors');

  return {
    ...actual,
    logError: vi.fn(),
  };
});

const fakeInput: GetRawTradePositionsInput = {
  publicClient: {} as PublicClient,
  accountAddress: fakeAddress,
  chainId: ChainId.BSC_TESTNET,
  legacyPoolComptrollerContractAddress: poolData[0].comptrollerAddress,
  venusLensContractAddress: altAddress,
  tokens,
};

const formatApiTradePosition = (apiTradePosition: (typeof apiTradePositions)[number]) =>
  formatToTradePosition({
    pool: poolData[0],
    chainId: fakeInput.chainId,
    positionAccountAddress: apiTradePosition.positionAccountAddress,
    dsaVTokenAddress: apiTradePosition.dsaVTokenAddress,
    dsaBalanceMantissa: new BigNumber(
      apiTradePosition.capitalUtilization.suppliedPrincipalMantissa || 0,
    ),
    dsaUtilizedBalanceMantissa: new BigNumber(
      apiTradePosition.capitalUtilization.capitalUtilizedMantissa || 0,
    ),
    longVTokenAddress: apiTradePosition.longVTokenAddress,
    shortVTokenAddress: apiTradePosition.shortVTokenAddress,
    leverageFactor: Number(apiTradePosition.effectiveLeverageRatio ?? 0),
    unrealizedPnlCents: Number(apiTradePosition.pnl?.unrealizedPnlUsd ?? 0) * 100,
    unrealizedPnlPercentage: Number(apiTradePosition.pnl?.unrealizedPnlRatio ?? 0) * 100,
  });

describe('getRawTradePositions', () => {
  beforeEach(() => {
    (restService as Mock).mockResolvedValue({
      data: {
        count: 2,
        positions: apiTradePositions.slice(0, 2),
      },
    });

    (getPools as Mock).mockResolvedValue({
      pools: poolData,
    });
  });

  it('calls the correct endpoint', async () => {
    await getRawTradePositions(fakeInput);

    expect(restService).toHaveBeenCalledTimes(1);
    expect(restService).toHaveBeenCalledWith({
      endpoint: `/account/${fakeInput.accountAddress}/yield-plus/positions?chainId=${fakeInput.chainId}&isActive=true`,
      method: 'GET',
    });
  });

  it('throws when the API payload contains an error', async () => {
    (restService as Mock).mockResolvedValue({
      data: { error: 'test error' },
    });

    await expect(getRawTradePositions(fakeInput)).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });

  it('throws when the API payload is undefined', async () => {
    (restService as Mock).mockResolvedValue({
      data: undefined,
    });

    await expect(getRawTradePositions(fakeInput)).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });

  it('passes each position account to getPools with the expected input', async () => {
    await getRawTradePositions(fakeInput);

    expect(getPools).toHaveBeenCalledTimes(2);
    expect(getPools).toHaveBeenNthCalledWith(1, {
      publicClient: fakeInput.publicClient,
      chainId: fakeInput.chainId,
      accountAddress: apiTradePositions[0].positionAccountAddress,
      legacyPoolComptrollerContractAddress: fakeInput.legacyPoolComptrollerContractAddress,
      venusLensContractAddress: fakeInput.venusLensContractAddress,
      tokens: fakeInput.tokens,
      isEModeFeatureEnabled: false,
    });
    expect(getPools).toHaveBeenNthCalledWith(2, {
      publicClient: fakeInput.publicClient,
      chainId: fakeInput.chainId,
      accountAddress: apiTradePositions[1].positionAccountAddress,
      legacyPoolComptrollerContractAddress: fakeInput.legacyPoolComptrollerContractAddress,
      venusLensContractAddress: fakeInput.venusLensContractAddress,
      tokens: fakeInput.tokens,
      isEModeFeatureEnabled: false,
    });
  });

  it('returns positions in the correct format on success', async () => {
    const response = await getRawTradePositions(fakeInput);

    const expectedPositions = apiTradePositions
      .slice(0, 2)
      .map(formatApiTradePosition)
      .filter(position => position !== undefined);

    expect(response).toEqual({
      positions: expectedPositions,
    });
  });

  it('defaults nullable API fields to zero', async () => {
    (restService as Mock).mockResolvedValue({
      data: {
        count: 1,
        positions: [
          {
            ...apiTradePositions[0],
            effectiveLeverageRatio: null,
            pnl: null,
            capitalUtilization: {
              suppliedPrincipalMantissa: '',
              capitalUtilizedMantissa: '0',
              withdrawableCapitalMantissa: '0',
            },
          },
        ],
      },
    });

    const response = await getRawTradePositions(fakeInput);
    const [position] = response.positions;

    expect(position.leverageFactor).toBe(0);
    expect(position.unrealizedPnlCents).toBe(0);
    expect(position.unrealizedPnlPercentage).toBe(0);
    expect(
      position.entryPriceTokens.isEqualTo(
        position.shortBalanceTokens.div(position.longBalanceTokens),
      ),
    ).toBe(true);
    expect(position.dsaBalanceTokens.isZero()).toBe(true);
  });

  it('skips positions whose pool query fails and logs the error', async () => {
    (restService as Mock).mockResolvedValue({
      data: {
        count: 2,
        positions: apiTradePositions.slice(0, 2),
      },
    });

    (getPools as Mock)
      .mockResolvedValueOnce({
        pools: poolData,
      })
      .mockRejectedValueOnce(new Error('pool query failed'));

    const response = await getRawTradePositions(fakeInput);

    expect(response).toEqual({
      positions: [formatApiTradePosition(apiTradePositions[0])],
    });
    expect(logError).toHaveBeenCalledTimes(1);
    expect(logError).toHaveBeenCalledWith(
      `Could not fetch pools for Trade position account with address: ${apiTradePositions[1].positionAccountAddress}`,
    );
  });
});
