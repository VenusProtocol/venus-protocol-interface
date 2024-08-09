import { ChainId, type ProposalCommand, ProposalCommandState } from 'types';

const fakePastDate = new Date(2023, 1, 1);
const fakeFutureDate = new Date(2089, 1, 1);

export const commands: ProposalCommand[] = [
  {
    chainId: ChainId.BSC_TESTNET,
    state: ProposalCommandState.Executed,
    bridgedAt: fakePastDate,
    queuedAt: fakePastDate,
    succeededAt: fakePastDate,
    executedAt: fakePastDate,
    actionSignatures: [
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
    chainId: ChainId.OPBNB_TESTNET,
    state: ProposalCommandState.Bridged,
    bridgedAt: fakePastDate,
    queuedAt: fakePastDate,
    actionSignatures: [
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
    chainId: ChainId.SEPOLIA,
    state: ProposalCommandState.Queued,
    bridgedAt: fakePastDate,
    queuedAt: fakePastDate,
    executableAt: fakeFutureDate,
    actionSignatures: [
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
    chainId: ChainId.SEPOLIA,
    state: ProposalCommandState.Queued,
    bridgedAt: fakePastDate,
    queuedAt: fakePastDate,
    executableAt: fakePastDate,
    actionSignatures: [
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
    chainId: ChainId.OPBNB_TESTNET,
    state: ProposalCommandState.Queued,
    bridgedAt: fakePastDate,
    queuedAt: fakePastDate,
    executableAt: fakePastDate,
    failedExecutionAt: fakeFutureDate,
    actionSignatures: [
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
    chainId: ChainId.ARBITRUM_SEPOLIA,
    state: ProposalCommandState.Canceled,
    bridgedAt: fakePastDate,
    queuedAt: fakePastDate,
    executableAt: fakePastDate,
    canceledAt: fakePastDate,
    actionSignatures: [
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
    chainId: ChainId.ARBITRUM_SEPOLIA,
    state: ProposalCommandState.Executed,
    bridgedAt: fakePastDate,
    queuedAt: fakePastDate,
    executableAt: fakePastDate,
    executedAt: fakePastDate,
    actionSignatures: [
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
