import { Modal } from 'components';
import { CoreFormModalTitle } from 'containers/CoreFormModalTitle';
import { GatedAssetAcknowledgementModal } from 'containers/GatedAssetAcknowledgementModal';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import type { Asset } from 'types';
import { CoreBorrowForm } from './CoreBorrowForm';

export interface CoreBorrowModalProps {
  asset: Asset;
  collaterals: Asset[];
  preselectedCollateral?: Asset;
  onClose: () => void;
}

export const CoreBorrowModal: React.FC<CoreBorrowModalProps> = ({
  asset,
  collaterals,
  preselectedCollateral,
  onClose,
}) => {
  const [userChainSettings] = useUserChainSettings();

  if (asset.isGated && !userChainSettings.doNotShowGatedAssetModal) {
    return <GatedAssetAcknowledgementModal onReject={onClose} />;
  }

  return (
    <Modal isOpen title={<CoreFormModalTitle asset={asset} />} handleClose={onClose}>
      <CoreBorrowForm
        asset={asset}
        collaterals={collaterals}
        preselectedCollateral={preselectedCollateral}
        onSubmitSuccess={onClose}
      />
    </Modal>
  );
};
