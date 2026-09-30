import { Modal, type ModalProps } from 'components';
import { GatedAssetAcknowledgementModal } from 'containers/GatedAssetAcknowledgementModal';
import { SpokeForm, type SpokeFormProps } from 'containers/SpokeForm';
import { useUserChainSettings } from 'hooks/useUserChainSettings';

export interface SpokeFormModalProps
  extends Omit<ModalProps, 'children' | 'isOpen'>,
    Omit<SpokeFormProps, 'onSubmitSuccess' | 'navType'> {}

export const SpokeFormModal: React.FC<SpokeFormModalProps> = ({
  spokePool,
  asset,
  initialActiveTabId,
  initialCollateralTabId,
  initialLoanTabId,
  preselectedCollateral,
  collateralOnly,
  handleClose,
  ...otherProps
}) => {
  const [userChainSettings] = useUserChainSettings();

  if (
    spokePool.assets.some(({ isGated }) => isGated) &&
    !userChainSettings.doNotShowGatedAssetModal
  ) {
    return <GatedAssetAcknowledgementModal onReject={handleClose} />;
  }

  return (
    <Modal isOpen handleClose={handleClose} {...otherProps}>
      <SpokeForm
        spokePool={spokePool}
        asset={asset}
        initialActiveTabId={initialActiveTabId}
        initialCollateralTabId={initialCollateralTabId}
        initialLoanTabId={initialLoanTabId}
        preselectedCollateral={preselectedCollateral}
        collateralOnly={collateralOnly}
        onSubmitSuccess={handleClose}
      />
    </Modal>
  );
};
