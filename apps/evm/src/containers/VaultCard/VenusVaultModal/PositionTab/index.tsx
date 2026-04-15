import type { FC } from 'react';

import type { VenusVault } from 'types';

import type { ActionMode } from 'containers/VaultCard/VaultModal/PositionTab/types';
import { VenusForm } from './VenusForm';

interface PositionTabProps {
  vault: VenusVault;
  initialMode?: ActionMode;
  onClose?: () => void;
}

export const PositionTab: FC<PositionTabProps> = ({ vault, ...restProps }) => {
  return <VenusForm vault={vault} {...restProps} />;
};
