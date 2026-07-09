import { useState } from 'react';

import { TableRowControl, type TableRowControlProps } from 'components';
import type { LiquidityHub } from 'types';
import { OperationModal } from './OperationModal';

export interface RowControlProps extends Omit<TableRowControlProps, 'onClick'> {
  liquidityHub: LiquidityHub;
}

export const RowControl: React.FC<RowControlProps> = ({ liquidityHub, ...otherProps }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => setIsModalOpen(false);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsModalOpen(true);
  };

  return (
    <>
      <TableRowControl onClick={onClick} {...otherProps} />

      {isModalOpen && <OperationModal liquidityHub={liquidityHub} handleClose={handleCloseModal} />}
    </>
  );
};
