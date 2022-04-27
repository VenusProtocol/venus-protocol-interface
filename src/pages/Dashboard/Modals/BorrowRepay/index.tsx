/** @jsxImportSource @emotion/react */
import React from 'react';

import { Asset } from 'types';
import { Tabs, Modal, IModalProps, Token } from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../styles';
import Borrow from './Borrow';

export interface IBorrowRepayProps {
  onClose: IModalProps['handleClose'];
  asset: Asset;
}

const BorrowRepay: React.FC<IBorrowRepayProps> = ({ onClose, asset }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const tabsContent = [
    {
      title: t('borrowRepayModal.borrowTabTitle'),
      content: (
        <div css={styles.container}>
          <Borrow asset={asset} onClose={onClose} />
        </div>
      ),
    },
    {
      title: t('borrowRepayModal.repayTabTitle'),
      content: (
        <div css={styles.container}>
          <>Repay</>
        </div>
      ),
    },
  ];

  return (
    <Modal isOpened title={<Token symbol={asset.id} variant="h4" />} handleClose={onClose}>
      <Tabs tabsContent={tabsContent} />
    </Modal>
  );
};

export default BorrowRepay;
