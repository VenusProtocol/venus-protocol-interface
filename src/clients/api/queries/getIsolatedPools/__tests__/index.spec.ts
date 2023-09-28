import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';
import {
  getIsolatedPoolComptrollerContract,
  getRewardsDistributorContract,
} from 'packages/contractsNew';
import { Token } from 'types';
import Vi from 'vitest';

import fakePoolLensResponses from '__mocks__/contracts/poolLens';
import fakeProvider from '__mocks__/models/provider';
import tokens, { xvs } from '__mocks__/models/tokens';
import { getTokenBalances } from 'clients/api';
import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import MAX_UINT256 from 'constants/maxUint256';

import getIsolatedPools from '..';
import {
  fakeGetAssetsInOutput,
  fakeGetPriceOutput,
  fakeGetRewardDistributorsOutput,
  fakeIsolatedPoolParticipantsCount,
} from '../__testUtils__/fakeData';

vi.mock('packages/contractsNew');
vi.mock('clients/subgraph');

const fakePoolRegistryContractAddress = '0x4301F2213c0eeD49a7E28Ae4c3e91722919B8B45';

const fakePoolLensContract = {
  getAllPools: async () => fakePoolLensResponses.getAllPools,
  callStatic: {
    vTokenBalancesAll: async (vTokenAddresses: string[]) =>
      vTokenAddresses.map(vTokenAddress => ({
        vToken: vTokenAddress,
        balanceOf: BN.from('1000000000000000000'),
        balanceOfUnderlying: BN.from('2000000000000000000'),
        borrowBalanceCurrent: BN.from('300000000000000000'),
        tokenBalance: BN.from('40000000000000000000'),
        tokenAllowance: BN.from(MAX_UINT256),
      })),
  },
} as unknown as ContractTypeByName<'poolLens'>;

const fakeResilientOracleContract = {
  getPrice: async () => fakeGetPriceOutput,
} as unknown as ContractTypeByName<'resilientOracle'>;

const fakeIsolatedPoolComptrollerContract = {
  getRewardDistributors: async () => fakeGetRewardDistributorsOutput,
  getAssetsIn: async () => fakeGetAssetsInOutput,
} as unknown as ContractTypeByName<'isolatedPoolComptroller'>;

const fakeRewardsDistributorContract = {
  rewardToken: async () => xvs.address,
  rewardTokenSupplySpeeds: async () => BN.from('868055555555556'),
  rewardTokenBorrowSpeeds: async () => BN.from('868055555555556'),
  rewardTokenSupplyState: async () => ({ lastRewardingBlock: 0 }),
  rewardTokenBorrowState: async () => ({ lastRewardingBlock: 0 }),
} as unknown as ContractTypeByName<'rewardsDistributor'>;

describe('api/queries/getIsolatedPools', () => {
  beforeEach(() => {
    (getTokenBalances as Vi.Mock).mockImplementation(
      ({ tokens: requestedTokens }: { tokens: Token[] }) =>
        requestedTokens.map(token => ({
          token,
          balanceWei: new BigNumber('10000000000000000000'),
        })),
    );

    (getIsolatedPoolComptrollerContract as Vi.Mock).mockImplementation(
      () => fakeIsolatedPoolComptrollerContract,
    );

    (getRewardsDistributorContract as Vi.Mock).mockImplementation(
      () => fakeRewardsDistributorContract,
    );
  });

  it('returns isolated pools in the correct format', async () => {
    (getIsolatedPoolParticipantsCount as Vi.Mock).mockImplementationOnce(
      () => fakeIsolatedPoolParticipantsCount,
    );

    const response = await getIsolatedPools({
      tokens,
      provider: fakeProvider,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
      poolLensContract: fakePoolLensContract,
      resilientOracleContract: fakeResilientOracleContract,
    });

    expect(response).toMatchSnapshot();
  });
});
