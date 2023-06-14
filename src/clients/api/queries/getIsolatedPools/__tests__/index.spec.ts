import { ContractCallContext, Multicall } from 'ethereum-multicall';

import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { PoolLens } from 'types/contracts';

import getIsolatedPools from '..';
import {
  fakeGetAllPoolsOuput,
  fakeIsolatedPoolParticipantsCount,
  fakeMulticallResponse1,
  fakeMulticallResponse2,
} from '../__testUtils__/fakeData';

vi.mock('clients/subgraph');

describe('api/queries/getIsolatedPools', () => {
  test('returns isolated pools in the correct format', async () => {
    (getIsolatedPoolParticipantsCount as vi.Mock).mockImplementationOnce(
      () => fakeIsolatedPoolParticipantsCount,
    );

    const fakePoolLensContract = {
      getAllPools: async () => fakeGetAllPoolsOuput,
    } as unknown as PoolLens;

    const fakeMulticall = {
      call: (contexts: ContractCallContext[]) =>
        contexts[0].reference === 'poolLens' ? fakeMulticallResponse1 : fakeMulticallResponse2,
    } as unknown as Multicall;

    const response = await getIsolatedPools({
      poolLensContract: fakePoolLensContract,
      provider: fakeProvider,
      accountAddress: fakeAddress,
      multicall: fakeMulticall,
    });

    expect(response).toMatchSnapshot();
  });
});
