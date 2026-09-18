import { Modal, type ModalProps } from 'components';
import { SpokeForm, type SpokeFormProps } from 'containers/SpokeForm';

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
  handleClose,
  ...otherProps
}) => (
  <Modal isOpen handleClose={handleClose} {...otherProps}>
    <SpokeForm
      spokePool={spokePool}
      asset={asset}
      initialActiveTabId={initialActiveTabId}
      initialCollateralTabId={initialCollateralTabId}
      initialLoanTabId={initialLoanTabId}
      preselectedCollateral={preselectedCollateral}
      onSubmitSuccess={handleClose}
    />
  </Modal>
);
