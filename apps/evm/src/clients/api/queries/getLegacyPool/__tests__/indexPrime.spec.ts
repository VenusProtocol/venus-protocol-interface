import { BigNumber as BN } from 'ethers';
import type Vi from 'vitest';

import fakePrimeContractResponses from '__mocks__/contracts/prime';
import fakeAccountAddress from '__mocks__/models/address';
import { markets } from '__mocks__/models/markets';
import tokens, { vai, xvs } from '__mocks__/models/tokens';

import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { Prime } from 'libs/contracts';
import { ChainId } from 'types';

import getLegacyPool from '..';
import getLegacyPoolMarkets from '../../getLegacyPoolMarkets';
import {
  fakeLegacyPoolComptrollerContract,
  fakeResilientOracleContract,
  fakeVaiControllerContract,
  fakeVenusLensContract,
} from '../__testUtils__/fakeData';

vi.mock('clients/subgraph');
vi.mock('../../getLegacyPoolMarkets');

describe('getLegacyPool - Feature enabled: Prime', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'prime',
    );

    (getLegacyPoolMarkets as Vi.Mock).mockImplementation(() => ({ markets }));
  });

  it('fetches and formats Prime distributions and Prime distribution simulations if user is Prime', async () => {
    const fakePrimeContract = {
      tokens: async () => fakePrimeContractResponses.tokens,
      MINIMUM_STAKED_XVS: async () => fakePrimeContractResponses.MINIMUM_STAKED_XVS,
      getAllMarkets: async () => fakePrimeContractResponses.getAllMarkets,
      estimateAPR: async () => fakePrimeContractResponses.estimateAPR,
      calculateAPR: async () => fakePrimeContractResponses.calculateAPR,
    } as unknown as Prime;

    const response = await getLegacyPool({
      chainId: ChainId.BSC_TESTNET,
      blocksPerDay: 28800,
      name: 'Fake pool name',
      description: 'Fake pool description',
      xvs,
      vai,
      tokens,
      accountAddress: fakeAccountAddress,
      legacyPoolComptrollerContract: fakeLegacyPoolComptrollerContract,
      venusLensContract: fakeVenusLensContract,
      vaiControllerContract: fakeVaiControllerContract,
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

    const response = await getLegacyPool({
      chainId: ChainId.BSC_TESTNET,
      blocksPerDay: 28800,
      name: 'Fake pool name',
      description: 'Fake pool description',
      xvs,
      vai,
      tokens,
      accountAddress: fakeAccountAddress,
      legacyPoolComptrollerContract: fakeLegacyPoolComptrollerContract,
      venusLensContract: fakeVenusLensContract,
      vaiControllerContract: fakeVaiControllerContract,
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

    const response = await getLegacyPool({
      chainId: ChainId.BSC_TESTNET,
      blocksPerDay: 28800,
      name: 'Fake pool name',
      description: 'Fake pool description',
      xvs,
      vai,
      tokens,
      accountAddress: fakeAccountAddress,
      legacyPoolComptrollerContract: fakeLegacyPoolComptrollerContract,
      venusLensContract: fakeVenusLensContract,
      vaiControllerContract: fakeVaiControllerContract,
      resilientOracleContract: fakeResilientOracleContract,
      primeContract: fakePrimeContract,
    });

    expect(response).toMatchSnapshot();
  });
});
