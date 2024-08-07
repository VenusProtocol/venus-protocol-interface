import { Card, type CardProps } from 'components';
import { useTranslation } from 'libs/translations';
import type { ProposalCommand } from 'types';
import { Command } from './Command';
import { Progress } from './Progress';

export interface CommandsProps extends CardProps {
  commands: ProposalCommand[];
}

export const Commands: React.FC<CommandsProps> = ({ commands, ...otherProps }) => {
  const { t } = useTranslation();

  const successfulPayloadsCount = commands.reduce(
    (acc, command) => (command.executedAt ? acc + 1 : acc),
    0,
  );

  return (
    <Card {...otherProps}>
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
