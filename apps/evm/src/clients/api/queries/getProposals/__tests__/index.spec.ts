import proposalsResponse from '__mocks__/api/proposals.json';
import fakeAccountAddress from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import { ChainId, ProposalState } from 'types';
import { restService } from 'utilities';
import type { Mock } from 'vitest';
import { type GetProposalsInput, getProposals } from '..';

vi.mock('utilities/restService');

const fakeParams: GetProposalsInput = {
  chainId: ChainId.BSC_MAINNET,
  currentBlockNumber: 134614181,
  proposalMinQuorumVotesMantissa: new BigNumber('600000000000000000000000'),
  accountAddress: fakeAccountAddress,
};

describe('getProposals', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(1795600000000));

    (restService as Mock).mockImplementation(async () => ({
      status: 200,
      data: proposalsResponse,
    }));
  });

  it('returns proposals in the correct format', async () => {
    const res = await getProposals(fakeParams);

    expect(res).toMatchSnapshot();
  });

  it('passes the proposal state, search, page and limit to the API', async () => {
    await getProposals({
      ...fakeParams,
      proposalState: ProposalState.Executed,
      search: 'fake search',
      page: 2,
      limit: 5,
    });

    expect(restService).toHaveBeenCalledWith({
      endpoint: '/governance/proposals',
      method: 'GET',
      params: {
        state: ProposalState.Executed,
        search: 'fake%20search',
        page: 2,
        limit: 5,
      },
    });
  });

  it('throws an error when the API returns an error', async () => {
    (restService as Mock).mockImplementation(async () => ({
      status: 500,
      data: { error: 'Internal error' },
    }));

    await expect(getProposals(fakeParams)).rejects.toThrow('somethingWentWrong');
  });
});
