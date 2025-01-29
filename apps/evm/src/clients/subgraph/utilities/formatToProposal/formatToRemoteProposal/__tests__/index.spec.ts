import nonBscProposalsResponse from '__mocks__/subgraph/nonBscProposals.json';
import { ProposalState, RemoteProposalState } from 'types';
import type { Mock } from 'vitest';
import { formatToProposalActions } from '../../formatToProposalActions';
import { getRemoteProposalState } from '../getRemoteProposalState';

import { formatToRemoteProposal } from '..';

vi.mock('../getRemoteProposalState');
vi.mock('../../formatToProposalActions');

const params = {
  layerZeroChainId: 10161,
  proposalId: 1,
  remoteProposalId: 1,
  gqlRemoteProposal: nonBscProposalsResponse.proposals[0],
  proposalState: ProposalState.Executed,
  callDatas: [],
  signatures: [],
  targets: [],
  values: [],
};

const fakeDate = new Date('2024-03-14T12:00:00Z');

describe('formatToRemoteProposal', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(fakeDate);

    (getRemoteProposalState as Mock).mockImplementation(() => RemoteProposalState.Pending);
    (formatToProposalActions as Mock).mockImplementation(() => []);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns pending remote proposal in the correct format', () => {
    const result = formatToRemoteProposal(params);

    expect(result).toMatchSnapshot();
  });

  it('returns withdrawn remote proposal in the correct format', () => {
    const result = formatToRemoteProposal({
      ...params,
      withdrawnTimestampSeconds: 1656499403,
    });

    expect(result).toMatchSnapshot();
  });

  it('returns canceled remote proposal in the correct format', () => {
    const result = formatToRemoteProposal({
      ...params,
      gqlRemoteProposal: {
        ...nonBscProposalsResponse.proposals[0],
        canceled: {
          id: '0x544c7a7eaa39193348b5907232f9cee66c8aa6f609200d03792289b40487d164',
          timestamp: '1720520363',
          txHash: '0x544c7a7eaa39193348b5907232f9cee66c8aa6f609200d03792289b40487d164',
        },
        executed: null,
      },
      bridgedTimestampSeconds: 1656499403,
    });

    expect(result).toMatchSnapshot();
  });

  it.each([
    [ProposalState.Canceled, { proposalCanceledDate: new Date(fakeDate.getTime() + 100000) }],
    [ProposalState.Expired, { proposalExpiredDate: new Date(fakeDate.getTime() + 200000) }],
    [ProposalState.Defeated, { proposalEndDate: new Date(fakeDate.getTime() + 300000) }],
  ])(
    'returns remote proposal as canceled when source proposal state is %s in the correct format',
    (proposalState, otherParams) => {
      const result = formatToRemoteProposal({
        ...params,
        ...otherParams,
        proposalState,
      });

      expect(result).toMatchSnapshot();
    },
  );

  it('returns bridged remote proposal in the correct format', () => {
    const result = formatToRemoteProposal({
      ...params,
      bridgedTimestampSeconds: 1656499403,
    });

    expect(result).toMatchSnapshot();
  });

  it('returns expired remote proposal in the correct format', () => {
    (getRemoteProposalState as Mock).mockImplementation(() => RemoteProposalState.Expired);

    const result = formatToRemoteProposal({
      ...params,
      gqlRemoteProposal: {
        ...nonBscProposalsResponse.proposals[0],
        executed: null,
      },
    });

    expect(result).toMatchSnapshot();
  });
});
