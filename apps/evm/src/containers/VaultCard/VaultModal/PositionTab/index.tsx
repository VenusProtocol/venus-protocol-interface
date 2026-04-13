import type { FC } from 'react';
import type { InstitutionalVault, PendleVault } from 'types';
import { isInstitutionalVault, isPendleVault } from '../../utils';
import { InstitutionalForm } from './InstitutionalForm';
import { PendleForm } from './PendleForm';
import type { ActionMode } from './types';

interface PositionTabProps {
  vault: PendleVault | InstitutionalVault;
  initialMode?: ActionMode;
  onClose?: () => void;
}

export const PositionTab: FC<PositionTabProps> = ({ vault, ...restProps }) => {
  if (isPendleVault(vault)) {
    return <PendleForm vault={vault} {...restProps} />;
  }

  if (isInstitutionalVault(vault)) {
    return <InstitutionalForm vault={vault} onClose={restProps.onClose} />;
  }

  return null;
};
