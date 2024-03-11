import type Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { markets } from '__mocks__/models/markets';
import tokens, { vai, xvs } from '__mocks__/models/tokens';

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

describe('getLegacyPool', () => {
  beforeEach(() => {
    (getLegacyPoolMarkets as Vi.Mock).mockImplementation(() => ({ markets }));
  });

  it('returns core pool in the correct format', async () => {
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
    });

    // Check VAI interests were accrued before being fetched
    expect(fakeVaiControllerContract.callStatic.accrueVAIInterest).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
  });
});
