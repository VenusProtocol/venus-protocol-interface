import type { FC } from 'react';
import type { PendleVault } from 'types';
import { PendleForm } from './PendleForm';
import type { ActionMode } from './types';

interface PositionTabProps {
  vault: PendleVault;
  initialMode?: ActionMode;
  onClose?: () => void;
}

export const PositionTab: FC<PositionTabProps> = ({ vault, ...restProps }) => {
  return <PendleForm vault={vault} {...restProps} />;
};
