import { ChainId } from '@venusprotocol/chains';
import fakeAddress from '__mocks__/models/address';
import { isolatedPool, legacyCorePool } from '__mocks__/models/pools';
import { logError } from 'libs/errors';
import { restService } from 'utilities';
import type { Address } from 'viem';
import type { Mock } from 'vitest';

import {
  type ApiYieldPlusPosition,
  type GetYieldPlusPositionsInput,
  getYieldPlusPositions,
} from '..';
import {
  fakeLegacyPoolComptrollerContractAddress,
  fakePublicClient,
  fakeVenusLensContractAddress,
} from '../../useGetPools/__testUtils__/fakeData';
import { getPools } from '../../useGetPools/getPools';

vi.mock('utilities', async () => {
  const actual = (await vi.importActual('utilities')) as typeof import('utilities');

  return {
    ...actual,
    restService: vi.fn(),
  };
});

vi.mock('libs/errors', async () => {
  const actual = (await vi.importActual('libs/errors')) as typeof import('libs/errors');

  return {
    ...actual,
    logError: vi.fn(),
  };
});

vi.mock('../../useGetPools/getPools', () => ({
  getPools: vi.fn(),
}));

const makeAddress = (suffix: string) => `0x${suffix.padStart(40, '0')}` as Address;
const fakeAccountAddress = fakeAddress as Address;

const fakeInput: GetYieldPlusPositionsInput = {
  publicClient: fakePublicClient,
  accountAddress: fakeAccountAddress,
  chainId: ChainId.BSC_TESTNET,
  legacyPoolComptrollerContractAddress: fakeLegacyPoolComptrollerContractAddress,
  venusLensContractAddress: fakeVenusLensContractAddress,
  tokens: [],
};

describe('getYieldPlusPositions', () => {
  it('returns Yield+ positions formatted', async () => {
    const apiPositions: ApiYieldPlusPosition[] = [
      {
        pnl: {
          realizedPnlShortAssetMantissa: '0',
          realizedPnlUsd: '0',
          unrealizedPnlShortAssetMantissa: '0',
          unrealizedPnlUsd: '12.34',
          unrealizedPnlPercentage: '5.67',
          entryRatio: '1',
          currentRatio: '1.1',
          closeEventsWithPnlData: [],
        },
        positionAccountAddress: makeAddress('11'),
        accountAddress: fakeAccountAddress,
        longVTokenAddress: makeAddress('12'),
        shortVTokenAddress: makeAddress('13'),
        chainId: String(ChainId.BSC_TESTNET),
        isActive: true,
        cycleId: '1',
        dsaVTokenAddress: makeAddress('14'),
        effectiveLeverageRatio: '2.75',
        suppliedPrincipalMantissa: null,
      },
      {
        pnl: null,
        positionAccountAddress: makeAddress('21'),
        accountAddress: fakeAccountAddress,
        longVTokenAddress: makeAddress('22'),
        shortVTokenAddress: makeAddress('23'),
        chainId: String(ChainId.BSC_TESTNET),
        isActive: true,
        cycleId: '2',
        dsaVTokenAddress: makeAddress('24'),
        effectiveLeverageRatio: null,
        suppliedPrincipalMantissa: null,
      },
    ];

    (restService as Mock).mockResolvedValue({
      data: {
        count: apiPositions.length,
        positions: apiPositions,
      },
    });

    (getPools as Mock)
      .mockResolvedValueOnce({
        pools: [isolatedPool, legacyCorePool],
      })
      .mockResolvedValueOnce({
        pools: [legacyCorePool],
      });

    const response = await getYieldPlusPositions(fakeInput);

    expect(restService).toHaveBeenCalledWith({
      endpoint: `/account/${fakeAccountAddress}/yield-plus/positions?chainId=${ChainId.BSC_TESTNET}`,
      method: 'GET',
    });

    expect(getPools).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        publicClient: fakePublicClient,
        chainId: ChainId.BSC_TESTNET,
        accountAddress: apiPositions[0].positionAccountAddress,
        legacyPoolComptrollerContractAddress: fakeLegacyPoolComptrollerContractAddress,
        venusLensContractAddress: fakeVenusLensContractAddress,
        tokens: [],
        isEModeFeatureEnabled: false,
      }),
    );
    expect(getPools).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        publicClient: fakePublicClient,
        chainId: ChainId.BSC_TESTNET,
        accountAddress: apiPositions[1].positionAccountAddress,
        legacyPoolComptrollerContractAddress: fakeLegacyPoolComptrollerContractAddress,
        venusLensContractAddress: fakeVenusLensContractAddress,
        tokens: [],
        isEModeFeatureEnabled: false,
      }),
    );

    expect(response).toMatchSnapshot();
  });

  it('skips positions when fetching pools fails', async () => {
    const apiPosition: ApiYieldPlusPosition = {
      pnl: null,
      positionAccountAddress: makeAddress('31'),
      accountAddress: fakeAccountAddress,
      longVTokenAddress: makeAddress('32'),
      shortVTokenAddress: makeAddress('33'),
      chainId: String(ChainId.BSC_TESTNET),
      isActive: true,
      cycleId: '3',
      dsaVTokenAddress: makeAddress('34'),
      effectiveLeverageRatio: null,
      suppliedPrincipalMantissa: null,
    };

    (restService as Mock).mockResolvedValue({
      data: {
        count: 1,
        positions: [apiPosition],
      },
    });
    (getPools as Mock).mockRejectedValueOnce(new Error('Could not fetch pools'));

    const response = await getYieldPlusPositions(fakeInput);

    expect(response).toMatchSnapshot();

    expect(logError).toHaveBeenCalledWith(
      `Could not fetch pools for Yield+ position account with address: ${apiPosition.positionAccountAddress}`,
    );
  });

  it('throws on error in payload', async () => {
    (restService as Mock).mockResolvedValue({ data: { error: 'Some error' } });

    await expect(getYieldPlusPositions(fakeInput)).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });

  it('throws on undefined payload', async () => {
    (restService as Mock).mockResolvedValue({ data: undefined });

    await expect(getYieldPlusPositions(fakeInput)).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });
});
