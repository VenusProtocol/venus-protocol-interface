import { Modal } from 'components';
import type { ActionMode } from 'containers/VaultCard/VaultModal/PositionTab/types';
import { useTranslation } from 'libs/translations';
import type { VenusVault } from 'types';

import { TokenIconWithPeriod } from '../TokenIconWithPeriod';
import { PositionTab } from './PositionTab';

export interface VenusVaultModalProps {
  vault: VenusVault;
  handleClose: () => void;
  initialMode?: ActionMode;
  isOpen: boolean;
}

export const VenusVaultModal: React.FC<VenusVaultModalProps> = ({
  vault,
  handleClose,
  initialMode = 'deposit',
  isOpen,
}) => {
  const { t } = useTranslation();

  const subtitle =
    vault.stakedToken.symbol === 'XVS'
      ? t('vault.venusModal.venusVaultDescription.xvs')
      : t('vault.venusModal.venusVaultDescription.vai');

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      title={
        <div className="flex items-center gap-x-3">
          <TokenIconWithPeriod token={vault.stakedToken} size="xl" />
          <span className="text-b2r text-light-grey">{subtitle}</span>
        </div>
      }
      useDrawerInXs
    >
      <PositionTab vault={vault} onClose={handleClose} initialMode={initialMode} />
    </Modal>
  );
};
