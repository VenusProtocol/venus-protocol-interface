import { ContractCallContext, Multicall as Multicall3 } from 'ethereum-multicall';
import { ContractTypeByName } from 'packages/contracts';
import Vi from 'vitest';

import fakePoolLensContractResponses from '__mocks__/contracts/poolLens';
import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';

import getIsolatedPools from '..';
import {
  fakeIsolatedPoolParticipantsCount,
  fakeMulticallResponse0,
  fakeMulticallResponse1,
  fakeMulticallResponse2,
} from '../__testUtils__/fakeData';

const fakePoolRegistryContractAddress = '0x14d1820b2D1c7c7452A163983Dc888CEC546b7897';
const fakeResilientOracleContractAddress = '0x23d1820b2D1c7c7452A163983Dc888CEC546b7897';

vi.mock('clients/subgraph');
vi.mock('../../getTokenBalances', () => ({
  default: async () => ({
    tokenBalances: [],
  }),
}));

const fakePoolLensContract = {
  getAllPools: async () => fakePoolLensContractResponses.getAllPools,
} as unknown as ContractTypeByName<'poolLens'>;

const fakeMulticall3 = {
  call: (context: ContractCallContext | ContractCallContext[]) => {
    if (Array.isArray(context)) {
      return context[0].reference === 'poolLens' ? fakeMulticallResponse0 : fakeMulticallResponse1;
    }

    return fakeMulticallResponse2;
  },
} as unknown as Multicall3;

describe('api/queries/getIsolatedPools', () => {
  it('returns isolated pools in the correct format', async () => {
    (getIsolatedPoolParticipantsCount as Vi.Mock).mockImplementationOnce(
      () => fakeIsolatedPoolParticipantsCount,
    );

    const response = await getIsolatedPools({
      poolLensContract: fakePoolLensContract,
      provider: fakeProvider,
      accountAddress: fakeAddress,
      multicall3: fakeMulticall3,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
      resilientOracleContractAddress: fakeResilientOracleContractAddress,
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
      multicall3: fakeMulticall3,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
      resilientOracleContractAddress: fakeResilientOracleContractAddress,
    });

    expect(response).toMatchSnapshot();
  });
});
