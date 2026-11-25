import { ActiveTabPathProvider, Modal, type ModalProps } from 'components';
import { LiquidityHubForm } from 'containers/LiquidityHubForm';
import type { VhToken } from 'types';

export interface LiquidityHubFormModalProps extends Omit<ModalProps, 'children' | 'isOpen'> {
  vhToken: VhToken;
}

export const LiquidityHubFormModal: React.FC<LiquidityHubFormModalProps> = ({
  vhToken,
  handleClose,
  ...otherProps
}) => (
  <ActiveTabPathProvider>
    <Modal isOpen handleClose={handleClose} {...otherProps}>
      <LiquidityHubForm vhToken={vhToken} onSubmitSuccess={handleClose} />
    </Modal>
  </ActiveTabPathProvider>
);
