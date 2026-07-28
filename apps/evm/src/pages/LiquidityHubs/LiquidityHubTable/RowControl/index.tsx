import { useState } from 'react';

import { TableRowControl, type TableRowControlProps } from 'components';
import { LiquidityHubFormModal } from 'containers/LiquidityHubFormModal';
import type { VhToken } from 'types';

export interface RowControlProps extends Omit<TableRowControlProps, 'onClick'> {
  vhToken: VhToken;
}

export const RowControl: React.FC<RowControlProps> = ({ vhToken, ...otherProps }) => {
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

      {isModalOpen && <LiquidityHubFormModal vhToken={vhToken} handleClose={handleCloseModal} />}
    </>
  );
};
