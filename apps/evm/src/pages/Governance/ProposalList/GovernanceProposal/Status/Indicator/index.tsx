import { cn } from '@venusprotocol/ui';
import { Icon, type IconName } from 'components';
import { useMemo } from 'react';
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
  const [colorClass, iconName] = useMemo<[string, IconName]>(() => {
    let tmpColorClass = 'bg-grey';
    let tmpIconName: IconName = 'dots';

    if (isExecutable) {
      tmpColorClass = 'bg-orange';
      tmpIconName = 'exclamation';
    } else if (state === ProposalState.Executed) {
      tmpColorClass = 'bg-green';
      tmpIconName = 'mark';
    } else if (
      state === ProposalState.Defeated ||
      state === ProposalState.Expired ||
      state === ProposalState.Canceled
    ) {
      tmpColorClass = 'bg-red';
      tmpIconName = 'close';
    }

    return [tmpColorClass, tmpIconName];
  }, [state, isExecutable]);

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
