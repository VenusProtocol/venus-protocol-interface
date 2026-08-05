import { cn } from '@venusprotocol/ui';

import { Icon, type IconName } from 'components';
import { useTranslation } from 'libs/translations';
import { VoteSupport } from 'types';

interface ActionCellProps {
  support: VoteSupport;
}

export const ActionCell: React.FC<ActionCellProps> = ({ support }) => {
  const { t } = useTranslation();

  let iconName: IconName;
  let label: string;
  let iconContainerClassName: string;

  switch (support) {
    case VoteSupport.Against:
      iconName = 'close';
      label = t('voterDetail.votedAgainst');
      iconContainerClassName = 'bg-red';
      break;
    case VoteSupport.For:
      iconName = 'mark';
      label = t('voterDetail.votedFor');
      iconContainerClassName = 'bg-green';
      break;
    case VoteSupport.Abstain:
      iconName = 'dots';
      label = t('voterDetail.votedAbstain');
      iconContainerClassName = 'bg-grey';
      break;
    default:
      return null;
  }

  return (
    <div className="inline-flex items-center">
      <div
        className={cn(
          'mr-2.5 flex size-4 items-center justify-center rounded-full',
          iconContainerClassName,
        )}
      >
        <Icon name={iconName} className="size-3 text-white" />
      </div>

      {label}
    </div>
  );
};
