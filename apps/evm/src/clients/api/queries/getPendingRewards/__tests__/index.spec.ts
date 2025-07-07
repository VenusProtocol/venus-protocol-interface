import fakeAddress from '__mocks__/models/address';
import tokens from '__mocks__/models/tokens';
import { ChainId } from 'types';
import { type RestServiceInput, restService } from 'utilities';
import type { Address, PublicClient } from 'viem';
import type { Mock } from 'vitest';
import { getPendingRewards } from '..';
import {
  fakeGetIsolatedPoolPendingRewardsOutput,
  fakeGetLegacyPoolPendingRewardsOutput,
  fakeGetPendingXvsOutput,
  fakeGetPrimePendingRewardsOutput,
  fakeGetVaultPaused,
  fakeGetXvsVaultPendingRewardOutput,
  fakeGetXvsVaultPendingWithdrawalsBeforeUpgradeOutput,
  fakeGetXvsVaultPoolInfosOutput,
  fakeMerklCampaigns,
  fakeMerklRewardsResponse,
} from '../__testUtils__/fakeData';
import { BASE_MERKL_API_URL } from '../getMerklUserRewards';

vi.mock('utilities/restService');

const fakeLegacyPoolComptrollerAddress = '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D' as const;
const fakeIsolatedPoolComptrollerAddress = '0x1291820b2D1c7c7452A163983Dc888CEC546b78k' as const;
const fakePoolLensContractAddress = '0xPoolLens' as const;
const fakeVenusLensContractAddress = '0xVenusLens' as const;
const fakeVaiVaultContractAddress = '0xVaiVault' as const;
const fakeXvsVaultContractAddress = '0xXvsVault' as const;
const fakePrimeContractAddress = '0xPrime' as const;

type ReadContractParams = {
  abi: any;
  address: Address;
  functionName: string;
  args?: any[];
};

type SimulateContractParams = {
  abi: any;
  address: Address;
  functionName: string;
  args?: any[];
};

const fakePublicClient = {
  readContract: vi.fn(({ address, functionName }: ReadContractParams) => {
    if (address === fakeVaiVaultContractAddress) {
      if (functionName === 'pendingXVS') {
        return fakeGetPendingXvsOutput;
      }
      if (functionName === 'vaultPaused') {
        return fakeGetVaultPaused;
      }
    }

    if (address === fakeVenusLensContractAddress && functionName === 'pendingRewards') {
      return fakeGetLegacyPoolPendingRewardsOutput;
    }

    if (address === fakePoolLensContractAddress && functionName === 'getPendingRewards') {
      return fakeGetIsolatedPoolPendingRewardsOutput;
    }

    if (address === fakeXvsVaultContractAddress && functionName === 'poolInfos') {
      return fakeGetXvsVaultPoolInfosOutput;
    }

    if (address === fakeXvsVaultContractAddress && functionName === 'vaultPaused') {
      return fakeGetVaultPaused;
    }

    if (address === fakeXvsVaultContractAddress && functionName === 'pendingReward') {
      return fakeGetXvsVaultPendingRewardOutput;
    }

    if (
      address === fakeXvsVaultContractAddress &&
      functionName === 'pendingWithdrawalsBeforeUpgrade'
    ) {
      return fakeGetXvsVaultPendingWithdrawalsBeforeUpgradeOutput;
    }

    if (address === fakePrimeContractAddress && functionName === 'paused') {
      return false;
    }
  }),
  simulateContract: ({ address, functionName }: SimulateContractParams) => {
    if (address === fakePrimeContractAddress && functionName === 'getPendingRewards') {
      return { result: fakeGetPrimePendingRewardsOutput };
    }
  },
} as unknown as PublicClient;

const fakeTokenPriceMapping = tokens.map(token => ({
  address: token.address,
  tokenPrices: [
    {
      priceMantissa: '3528531320000000000',
    },
  ],
}));

describe('getPendingRewards', () => {
  beforeEach(() => {
    (restService as Mock).mockImplementation(async () => ({
      data: {
        result: fakeTokenPriceMapping,
      },
    }));
  });

  it('returns pool rewards of the user in the correct format on success', async () => {
    const res = await getPendingRewards({
      legacyPoolComptrollerContractAddress: fakeLegacyPoolComptrollerAddress,
      isolatedPoolComptrollerAddresses: [fakeIsolatedPoolComptrollerAddress],
      tokens,
      xvsVestingVaultPoolCount: 1,
      accountAddress: fakeAddress,
      publicClient: fakePublicClient,
      venusLensContractAddress: fakeVenusLensContractAddress,
      poolLensContractAddress: fakePoolLensContractAddress,
      vaiVaultContractAddress: fakeVaiVaultContractAddress,
      xvsVaultContractAddress: fakeXvsVaultContractAddress,
      chainId: ChainId.BSC_TESTNET,
      merklCampaigns: {},
    });

    expect(res).toMatchSnapshot();
  });

  it('returns pool rewards of the user, including Prime rewards, in the correct format on success', async () => {
    const res = await getPendingRewards({
      legacyPoolComptrollerContractAddress: fakeLegacyPoolComptrollerAddress,
      isolatedPoolComptrollerAddresses: [fakeIsolatedPoolComptrollerAddress],
      tokens,
      xvsVestingVaultPoolCount: 1,
      accountAddress: fakeAddress,
      publicClient: fakePublicClient,
      venusLensContractAddress: fakeVenusLensContractAddress,
      poolLensContractAddress: fakePoolLensContractAddress,
      vaiVaultContractAddress: fakeVaiVaultContractAddress,
      xvsVaultContractAddress: fakeXvsVaultContractAddress,
      primeContractAddress: fakePrimeContractAddress,
      chainId: ChainId.BSC_TESTNET,
      merklCampaigns: {},
    });

    expect(res).toMatchSnapshot();
  });

  it('returns pool rewards of the user, including Merkl rewards, in the correct format on success', async () => {
    (restService as Mock).mockImplementation(async (input: RestServiceInput) => ({
      data:
        input.baseUrl === BASE_MERKL_API_URL
          ? [fakeMerklRewardsResponse]
          : {
              result: fakeTokenPriceMapping,
            },
    }));

    const res = await getPendingRewards({
      legacyPoolComptrollerContractAddress: fakeLegacyPoolComptrollerAddress,
      isolatedPoolComptrollerAddresses: [fakeIsolatedPoolComptrollerAddress],
      tokens,
      xvsVestingVaultPoolCount: 1,
      accountAddress: fakeAddress,
      publicClient: fakePublicClient,
      venusLensContractAddress: fakeVenusLensContractAddress,
      poolLensContractAddress: fakePoolLensContractAddress,
      vaiVaultContractAddress: fakeVaiVaultContractAddress,
      xvsVaultContractAddress: fakeXvsVaultContractAddress,
      chainId: ChainId.BSC_TESTNET,
      merklCampaigns: fakeMerklCampaigns,
    });

    expect(restService).toHaveBeenCalledTimes(2); // Merkl rewards + token prices
    expect(restService).toHaveBeenCalledWith({
      baseUrl: BASE_MERKL_API_URL,
      endpoint: `users/${fakeAddress}/rewards`,
      method: 'GET',
      params: {
        chainId: ChainId.BSC_TESTNET,
      },
    });

    expect(res).toMatchSnapshot();
  });
});
