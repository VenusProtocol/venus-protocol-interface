import proposalsResponse from '__mocks__/api/proposals.json';
import BigNumber from 'bignumber.js';
import { ChainId } from 'types';
import { restService } from 'utilities';
import type { Mock } from 'vitest';
import { type GetProposalInput, getProposal } from '..';

vi.mock('utilities/restService');

const fakeParams: GetProposalInput = {
  proposalId: 681,
  chainId: ChainId.BSC_MAINNET,
  currentBlockNumber: 134614181,
  proposalMinQuorumVotesMantissa: new BigNumber('600000000000000000000000'),
};

describe('getProposal', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(1795600000000));

    (restService as Mock).mockImplementation(async () => ({
      status: 200,
      data: proposalsResponse.result[0],
    }));
  });

  it('throws an error if proposal was not found', async () => {
    (restService as Mock).mockImplementation(async () => ({
      status: 404,
      data: { error: 'Item not found' },
    }));

    await expect(getProposal(fakeParams)).rejects.toThrow('proposalNotFound');
  });

  it('fetches the proposal from the API', async () => {
    await getProposal(fakeParams);

    expect(restService).toHaveBeenCalledWith({
      endpoint: '/governance/proposals/681',
      method: 'GET',
    });
  });

  it('returns proposal in the correct format', async () => {
    const res = await getProposal(fakeParams);

    expect(res).toMatchSnapshot();
  });
});
