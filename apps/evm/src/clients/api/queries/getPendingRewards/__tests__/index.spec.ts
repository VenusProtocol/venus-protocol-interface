import { PoolLens, Prime, ResilientOracle, VaiVault, VenusLens, XvsVault } from 'libs/contracts';

import fakeAddress from '__mocks__/models/address';
import tokens from '__mocks__/models/tokens';

import getPendingRewards from '..';
import {
  fakeGetIsolatedPoolPendingRewardsOutput,
  fakeGetLegacyPoolPendingRewardsOutput,
  fakeGetPendingXvsOutput,
  fakeGetPriceOutput,
  fakeGetPrimePendingRewardsOutput,
  fakeGetVaultPaused,
  fakeGetXvsVaultPendingRewardOutput,
  fakeGetXvsVaultPendingWithdrawalsBeforeUpgradeOutput,
  fakeGetXvsVaultPoolInfosOutput,
} from '../__testUtils__/fakeData';

const fakeLegacyPoolComptrollerAddress = '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D';
const fakeIsolatedPoolComptrollerAddress = '0x1291820b2D1c7c7452A163983Dc888CEC546b78k';

const fakeResilientOracleContract = {
  getPrice: async () => fakeGetPriceOutput,
} as unknown as ResilientOracle;

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
  test('returns pool rewards of the user in the correct format on success', async () => {
    const res = await getPendingRewards({
      legacyPoolComptrollerContractAddress: fakeLegacyPoolComptrollerAddress,
      isolatedPoolComptrollerAddresses: [fakeIsolatedPoolComptrollerAddress],
      tokens,
      xvsVestingVaultPoolCount: 1,
      accountAddress: fakeAddress,
      poolLensContract: fakePoolLensContract,
      venusLensContract: fakeVenusLensContract,
      resilientOracleContract: fakeResilientOracleContract,
      vaiVaultContract: fakeVaiVaultContract,
      xvsVaultContract: fakeXvsVaultContract,
    });

    expect(res).toMatchSnapshot();
  });

  test('returns pool rewards of the user, including Prime rewards, in the correct format on success', async () => {
    const res = await getPendingRewards({
      legacyPoolComptrollerContractAddress: fakeLegacyPoolComptrollerAddress,
      isolatedPoolComptrollerAddresses: [fakeIsolatedPoolComptrollerAddress],
      tokens,
      xvsVestingVaultPoolCount: 1,
      accountAddress: fakeAddress,
      poolLensContract: fakePoolLensContract,
      venusLensContract: fakeVenusLensContract,
      resilientOracleContract: fakeResilientOracleContract,
      vaiVaultContract: fakeVaiVaultContract,
      xvsVaultContract: fakeXvsVaultContract,
      primeContract: fakePrimeContract,
    });

    expect(res).toMatchSnapshot();
  });
});
