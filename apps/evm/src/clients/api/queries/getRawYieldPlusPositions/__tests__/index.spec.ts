import type { PublicClient } from 'viem';
import type { Mock } from 'vitest';

import fakeAddress, { altAddress } from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import tokens from '__mocks__/models/tokens';
import { apiYieldPlusPositions, yieldPlusPositions } from '__mocks__/models/yieldPlus';
import { logError } from 'libs/errors';
import { ChainId } from 'types';
import { restService } from 'utilities';
import { type GetRawYieldPlusPositionsInput, getRawYieldPlusPositions } from '..';
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

const fakeInput: GetRawYieldPlusPositionsInput = {
  publicClient: {} as PublicClient,
  accountAddress: fakeAddress,
  chainId: ChainId.BSC_TESTNET,
  legacyPoolComptrollerContractAddress: poolData[0].comptrollerAddress,
  venusLensContractAddress: altAddress,
  tokens,
};

describe('getRawYieldPlusPositions', () => {
  beforeEach(() => {
    (restService as Mock).mockResolvedValue({
      data: {
        count: 2,
        positions: apiYieldPlusPositions.slice(0, 2),
      },
    });

    (getPools as Mock).mockResolvedValue({
      pools: poolData,
    });
  });

  it('calls the correct endpoint', async () => {
    await getRawYieldPlusPositions(fakeInput);

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

    await expect(getRawYieldPlusPositions(fakeInput)).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });

  it('throws when the API payload is undefined', async () => {
    (restService as Mock).mockResolvedValue({
      data: undefined,
    });

    await expect(getRawYieldPlusPositions(fakeInput)).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });

  it('passes each position account to getPools with the expected input', async () => {
    await getRawYieldPlusPositions(fakeInput);

    expect(getPools).toHaveBeenCalledTimes(2);
    expect(getPools).toHaveBeenNthCalledWith(1, {
      publicClient: fakeInput.publicClient,
      chainId: fakeInput.chainId,
      accountAddress: apiYieldPlusPositions[0].positionAccountAddress,
      legacyPoolComptrollerContractAddress: fakeInput.legacyPoolComptrollerContractAddress,
      venusLensContractAddress: fakeInput.venusLensContractAddress,
      tokens: fakeInput.tokens,
      isEModeFeatureEnabled: false,
    });
    expect(getPools).toHaveBeenNthCalledWith(2, {
      publicClient: fakeInput.publicClient,
      chainId: fakeInput.chainId,
      accountAddress: apiYieldPlusPositions[1].positionAccountAddress,
      legacyPoolComptrollerContractAddress: fakeInput.legacyPoolComptrollerContractAddress,
      venusLensContractAddress: fakeInput.venusLensContractAddress,
      tokens: fakeInput.tokens,
      isEModeFeatureEnabled: false,
    });
  });

  it('returns positions in the correct format on success', async () => {
    const response = await getRawYieldPlusPositions(fakeInput);

    expect(response).toEqual({
      positions: yieldPlusPositions.slice(0, 2),
    });
  });

  it('defaults nullable API fields to zero', async () => {
    (restService as Mock).mockResolvedValue({
      data: {
        count: 1,
        positions: [
          {
            ...apiYieldPlusPositions[0],
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

    const response = await getRawYieldPlusPositions(fakeInput);
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
        positions: apiYieldPlusPositions.slice(0, 2),
      },
    });

    (getPools as Mock)
      .mockResolvedValueOnce({
        pools: poolData,
      })
      .mockRejectedValueOnce(new Error('pool query failed'));

    const response = await getRawYieldPlusPositions(fakeInput);

    expect(response).toEqual({
      positions: [yieldPlusPositions[0]],
    });
    expect(logError).toHaveBeenCalledTimes(1);
    expect(logError).toHaveBeenCalledWith(
      `Could not fetch pools for Yield+ position account with address: ${apiYieldPlusPositions[1].positionAccountAddress}`,
    );
  });
});
