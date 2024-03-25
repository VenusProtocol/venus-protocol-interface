import BigNumber from 'bignumber.js';
import type Vi from 'vitest';

import fakeProvider from '__mocks__/models/provider';
import tokens, { xvs } from '__mocks__/models/tokens';

import { getTokenBalances } from 'clients/api';
import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { getIsolatedPoolComptrollerContract, getRewardsDistributorContract } from 'libs/contracts';
import { ChainId, type Token } from 'types';

import getIsolatedPools from '..';
import {
  fakeIsolatedPoolComptrollerContract,
  fakeIsolatedPoolParticipantsCount,
  fakePoolLensContract,
  fakePoolRegistryContractAddress,
  fakeResilientOracleContract,
  fakeRewardsDistributorContract,
} from '../__testUtils__/fakeData';

vi.mock('libs/contracts');
vi.mock('clients/subgraph');

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
});
