import { BigNumber as BN } from 'ethers';

import fakePoolLensContractResponses from '__mocks__/contracts/poolLens';
import { xvs } from '__mocks__/models/tokens';

import type { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import MAX_UINT256 from 'constants/maxUint256';
import type {
  IsolatedPoolComptroller,
  PoolLens,
  ResilientOracle,
  RewardsDistributor,
} from 'libs/contracts';

export const fakeIsolatedPoolParticipantsCount: Awaited<
  ReturnType<typeof getIsolatedPoolParticipantsCount>
> = {
  pools: fakePoolLensContractResponses.getAllPools.map(pool => ({
    __typename: 'Pool',
    id: pool.comptroller,
    markets: pool.vTokens.map(({ vToken }) => ({
      id: vToken,
      supplierCount: 10,
      borrowerCount: 20,
    })),
  })),
};

export const fakeGetPriceOutput = BN.from('0x30f7dc8a6370b000');

export const fakeGetAssetsInOutput = [
  '0x501a91b995Bd41177503A1A4144F3D25BFF869e1',
  '0x2517A3bEe42EA8f628926849B04870260164b555',
];

export const fakeGetRewardDistributorsOutput = [
  '0x170d3b2da05cc2124334240fB34ad1359e34C562',
  '0x3338988d0beb4419Acb8fE624218754053362D06',
];

export const fakePoolRegistryContractAddress = '0x4301F2213c0eeD49a7E28Ae4c3e91722919B8B45';

export const fakePoolLensContract = {
  getAllPools: async () => fakePoolLensContractResponses.getAllPools,
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

export const fakeResilientOracleContract = {
  getPrice: async () => fakeGetPriceOutput,
} as unknown as ResilientOracle;

export const fakeIsolatedPoolComptrollerContract = {
  getRewardDistributors: async () => fakeGetRewardDistributorsOutput,
  getAssetsIn: async () => fakeGetAssetsInOutput,
} as unknown as IsolatedPoolComptroller;

export const fakeRewardsDistributorContract = {
  rewardToken: async () => xvs.address,
  rewardTokenSupplySpeeds: async () => BN.from('868055555555556'),
  rewardTokenBorrowSpeeds: async () => BN.from('868055555555556'),
  rewardTokenSupplyState: async () => ({ lastRewardingBlock: 0 }),
  rewardTokenBorrowState: async () => ({ lastRewardingBlock: 0 }),
} as unknown as RewardsDistributor;
