import type { FC } from 'react';
import type { Vault } from 'types';
import { isInstitutionalVault, isPendleVault } from 'utilities';
import { InstitutionalForm } from './InstitutionalForm';
import { PendleForm } from './PendleForm';
import type { ActionMode } from './types';

interface PendleFormProps {
  vault: Vault;
  initialMode?: ActionMode;
  onClose?: () => void;
}

export const PositionTab: FC<PendleFormProps> = ({ vault, ...restProps }) => {
  if (isPendleVault(vault)) {
    return <PendleForm vault={vault} {...restProps} />;
  }

  if (isInstitutionalVault(vault)) {
    return <InstitutionalForm vault={vault} onClose={restProps.onClose} />;
  }

  return null;
};
