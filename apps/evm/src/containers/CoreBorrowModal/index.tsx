import { Modal } from 'components';
import { CoreFormModalTitle } from 'containers/CoreFormModalTitle';
import { GatedAssetAcknowledgementModal } from 'containers/GatedAssetAcknowledgementModal';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import type { Asset } from 'types';
import { CoreBorrowForm } from './CoreBorrowForm';
import { getInitialCollateral } from './CoreBorrowForm/getInitialCollateral';

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

  const availableCollaterals = collaterals.filter(({ isRestricted }) => !isRestricted);
  const isGated = [
    asset,
    getInitialCollateral({ collaterals: availableCollaterals, preselectedCollateral }),
  ].some(item => item?.isGated);

  if (isGated && !userChainSettings.doNotShowGatedAssetModal) {
    return <GatedAssetAcknowledgementModal onReject={onClose} />;
  }

  return (
    <Modal isOpen title={<CoreFormModalTitle asset={asset} />} handleClose={onClose}>
      <CoreBorrowForm
        asset={asset}
        collaterals={availableCollaterals}
        preselectedCollateral={preselectedCollateral}
        onSubmitSuccess={onClose}
      />
    </Modal>
  );
};
