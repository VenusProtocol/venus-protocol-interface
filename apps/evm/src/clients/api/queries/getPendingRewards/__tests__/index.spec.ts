import fakeAddress from '__mocks__/models/address';
import tokens from '__mocks__/models/tokens';

import type { PoolLens, Prime, VaiVault, VenusLens, XvsVault } from 'libs/contracts';

import { ChainId } from 'types';
import { restService } from 'utilities';
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
import { BASE_MERKL_API_URL } from '../getMerklRewards';

vi.mock('utilities/restService');

const fakeLegacyPoolComptrollerAddress = '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D';
const fakeIsolatedPoolComptrollerAddress = '0x1291820b2D1c7c7452A163983Dc888CEC546b78k';

vi.mock('clients/api/queries/getApiTokenPrice');

const fakePoolLensContract = {
  getPendingRewards: async () => fakeGetIsolatedPoolPendingRewardsOutput,
} as unknown as PoolLens;

const fakeVenusLensContract = {
  pendingRewards: async () => fakeGetLegacyPoolPendingRewardsOutput,
} as unknown as VenusLens;

const fakeVaiVaultContract = {
  pendingXVS: async () => fakeGetPendingXvsOutput,
  vaultPaused: async () => fakeGetVaultPaused,
} as unknown as VaiVault;

const fakeXvsVaultContract = {
  poolInfos: async () => fakeGetXvsVaultPoolInfosOutput,
  vaultPaused: async () => fakeGetVaultPaused,
  pendingReward: async () => fakeGetXvsVaultPendingRewardOutput,
  pendingWithdrawalsBeforeUpgrade: async () => fakeGetXvsVaultPendingWithdrawalsBeforeUpgradeOutput,
} as unknown as XvsVault;

const fakePrimeContract = {
  paused: async () => false,
  callStatic: {
    getPendingRewards: async () => fakeGetPrimePendingRewardsOutput,
  },
} as unknown as Prime;

describe('getPendingRewards', () => {
  it('returns pool rewards of the user in the correct format on success', async () => {
    const res = await getPendingRewards({
      legacyPoolComptrollerContractAddress: fakeLegacyPoolComptrollerAddress,
      isolatedPoolComptrollerAddresses: [fakeIsolatedPoolComptrollerAddress],
      tokens,
      xvsVestingVaultPoolCount: 1,
      accountAddress: fakeAddress,
      poolLensContract: fakePoolLensContract,
      venusLensContract: fakeVenusLensContract,
      vaiVaultContract: fakeVaiVaultContract,
      xvsVaultContract: fakeXvsVaultContract,
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
      poolLensContract: fakePoolLensContract,
      venusLensContract: fakeVenusLensContract,
      vaiVaultContract: fakeVaiVaultContract,
      xvsVaultContract: fakeXvsVaultContract,
      primeContract: fakePrimeContract,
      chainId: ChainId.BSC_TESTNET,
      merklCampaigns: {},
    });

    expect(res).toMatchSnapshot();
  });

  it('returns pool rewards of the user, including Merkl rewards, in the correct format on success', async () => {
    (restService as Mock).mockImplementation(async () => ({
      data: [fakeMerklRewardsResponse],
    }));
    const res = await getPendingRewards({
      legacyPoolComptrollerContractAddress: fakeLegacyPoolComptrollerAddress,
      isolatedPoolComptrollerAddresses: [fakeIsolatedPoolComptrollerAddress],
      tokens,
      xvsVestingVaultPoolCount: 1,
      accountAddress: fakeAddress,
      poolLensContract: fakePoolLensContract,
      venusLensContract: fakeVenusLensContract,
      vaiVaultContract: fakeVaiVaultContract,
      xvsVaultContract: fakeXvsVaultContract,
      chainId: ChainId.BSC_TESTNET,
      merklCampaigns: fakeMerklCampaigns,
    });

    expect(restService).toHaveBeenCalledTimes(1);
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
