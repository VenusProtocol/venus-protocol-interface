/** @jsxImportSource @emotion/react */
import React from 'react';

import { Asset } from 'types';
import { Tabs, Modal, IModalProps, Token } from 'components';
import { useTranslation } from 'translation';
import Borrow from './Borrow';

export interface IBorrowRepayProps {
  onClose: IModalProps['handleClose'];
  asset: Asset;
}

const BorrowRepay: React.FC<IBorrowRepayProps> = ({ onClose, asset }) => {
  const { t } = useTranslation();

  const tabsContent = [
    {
      title: t('borrowRepayModal.borrowTabTitle'),
      content: <Borrow asset={asset} />,
    },
    { title: t('borrowRepayModal.repayTabTitle'), content: <>Repay</> },
  ];

  return (
    <Modal isOpened title={<Token symbol={asset.id} variant="h4" />} handleClose={onClose}>
      <Tabs tabsContent={tabsContent} />
    </Modal>
  );
};

export default BorrowRepay;
