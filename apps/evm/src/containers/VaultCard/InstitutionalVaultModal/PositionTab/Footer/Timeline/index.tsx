import { useTimeline } from 'containers/VaultCard/InstitutionalVaultModal/useTimeline';
import type { InstitutionalVault } from 'types';
import { Checkpoint } from './Checkpoint';

export interface TimelineProps {
  vault: InstitutionalVault;
}

export const Timeline: React.FC<TimelineProps> = ({ vault }) => {
  const { checkpoints } = useTimeline({ vault });

  return (
    <div className="flex flex-col gap-y-3">
      {checkpoints.map(checkpoint => (
        <Checkpoint key={checkpoint.title} checkpoint={checkpoint} />
      ))}
    </div>
  );
};
