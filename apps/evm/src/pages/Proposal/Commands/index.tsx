import { Card, type CardProps } from 'components';
import { useTranslation } from 'libs/translations';
import { ChainId, type ProposalCommand, ProposalCommandState } from 'types';
import { Command } from './Command';
import { Progress } from './Progress';

// TODO: fetch (see VEN-2701)
const fakePastDate = new Date(new Date().getTime() - 60000);
const fakeFutureAt = new Date(new Date().getTime() + 5000);
const commands: ProposalCommand[] = [
  {
    chainId: ChainId.BSC_MAINNET,
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
    chainId: ChainId.OPBNB_MAINNET,
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
    chainId: ChainId.ETHEREUM,
    state: ProposalCommandState.Queued,
    bridgedAt: fakePastDate,
    queuedAt: fakePastDate,
    executableAt: fakeFutureAt,
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
    chainId: ChainId.ETHEREUM,
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
    chainId: ChainId.ETHEREUM,
    state: ProposalCommandState.Queued,
    bridgedAt: fakePastDate,
    queuedAt: fakePastDate,
    executableAt: fakePastDate,
    failedExecutionAt: fakeFutureAt,
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
    chainId: ChainId.ARBITRUM_ONE,
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
    chainId: ChainId.ARBITRUM_ONE,
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

export type CommandsProps = CardProps;

export const Commands: React.FC<CommandsProps> = props => {
  const { t } = useTranslation();

  const successfulPayloadsCount = commands.reduce(
    (acc, command) => (command.executedAt ? acc + 1 : acc),
    0,
  );

  return (
    <Card {...props}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg">{t('voteProposalUi.commands.title')}</h3>

        <Progress
          successfulPayloadsCount={successfulPayloadsCount}
          totalPayloadsCount={commands.length}
        />
      </div>

      <div className="space-y-4">
        {commands.map(command => (
          <Command
            {...command}
            className="border-b border-b-lightGrey pb-4 last:pb-0 last:border-b-0"
          />
        ))}
      </div>
    </Card>
  );
};
