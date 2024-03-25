import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import type Vi from 'vitest';

import fakePoolLensResponses from '__mocks__/contracts/poolLens';
import fakeProvider from '__mocks__/models/provider';
import tokens, { xvs } from '__mocks__/models/tokens';

import { getTokenBalances } from 'clients/api';
import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import MAX_UINT256 from 'constants/maxUint256';
import {
  type PoolLens,
  getIsolatedPoolComptrollerContract,
  getRewardsDistributorContract,
} from 'libs/contracts';
import { ChainId, type Token } from 'types';

import getIsolatedPools, { LST_POOL_COMPTROLLER_ADDRESS } from '..';
import {
  fakeIsolatedPoolComptrollerContract,
  fakeIsolatedPoolParticipantsCount,
  fakePoolLensContract,
  fakePoolRegistryContractAddress,
  fakeResilientOracleContract,
  fakeRewardsDistributorContract,
} from '../__testUtils__/fakeData';

vi.mock('libs/contracts');

describe('getIsolatedPools', () => {
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
