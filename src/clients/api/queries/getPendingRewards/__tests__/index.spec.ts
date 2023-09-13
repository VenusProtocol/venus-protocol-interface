import { ContractTypeByName } from 'packages/contracts';
import { getTokens } from 'packages/tokens';
import { ChainId } from 'types';

import fakeAddress from '__mocks__/models/address';

import getPendingRewardGroups from '..';
import {
  fakeGetIsolatedPoolPendingRewardsOutput,
  fakeGetMainPoolPendingRewardsOutput,
  fakeGetPendingXvsOutput,
  fakeGetPriceOutput,
  fakeGetXvsVaultPendingRewardOutput,
  fakeGetXvsVaultPendingWithdrawalsBeforeUpgradeOutput,
  fakeGetXvsVaultPoolInfosOutput,
} from '../__testUtils__/fakeData';

const tokens = getTokens({
  chainId: ChainId.BSC_TESTNET,
});
const fakeMainPoolComptrollerAddress = '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D';
const fakeIsolatedPoolComptrollerAddress = '0x1291820b2D1c7c7452A163983Dc888CEC546b78k';

const fakeResilientOracleContract = {
  getPrice: async () => fakeGetPriceOutput,
} as unknown as ContractTypeByName<'resilientOracle'>;

const fakePoolLensContract = {
  getPendingRewards: async () => fakeGetIsolatedPoolPendingRewardsOutput,
} as unknown as ContractTypeByName<'poolLens'>;

const fakeVenusLensContract = {
  pendingRewards: async () => fakeGetMainPoolPendingRewardsOutput,
} as unknown as ContractTypeByName<'venusLens'>;

const fakeVaiVaultContract = {
  pendingXVS: async () => fakeGetPendingXvsOutput,
} as unknown as ContractTypeByName<'vaiVault'>;

const fakeXvsVaultContract = {
  poolInfos: async () => fakeGetXvsVaultPoolInfosOutput,
  pendingReward: async () => fakeGetXvsVaultPendingRewardOutput,
  pendingWithdrawalsBeforeUpgrade: async () => fakeGetXvsVaultPendingWithdrawalsBeforeUpgradeOutput,
} as unknown as ContractTypeByName<'xvsVault'>;

describe('api/queries/getPendingRewardGroups', () => {
  test('returns pool rewards of the user in the correct format on success', async () => {
    const res = await getPendingRewardGroups({
      mainPoolComptrollerContractAddress: fakeMainPoolComptrollerAddress,
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
});
