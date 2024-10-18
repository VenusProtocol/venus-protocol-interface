import { Icon, type IconName } from 'components';
import { useMemo } from 'react';
import { type Proposal, ProposalState } from 'types';
import { cn } from 'utilities';

export type IndicatorProps = React.HTMLAttributes<HTMLDivElement> & Pick<Proposal, 'state'>;

export const Indicator: React.FC<IndicatorProps> = ({ state, className, ...otherProps }) => {
  const [colorClass, iconName] = useMemo<[string, IconName]>(() => {
    let tmpColorClass = 'bg-grey';
    let tmpIconName: IconName = 'dots';

    if (state === ProposalState.Executed) {
      tmpColorClass = 'bg-green';
      tmpIconName = 'mark';
    } else if (state === ProposalState.Succeeded) {
      tmpColorClass = 'bg-orange';
      tmpIconName = 'exclamation';
    } else if (
      state === ProposalState.Defeated ||
      state === ProposalState.Expired ||
      state === ProposalState.Canceled
    ) {
      tmpColorClass = 'bg-red';
      tmpIconName = 'close';
    }

    return [tmpColorClass, tmpIconName];
  }, [state]);

  return (
    <div
      className={cn(
        'w-10 h-10 rounded-full mx-auto flex items-center justify-center',
        colorClass,
        className,
      )}
      {...otherProps}
    >
      <Icon name={iconName} className="w-6 h-6 text-offWhite" />
    </div>
  );
};
