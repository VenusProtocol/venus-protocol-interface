import type Vi from 'vitest';

import fakeProvider from '__mocks__/models/provider';
import tokens, { xvs } from '__mocks__/models/tokens';

import { ChainId } from '@venusprotocol/chains';
import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { getIsolatedPoolComptrollerContract, getRewardsDistributorContract } from 'libs/contracts';

import getIsolatedPools from '..';
import {
  fakeIsolatedPoolComptrollerContract,
  fakeIsolatedPoolParticipantsCount,
  fakePoolLensContract,
  fakePoolRegistryContractAddress,
  fakeResilientOracleContract,
  fakeRewardsDistributorContract,
} from '../__testUtils__/fakeData';

vi.mock('hooks/useGetChainMetadata');
vi.mock('libs/contracts');

describe('getIsolatedPools', () => {
  beforeEach(() => {
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

  it('returns isolated pools with block based reward rates in the correct format', async () => {
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

  it('returns isolated pools with time based reward rates in the correct format', async () => {
    const response = await getIsolatedPools({
      chainId: ChainId.BSC_TESTNET,
      xvs,
      tokens,
      provider: fakeProvider,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
      poolLensContract: fakePoolLensContract,
      resilientOracleContract: fakeResilientOracleContract,
    });

    expect(response).toMatchSnapshot();
  });
});
