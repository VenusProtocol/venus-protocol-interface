import { Card, type CardProps } from 'components';
import { useTranslation } from 'libs/translations';
import { Progress } from './Progress';

export interface CommandsProps extends CardProps {}

export const Commands: React.FC<CommandsProps> = ({ ...otherProps }) => {
  const { t } = useTranslation();

  // TODO: fetch (see VEN-2701)
  const successfulPayloadsCount = 4;
  const totalPayloadsCount = 5;

  return (
    <Card {...otherProps}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg">{t('voteProposalUi.commands.title')}</h3>

        <Progress
          successfulPayloadsCount={successfulPayloadsCount}
          totalPayloadsCount={totalPayloadsCount}
        />
      </div>
    </Card>
  );
};
