import { ContractCallContext, Multicall } from 'ethereum-multicall';
import { ContractTypeByName } from 'packages/contracts';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';

import getIsolatedPools from '..';
import {
  fakeGetAllPoolsOuput,
  fakeIsolatedPoolParticipantsCount,
  fakeMulticallResponse0,
  fakeMulticallResponse1,
  fakeMulticallResponse2,
} from '../__testUtils__/fakeData';

vi.mock('clients/subgraph');

const fakePoolLensContract = {
  getAllPools: async () => fakeGetAllPoolsOuput,
} as unknown as ContractTypeByName<'poolLens'>;

const fakeMulticall = {
  call: (context: ContractCallContext | ContractCallContext[]) => {
    if (Array.isArray(context)) {
      return context[0].reference === 'poolLens' ? fakeMulticallResponse0 : fakeMulticallResponse1;
    }

    return fakeMulticallResponse2;
  },
} as unknown as Multicall;

describe('api/queries/getIsolatedPools', () => {
  it('returns isolated pools in the correct format', async () => {
    (getIsolatedPoolParticipantsCount as Vi.Mock).mockImplementationOnce(
      () => fakeIsolatedPoolParticipantsCount,
    );

    const response = await getIsolatedPools({
      poolLensContract: fakePoolLensContract,
      provider: fakeProvider,
      accountAddress: fakeAddress,
      multicall: fakeMulticall,
    });

    expect(response).toMatchSnapshot();
  });

  it('still functions even if the request to fetch the participant counts fails', async () => {
    (getIsolatedPoolParticipantsCount as Vi.Mock).mockImplementationOnce(() => {
      throw new Error('Fake error');
    });

    const response = await getIsolatedPools({
      poolLensContract: fakePoolLensContract,
      provider: fakeProvider,
      accountAddress: fakeAddress,
      multicall: fakeMulticall,
    });

    expect(response).toMatchSnapshot();
  });
});
