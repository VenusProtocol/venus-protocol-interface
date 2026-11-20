import { ProposalState, RemoteProposalState } from 'types';
import type { Mock } from 'vitest';
import type { ApiRemoteProposal, ApiRemoteProposalExecution } from '../../../types';
import { formatToProposalActions } from '../../formatToProposalActions';
import { getRemoteProposalState } from '../getRemoteProposalState';

import { formatToRemoteProposal } from '..';

vi.mock('../getRemoteProposalState');
vi.mock('../../formatToProposalActions');

const fakeTransaction = {
  txHash: '0x544c7a7eaa39193348b5907232f9cee66c8aa6f609200d03792289b40487d164',
  blockNumber: 1,
  timestamp: 1720520363,
};

const execution: ApiRemoteProposalExecution = {
  chainId: 1,
  executionEta: 1720606763,
  queued: { ...fakeTransaction, timestamp: 1720433963 },
  executed: { ...fakeTransaction, timestamp: 1720606800 },
  canceled: null,
};

const apiRemoteProposal: ApiRemoteProposal = {
  layerZeroChainId: 101,
  remoteProposalId: 1,
  actions: [],
  failedReason: null,
  stored: null,
  bridged: null,
  withdrawn: null,
  execution,
};

const params = {
  proposalId: 1,
  proposalState: ProposalState.Executed,
  apiRemoteProposal,
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
    const result = formatToRemoteProposal({
      ...params,
      apiRemoteProposal: { ...apiRemoteProposal, remoteProposalId: null, execution: null },
    });

    expect(result).toMatchSnapshot();
  });

  it('returns executed remote proposal in the correct format', () => {
    const result = formatToRemoteProposal(params);

    expect(result).toMatchSnapshot();
  });

  it('returns failed remote proposal in the correct format', () => {
    const result = formatToRemoteProposal({
      ...params,
      apiRemoteProposal: { ...apiRemoteProposal, stored: fakeTransaction, execution: null },
    });

    expect(result).toMatchSnapshot();
  });

  it('returns withdrawn remote proposal in the correct format', () => {
    const result = formatToRemoteProposal({
      ...params,
      apiRemoteProposal: { ...apiRemoteProposal, withdrawn: fakeTransaction, execution: null },
    });

    expect(result).toMatchSnapshot();
  });

  it('returns canceled remote proposal in the correct format', () => {
    const result = formatToRemoteProposal({
      ...params,
      apiRemoteProposal: {
        ...apiRemoteProposal,
        bridged: fakeTransaction,
        execution: {
          ...execution,
          executed: null,
          canceled: fakeTransaction,
        },
      },
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
        apiRemoteProposal: { ...apiRemoteProposal, execution: null },
        proposalState,
      });

      expect(result).toMatchSnapshot();
    },
  );

  it('returns bridged remote proposal in the correct format', () => {
    const result = formatToRemoteProposal({
      ...params,
      apiRemoteProposal: { ...apiRemoteProposal, bridged: fakeTransaction, execution: null },
    });

    expect(result).toMatchSnapshot();
  });

  it('returns expired remote proposal in the correct format', () => {
    (getRemoteProposalState as Mock).mockImplementation(() => RemoteProposalState.Expired);

    const result = formatToRemoteProposal({
      ...params,
      apiRemoteProposal: {
        ...apiRemoteProposal,
        execution: { ...execution, executed: null },
      },
    });

    expect(result).toMatchSnapshot();
  });
});
