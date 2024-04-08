import fakeAccountAddress from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import { getProposalPreviews as getGqlProposalPreviews } from 'clients/subgraph';
import { ChainId, ProposalState } from 'types';
import type Vi from 'vitest';
import { type GetProposalPreviewsInput, getProposalPreviews } from '..';

const fakeParams: GetProposalPreviewsInput = {
  chainId: ChainId.BSC_TESTNET,
  currentBlockNumber: 1,
  proposalMinQuorumVotesMantissa: new BigNumber(10),
  proposalExecutionGracePeriodMs: 1209600000,
  blockTimeMs: 3000,
  accountAddress: fakeAccountAddress,
};

describe('getProposalPreviews', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(1710401645000));
  });

  it('returns proposal previews in the correct format', async () => {
    const res = await getProposalPreviews(fakeParams);

    expect(res).toMatchSnapshot();
  });

  it('sets "where" parameter correctly based on passed "proposalState" parameter', async () => {
    const proposalStates = Object.values(ProposalState).filter(
      (value): value is ProposalState => !Number.isNaN(+value),
    );

    for (let i = 0; i < proposalStates.length; i++) {
      const proposalState = proposalStates[i];

      await getProposalPreviews({
        ...fakeParams,
        proposalState,
      });

      expect((getGqlProposalPreviews as Vi.Mock).mock.calls[i][0]).toMatchSnapshot();
    }
  });

  it('sets "where" parameter correctly based on passed "search" parameter', async () => {
    await getProposalPreviews({
      ...fakeParams,
      search: 'fake search',
    });

    expect((getGqlProposalPreviews as Vi.Mock).mock.calls[0][0]).toMatchSnapshot();
  });
});
