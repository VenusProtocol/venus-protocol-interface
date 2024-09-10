import { Card, type CardProps } from 'components';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import { type Proposal, ProposalState, RemoteProposalState } from 'types';
import { Command } from './Command';
import { Progress } from './Progress';

export interface CommandsProps extends CardProps {
  proposal: Proposal;
}

export const Commands: React.FC<CommandsProps> = ({ proposal, ...otherProps }) => {
  const { t } = useTranslation();

  const [totalPayloadsCount, successfulPayloadsCount] = useMemo(() => {
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
    <Card {...otherProps}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg">{t('voteProposalUi.commands.title')}</h3>

        <Progress
          successfulPayloadsCount={successfulPayloadsCount}
          totalPayloadsCount={totalPayloadsCount}
        />
      </div>

      <div className="space-y-4">
        {proposal.remoteProposals.map(command => (
          <Command
            // TODO: add BSC proposal (see VEN-2701)
            {...command}
            className="border-b border-b-lightGrey pb-4 last:pb-0 last:border-b-0"
          />
        ))}
      </div>
    </Card>
  );
};
