import { ChainId, type RemoteProposal, RemoteProposalState } from 'types';

const fakePastDate = new Date(2023, 1, 1);
const fakeFutureDate = new Date(2089, 1, 1);

export const remoteProposals: RemoteProposal[] = [
  {
    proposalId: 1,
    remoteProposalId: 1,
    chainId: ChainId.BSC_TESTNET,
    state: RemoteProposalState.Executed,
    bridgedDate: fakePastDate,
    queuedDate: fakePastDate,
    executedDate: fakePastDate,
    proposalActions: [
      {
        actionIndex: 0,
        target: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
        signature: 'test()',
        value: '',
        callData: '0x',
      },
      {
        actionIndex: 0,
        target: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
        signature: 'test()',
        value: '',
        callData: '0x',
      },
    ],
  },
  {
    proposalId: 2,
    remoteProposalId: 2,
    chainId: ChainId.OPBNB_TESTNET,
    state: RemoteProposalState.Bridged,
    bridgedDate: fakePastDate,
    queuedDate: fakePastDate,
    proposalActions: [
      {
        actionIndex: 0,
        target: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
        signature: 'test()',
        value: '',
        callData: '0x',
      },
      {
        actionIndex: 0,
        target: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
        signature: 'test()',
        value: '',
        callData: '0x',
      },
    ],
  },
  {
    proposalId: 3,
    remoteProposalId: 3,
    chainId: ChainId.SEPOLIA,
    state: RemoteProposalState.Queued,
    bridgedDate: fakePastDate,
    queuedDate: fakePastDate,
    executionEtaDate: fakeFutureDate,
    proposalActions: [
      {
        actionIndex: 0,
        target: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
        signature: 'test()',
        value: '',
        callData: '0x',
      },
      {
        actionIndex: 0,
        target: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
        signature: 'test()',
        value: '',
        callData: '0x',
      },
    ],
  },
  {
    proposalId: 4,
    remoteProposalId: 4,
    chainId: ChainId.SEPOLIA,
    state: RemoteProposalState.Queued,
    bridgedDate: fakePastDate,
    queuedDate: fakePastDate,
    executionEtaDate: fakePastDate,
    proposalActions: [
      {
        actionIndex: 0,
        target: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
        signature: 'test()',
        value: '',
        callData: '0x',
      },
      {
        actionIndex: 0,
        target: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
        signature: 'test()',
        value: '',
        callData: '0x',
      },
    ],
  },
  {
    proposalId: 6,
    remoteProposalId: 6,
    chainId: ChainId.ARBITRUM_SEPOLIA,
    state: RemoteProposalState.Canceled,
    bridgedDate: fakePastDate,
    queuedDate: fakePastDate,
    executionEtaDate: fakePastDate,
    canceledDate: fakePastDate,
    proposalActions: [
      {
        actionIndex: 0,
        target: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
        signature: 'test()',
        value: '',
        callData: '0x',
      },
      {
        actionIndex: 0,
        target: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
        signature: 'test()',
        value: '',
        callData: '0x',
      },
    ],
  },
  {
    proposalId: 7,
    remoteProposalId: 7,
    chainId: ChainId.ARBITRUM_SEPOLIA,
    state: RemoteProposalState.Executed,
    bridgedDate: fakePastDate,
    queuedDate: fakePastDate,
    executionEtaDate: fakePastDate,
    executedDate: fakePastDate,
    proposalActions: [
      {
        actionIndex: 0,
        target: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
        signature: 'test()',
        value: '',
        callData: '0x',
      },
      {
        actionIndex: 0,
        target: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
        signature: 'test()',
        value: '',
        callData: '0x',
      },
    ],
  },
];
