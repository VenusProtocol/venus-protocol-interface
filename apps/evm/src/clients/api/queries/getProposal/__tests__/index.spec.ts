import BigNumber from 'bignumber.js';
import { getBscProposal } from 'clients/subgraph';
import { ChainId } from 'types';
import type Vi from 'vitest';
import { type GetProposalInput, getProposal } from '..';

const fakeParams: GetProposalInput = {
  proposalId: 1,
  chainId: ChainId.BSC_TESTNET,
  currentBlockNumber: 1,
  proposalMinQuorumVotesMantissa: new BigNumber(10),
  proposalExecutionGracePeriodMs: 1209600000,
  blockTimeMs: 3000,
};

describe('getProposal', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(1710401645000));
  });

  it('throws an error if proposal was not found', async () => {
    (getBscProposal as Vi.Mock).mockImplementation(() => ({
      proposal: undefined,
    }));

    try {
      await getProposal(fakeParams);

      throw new Error('getProposal should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: proposalNotFound]');
    }
  });

  it('returns proposal in the correct format', async () => {
    const res = await getProposal(fakeParams);

    expect(res).toMatchSnapshot();
  });
});
