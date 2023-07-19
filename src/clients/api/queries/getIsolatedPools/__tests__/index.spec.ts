import { ContractCallContext, Multicall } from 'ethereum-multicall';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { PoolLens } from 'types/contracts';

import getIsolatedPools from '..';
import {
  fakeGetAllPoolsOuput,
  fakeIsolatedPoolParticipantsCount,
  fakeMulticallResponse0,
  fakeMulticallResponse1,
  fakeMulticallResponse2,
} from '../__testUtils__/fakeData';

vi.mock('clients/subgraph');

describe('api/queries/getIsolatedPools', () => {
  test('returns isolated pools in the correct format', async () => {
    (getIsolatedPoolParticipantsCount as Vi.Mock).mockImplementationOnce(
      () => fakeIsolatedPoolParticipantsCount,
    );

    const fakePoolLensContract = {
      getAllPools: async () => fakeGetAllPoolsOuput,
    } as unknown as PoolLens;

    const fakeMulticall = {
      call: (context: ContractCallContext | ContractCallContext[]) => {
        if (Array.isArray(context)) {
          return context[0].reference === 'poolLens'
            ? fakeMulticallResponse0
            : fakeMulticallResponse1;
        }

        return fakeMulticallResponse2;
      },
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
