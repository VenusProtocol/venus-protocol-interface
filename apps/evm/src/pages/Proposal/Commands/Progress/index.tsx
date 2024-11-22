import { Icon, LabeledProgressCircle } from 'components';
import { useTranslation } from 'libs/translations';
import { cn } from 'utilities';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  executedPayloadsCount: number;
  totalPayloadsCount: number;
}

export const Progress: React.FC<ProgressProps> = ({
  className,
  executedPayloadsCount,
  totalPayloadsCount,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const isComplete = executedPayloadsCount === totalPayloadsCount;

  return (
    <div className={cn('flex items-center', className)} {...otherProps}>
      <p className={cn('text-sm', isComplete ? 'text-green' : 'text-grey hidden sm:block')}>
        {isComplete
          ? t('voteProposalUi.commands.allPayloadsExecuted')
          : t('voteProposalUi.commands.somePayloadsExecuted')}
      </p>

      {isComplete ? (
        <Icon name="mark" className="ml-1 text-green w-5 h-5" />
      ) : (
        <LabeledProgressCircle value={executedPayloadsCount} total={totalPayloadsCount} />
      )}
    </div>
  );
};
