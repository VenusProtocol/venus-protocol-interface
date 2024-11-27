import { PROPOSAL_EXECUTION_GRACE_PERIOD_MS } from 'constants/governance';
import { ProposalState, RemoteProposalState } from 'types';
import { getRemoteProposalState } from '..';

describe('getRemoteProposalState', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2024-03-14T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns Canceled when isRemoteProposalCanceled is true', () => {
    const result = getRemoteProposalState({
      proposalState: ProposalState.Executed,
      isRemoteProposalBridged: true,
      isRemoteProposalQueued: true,
      isRemoteProposalExecuted: false,
      isRemoteProposalCanceled: true,
    });
    expect(result).toBe(RemoteProposalState.Canceled);
  });

  it('returns Canceled when proposalState is Canceled, Defeated or Expired', () => {
    const baseParams = {
      isRemoteProposalBridged: true,
      isRemoteProposalQueued: true,
      isRemoteProposalExecuted: false,
      isRemoteProposalCanceled: true,
    };

    expect(
      getRemoteProposalState({
        proposalState: ProposalState.Canceled,
        ...baseParams,
      }),
    ).toBe(RemoteProposalState.Canceled);

    expect(
      getRemoteProposalState({
        proposalState: ProposalState.Defeated,
        ...baseParams,
      }),
    ).toBe(RemoteProposalState.Canceled);

    expect(
      getRemoteProposalState({
        proposalState: ProposalState.Expired,
        ...baseParams,
      }),
    ).toBe(RemoteProposalState.Canceled);
  });

  it('returns Executed when isRemoteProposalExecuted is true', () => {
    const result = getRemoteProposalState({
      proposalState: ProposalState.Executed,
      isRemoteProposalBridged: true,
      isRemoteProposalQueued: true,
      isRemoteProposalExecuted: true,
      isRemoteProposalCanceled: false,
    });
    expect(result).toBe(RemoteProposalState.Executed);
  });

  it('returns Pending when not isRemoteProposalBridged and not isRemoteProposalQueued', () => {
    const result = getRemoteProposalState({
      proposalState: ProposalState.Executed,
      isRemoteProposalBridged: false,
      isRemoteProposalQueued: false,
      isRemoteProposalExecuted: false,
      isRemoteProposalCanceled: false,
    });
    expect(result).toBe(RemoteProposalState.Pending);
  });

  it('returns Bridged when isRemoteProposalBridged and not isRemoteProposalQueued', () => {
    const result = getRemoteProposalState({
      proposalState: ProposalState.Executed,
      isRemoteProposalBridged: true,
      isRemoteProposalQueued: false,
      isRemoteProposalExecuted: false,
      isRemoteProposalCanceled: false,
    });
    expect(result).toBe(RemoteProposalState.Bridged);
  });

  it('returns Queued when isRemoteProposalQueued and not expired', () => {
    const result = getRemoteProposalState({
      proposalState: ProposalState.Executed,
      isRemoteProposalBridged: true,
      isRemoteProposalQueued: true,
      isRemoteProposalExecuted: false,
      isRemoteProposalCanceled: false,
      remoteProposalExecutionEtaDate: new Date('2024-03-14T13:00:00Z'),
    });
    expect(result).toBe(RemoteProposalState.Queued);
  });

  it('returns Queued when isRemoteProposalQueued and remoteProposalExecutionEtaDate is undefined', () => {
    const result = getRemoteProposalState({
      proposalState: ProposalState.Executed,
      isRemoteProposalBridged: true,
      isRemoteProposalQueued: true,
      isRemoteProposalExecuted: false,
      isRemoteProposalCanceled: false,
    });
    expect(result).toBe(RemoteProposalState.Queued);
  });

  it('returns Expired when isRemoteProposalQueued and expired', () => {
    const remoteProposalExecutionEtaDate = new Date('2024-03-14T11:59:59Z');
    remoteProposalExecutionEtaDate.setMilliseconds(
      remoteProposalExecutionEtaDate.getMilliseconds() - PROPOSAL_EXECUTION_GRACE_PERIOD_MS - 1,
    );

    const result = getRemoteProposalState({
      proposalState: ProposalState.Executed,
      isRemoteProposalBridged: true,
      isRemoteProposalQueued: true,
      isRemoteProposalExecuted: false,
      isRemoteProposalCanceled: false,
      remoteProposalExecutionEtaDate,
    });
    expect(result).toBe(RemoteProposalState.Expired);
  });
});
