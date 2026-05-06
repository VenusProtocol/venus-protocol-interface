import { cn } from '@venusprotocol/ui';

import { Icon, type IconName } from 'components';
import type { TimelineCheckpoint } from 'containers/VaultCard/InstitutionalVaultModal/types';

export interface CheckpointProps {
  checkpoint: TimelineCheckpoint;
}

export const Checkpoint: React.FC<CheckpointProps> = ({ checkpoint }) => {
  let iconName: IconName = 'checkInlineEmpty';
  let iconColorClass = cn('text-grey');

  if (checkpoint.status === 'passed') {
    iconName = 'checkInline';
    iconColorClass = cn('text-green');
  } else if (checkpoint.status === 'ongoing') {
    iconName = 'checkInlineDotted';
    iconColorClass = cn('text-blue');
  }

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center gap-x-2">
        <Icon name={iconName} className={cn(iconColorClass, 'size-5')} />

        <p
          className={cn(
            'text-b2r',
            checkpoint.status === 'ongoing' ? 'text-white' : 'text-light-grey',
          )}
        >
          {checkpoint.title}
        </p>
      </div>

      <p
        className={cn(
          'text-b2r ml-7',
          checkpoint.status === 'ongoing' ? 'text-white' : 'text-light-grey',
        )}
      >
        {checkpoint.description}
      </p>
    </div>
  );
};
