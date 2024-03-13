import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import type Vi from 'vitest';

import fakePoolLensResponses from '__mocks__/contracts/poolLens';
import fakePrimeContractResponses from '__mocks__/contracts/prime';
import fakeAccountAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import tokens, { xvs } from '__mocks__/models/tokens';

import { getTokenBalances } from 'clients/api';
import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import MAX_UINT256 from 'constants/maxUint256';
import {
  type IsolatedPoolComptroller,
  type PoolLens,
  type Prime,
  type ResilientOracle,
  type RewardsDistributor,
  getIsolatedPoolComptrollerContract,
  getRewardsDistributorContract,
} from 'libs/contracts';
import { ChainId, type Token } from 'types';

import getIsolatedPools, { LST_POOL_COMPTROLLER_ADDRESS } from '..';
import {
  fakeGetAssetsInOutput,
  fakeGetPriceOutput,
  fakeGetRewardDistributorsOutput,
  fakeIsolatedPoolParticipantsCount,
} from '../__testUtils__/fakeData';

vi.mock('libs/contracts');
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
} as unknown as PoolLens;

const fakeResilientOracleContract = {
  getPrice: async () => fakeGetPriceOutput,
} as unknown as ResilientOracle;

const fakeIsolatedPoolComptrollerContract = {
  getRewardDistributors: async () => fakeGetRewardDistributorsOutput,
  getAssetsIn: async () => fakeGetAssetsInOutput,
} as unknown as IsolatedPoolComptroller;

const fakeRewardsDistributorContract = {
  rewardToken: async () => xvs.address,
  rewardTokenSupplySpeeds: async () => BN.from('868055555555556'),
  rewardTokenBorrowSpeeds: async () => BN.from('868055555555556'),
  rewardTokenSupplyState: async () => ({ lastRewardingBlock: 0 }),
  rewardTokenBorrowState: async () => ({ lastRewardingBlock: 0 }),
} as unknown as RewardsDistributor;

describe('api/queries/getIsolatedPools', () => {
  beforeEach(() => {
    (getTokenBalances as Vi.Mock).mockImplementation(
      ({ tokens: requestedTokens }: { tokens: Token[] }) =>
        requestedTokens.map(token => ({
          token,
          balanceMantissa: new BigNumber('10000000000000000000'),
        })),
    );

    (getIsolatedPoolComptrollerContract as Vi.Mock).mockImplementation(
      () => fakeIsolatedPoolComptrollerContract,
    );

    (getRewardsDistributorContract as Vi.Mock).mockImplementation(
      () => fakeRewardsDistributorContract,
    );

    (getIsolatedPoolParticipantsCount as Vi.Mock).mockImplementation(
      () => fakeIsolatedPoolParticipantsCount,
    );
  });

  it('returns isolated pools in the correct format', async () => {
    const response = await getIsolatedPools({
      chainId: ChainId.BSC_TESTNET,
      xvs,
      blocksPerDay: 28800,
      tokens,
      provider: fakeProvider,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
      poolLensContract: fakePoolLensContract,
      resilientOracleContract: fakeResilientOracleContract,
    });

    expect(response).toMatchSnapshot();
  });

  it('fetches and formats Prime distributions and simulations if user is Prime', async () => {
    const fakePrimeContract = {
      tokens: async () => fakePrimeContractResponses.tokens,
      MINIMUM_STAKED_XVS: async () => fakePrimeContractResponses.MINIMUM_STAKED_XVS,
      getAllMarkets: async () => fakePrimeContractResponses.getAllMarkets,
      estimateAPR: async () => fakePrimeContractResponses.estimateAPR,
      calculateAPR: async () => fakePrimeContractResponses.calculateAPR,
    } as unknown as Prime;

    const response = await getIsolatedPools({
      chainId: ChainId.BSC_TESTNET,
      xvs,
      blocksPerDay: 28800,
      tokens,
      accountAddress: fakeAccountAddress,
      provider: fakeProvider,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
      poolLensContract: fakePoolLensContract,
      resilientOracleContract: fakeResilientOracleContract,
      primeContract: fakePrimeContract,
    });

    expect(response).toMatchSnapshot();
  });

  it('does not fetch Prime distributions if user is not Prime', async () => {
    const fakePrimeContract = {
      tokens: async () => ({
        ...fakePrimeContractResponses.tokens,
        exists: false,
      }),
      MINIMUM_STAKED_XVS: async () => fakePrimeContractResponses.MINIMUM_STAKED_XVS,
      getAllMarkets: async () => fakePrimeContractResponses.getAllMarkets,
      estimateAPR: async () => fakePrimeContractResponses.estimateAPR,
      calculateAPR: async () => fakePrimeContractResponses.calculateAPR,
    } as unknown as Prime;

    const response = await getIsolatedPools({
      chainId: ChainId.BSC_TESTNET,
      xvs,
      blocksPerDay: 28800,
      tokens,
      accountAddress: fakeAccountAddress,
      provider: fakeProvider,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
      poolLensContract: fakePoolLensContract,
      resilientOracleContract: fakeResilientOracleContract,
      primeContract: fakePrimeContract,
    });

    expect(response).toMatchSnapshot();
  });

  it('filters out Prime distributions and simulations that are 0', async () => {
    const fakePrimeContract = {
      tokens: async () => fakePrimeContractResponses.tokens,
      MINIMUM_STAKED_XVS: async () => fakePrimeContractResponses.MINIMUM_STAKED_XVS,
      getAllMarkets: async () => fakePrimeContractResponses.getAllMarkets,
      estimateAPR: async () => ({
        borrowAPR: BN.from(0),
        supplyAPR: BN.from(0),
      }),
      calculateAPR: async () => ({
        borrowAPR: BN.from(0),
        supplyAPR: BN.from(0),
      }),
    } as unknown as Prime;

    const response = await getIsolatedPools({
      chainId: ChainId.BSC_TESTNET,
      xvs,
      blocksPerDay: 28800,
      tokens,
      accountAddress: fakeAccountAddress,
      provider: fakeProvider,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
      poolLensContract: fakePoolLensContract,
      resilientOracleContract: fakeResilientOracleContract,
      primeContract: fakePrimeContract,
    });

    expect(response).toMatchSnapshot();
  });

  it('filters out the LST pool from the Ethereum network', async () => {
    const customFakePoolLensContract = {
      getAllPools: async () => [
        {
          ...fakePoolLensResponses.getAllPools[0],
          comptroller: LST_POOL_COMPTROLLER_ADDRESS,
        },
        ...fakePoolLensResponses.getAllPools.slice(1),
      ],
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
    } as unknown as PoolLens;

    const response = await getIsolatedPools({
      chainId: ChainId.ETHEREUM,
      xvs,
      blocksPerDay: 28800,
      tokens,
      provider: fakeProvider,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
      poolLensContract: customFakePoolLensContract,
      resilientOracleContract: fakeResilientOracleContract,
    });

    expect(
      response.pools.some(
        pool =>
          pool.comptrollerAddress.toLocaleLowerCase() ===
          LST_POOL_COMPTROLLER_ADDRESS.toLocaleLowerCase(),
      ),
    ).toBe(false);
  });
});
