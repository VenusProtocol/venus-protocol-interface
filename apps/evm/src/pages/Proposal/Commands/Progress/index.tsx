import { Icon, ProgressCircle } from 'components';
import { useTranslation } from 'libs/translations';
import { cn } from 'utilities';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  successfulPayloadsCount: number;
  totalPayloadsCount: number;
}

export const Progress: React.FC<ProgressProps> = ({
  className,
  successfulPayloadsCount,
  totalPayloadsCount,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const isComplete = successfulPayloadsCount === totalPayloadsCount;

  return (
    <div className={cn('flex items-center', className)} {...otherProps}>
      <p className={cn('text-sm', isComplete ? 'text-green' : 'text-grey hidden sm:block')}>
        {isComplete
          ? t('voteProposalUi.commands.allPayloadsExecuted')
          : t('voteProposalUi.commands.somePayloadsExecuted')}
      </p>

      {isComplete ? (
        <Icon name="mark" className="ml-2 text-green w-3 h-3" />
      ) : (
        <div className="relative ml-3 w-12 h-12 flex items-center justify-center">
          <ProgressCircle
            strokeWidthPx={4}
            sizePx={50}
            className="absolute inset"
            value={(successfulPayloadsCount * 100) / totalPayloadsCount}
          />

          <p className="text-sm text-center">
            {successfulPayloadsCount}/{totalPayloadsCount}
          </p>
        </div>
      )}
    </div>
  );
};
