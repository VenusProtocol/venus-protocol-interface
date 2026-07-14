import { Modal, type ModalProps } from 'components';
import type { LiquidityHub } from 'types';

export interface OperationModalProps extends Omit<ModalProps, 'children' | 'isOpen'> {
  liquidityHub: LiquidityHub;
}

export const OperationModal: React.FC<OperationModalProps> = ({ ...otherProps }) => (
  <Modal isOpen {...otherProps}>
    {/* TODO: add content */}
    <div>Add content here</div>
  </Modal>
);
