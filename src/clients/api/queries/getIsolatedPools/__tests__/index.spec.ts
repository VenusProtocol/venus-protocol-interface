import { Multicall } from 'ethereum-multicall';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { getTokenBalances } from 'clients/api';
import { getIsolatedPools as getSubgraphIsolatedPools } from 'clients/subgraph';

import getIsolatedPools from '..';
import { fakeGetSubgraphIsolatedPoolsOutput, fakeGetTokenBalancesOutput } from './fakeData';

jest.mock('clients/api');
jest.mock('clients/subgraph');

describe('api/queries/getIsolatedPools', () => {
  test('returns isolated pools in the correct format', async () => {
    (getSubgraphIsolatedPools as jest.Mock).mockImplementationOnce(
      () => fakeGetSubgraphIsolatedPoolsOutput,
    );
    (getTokenBalances as jest.Mock).mockImplementationOnce(() => fakeGetTokenBalancesOutput);

    const multicall = {
      call: jest.fn(async () => fakeMulticallResponses.priceOracle.isolatedAssets),
    } as unknown as Multicall;

    const response = await getIsolatedPools({
      provider: fakeProvider,
      accountAddress: fakeAddress,
      multicall,
    });

    expect(response).toMatchSnapshot();
  });
});
