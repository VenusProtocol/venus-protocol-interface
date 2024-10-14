import { Card, type CardProps } from 'components';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import { type Proposal, ProposalState, RemoteProposalState } from 'types';
import { cn } from 'utilities';
import TEST_IDS from '../testIds';
import { BscCommand } from './BscCommand';
import { NonBscCommand } from './NonBscCommand';
import { Progress } from './Progress';

const commandClasses = cn('border-b border-b-lightGrey pb-4 last:pb-0 last:border-b-0');

export interface CommandsProps extends CardProps {
  proposal: Proposal;
}

export const Commands: React.FC<CommandsProps> = ({ proposal, ...otherProps }) => {
  const { t } = useTranslation();

  const [totalPayloadsCount, executedPayloadsCount] = useMemo(() => {
    const totalCount = 1 + proposal.remoteProposals.length; // BSC proposal + Remote proposals

    let count = proposal.remoteProposals.reduce(
      (acc, command) => (command.state === RemoteProposalState.Executed ? acc + 1 : acc),
      0,
    );

    if (proposal.state === ProposalState.Executed) {
      count += 1;
    }

    return [totalCount, count];
  }, [proposal.remoteProposals, proposal.state]);

  return (
    <Card {...otherProps} data-testid={TEST_IDS.commands}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg">{t('voteProposalUi.commands.title')}</h3>

        <Progress
          executedPayloadsCount={executedPayloadsCount}
          totalPayloadsCount={totalPayloadsCount}
        />
      </div>

      <div className="space-y-4">
        <BscCommand
          proposalId={proposal.proposalId}
          state={proposal.state}
          startDate={proposal.startDate}
          createdDate={proposal.createdDate}
          endDate={proposal.endDate}
          expiredDate={proposal.expiredDate}
          executedDate={proposal.executedDate}
          cancelDate={proposal.cancelDate}
          queuedDate={proposal.queuedDate}
          executionEtaDate={proposal.executionEtaDate}
          proposalActions={proposal.proposalActions}
          proposerAddress={proposal.proposerAddress}
          className={commandClasses}
        />

        {proposal.remoteProposals.map(remoteProposal => (
          <NonBscCommand
            key={`non-bsc-command-${remoteProposal.chainId}-${remoteProposal.proposalId}`}
            remoteProposalId={remoteProposal.remoteProposalId}
            chainId={remoteProposal.chainId}
            proposalActions={remoteProposal.proposalActions}
            state={remoteProposal.state}
            executionEtaDate={remoteProposal.executionEtaDate}
            bridgedDate={remoteProposal.bridgedDate}
            canceledDate={remoteProposal.canceledDate}
            queuedDate={remoteProposal.queuedDate}
            executedDate={remoteProposal.executedDate}
            expiredDate={remoteProposal.expiredDate}
            className={commandClasses}
          />
        ))}
      </div>
    </Card>
  );
};
