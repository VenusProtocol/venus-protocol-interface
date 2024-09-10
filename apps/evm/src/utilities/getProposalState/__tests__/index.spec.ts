import BigNumber from 'bignumber.js';
import { ProposalState } from 'types';
import { type GetProposalStateInput, getProposalState } from '..';

const fakeParams: GetProposalStateInput = {
  startBlockNumber: 8,
  endBlockNumber: 9,
  forVotesMantissa: new BigNumber(10),
  proposalMinQuorumVotesMantissa: new BigNumber(10),
  currentBlockNumber: 10,
  passing: false,
  queued: false,
  executed: false,
  canceled: false,
};

const fakeNowMs = 1656603774000;

describe('getProposalState', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(fakeNowMs));
  });

  const tests: { params: GetProposalStateInput; expectedProposalState: ProposalState }[] = [
    {
      params: {
        ...fakeParams,
        startBlockNumber: 11,
      },
      expectedProposalState: ProposalState.Pending,
    },
    {
      params: {
        ...fakeParams,
        endBlockNumber: 11,
        currentBlockNumber: 10,
      },
      expectedProposalState: ProposalState.Active,
    },
    {
      params: {
        ...fakeParams,
        canceled: true,
      },
      expectedProposalState: ProposalState.Canceled,
    },
    {
      params: {
        ...fakeParams,
        queued: true,
        executionEtaTimestampMs: fakeNowMs,
      },
      expectedProposalState: ProposalState.Queued,
    },
    {
      params: {
        ...fakeParams,
        executed: true,
      },
      expectedProposalState: ProposalState.Executed,
    },
    {
      params: {
        ...fakeParams,
        queued: true,
        executionEtaTimestampMs: fakeNowMs - 2,
        proposalExecutionGracePeriodMs: 1,
      },
      expectedProposalState: ProposalState.Expired,
    },
    {
      params: {
        ...fakeParams,
        passing: true,
      },
      expectedProposalState: ProposalState.Succeeded,
    },
    {
      params: {
        ...fakeParams,
        passing: false,
      },
      expectedProposalState: ProposalState.Defeated,
    },
    {
      params: {
        ...fakeParams,
        forVotesMantissa: fakeParams.proposalMinQuorumVotesMantissa.minus(1),
        passing: true,
      },
      expectedProposalState: ProposalState.Defeated,
    },
  ];

  it.each(tests)(
    'returns the right proposal state based on passed params: %s',
    async ({ params, expectedProposalState }) =>
      expect(getProposalState(params)).toBe(expectedProposalState),
  );
});
