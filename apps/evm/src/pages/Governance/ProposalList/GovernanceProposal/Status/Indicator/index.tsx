import { cn } from '@venusprotocol/ui';
import { Icon, type IconName } from 'components';
import { type Proposal, ProposalState } from 'types';

export interface IndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<Proposal, 'state'> {
  isExecutable: boolean;
}

export const Indicator: React.FC<IndicatorProps> = ({
  state,
  isExecutable,
  className,
  ...otherProps
}) => {
  let colorClass = 'bg-grey';
  let iconName: IconName = 'dots';

  if (isExecutable) {
    colorClass = 'bg-orange';
    iconName = 'exclamation';
  } else if (state === ProposalState.Executed) {
    colorClass = 'bg-green';
    iconName = 'mark';
  } else if (
    state === ProposalState.Defeated ||
    state === ProposalState.Expired ||
    state === ProposalState.Canceled
  ) {
    colorClass = 'bg-red';
    iconName = 'close';
  }

  return (
    <div
      className={cn(
        'w-10 h-10 rounded-full mx-auto flex items-center justify-center',
        colorClass,
        className,
      )}
      {...otherProps}
    >
      <Icon name={iconName} className="w-6 h-6 text-white" />
    </div>
  );
};
