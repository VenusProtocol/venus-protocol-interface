/** @jsxImportSource @emotion/react */
import React from 'react';

import { Asset } from 'types';
import { isAssetEnabled } from 'utilities';
import { Tabs, Modal, IModalProps, Token, TabContent } from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../styles';
import Borrow from './Borrow';
import Repay from './Repay';

export interface IBorrowRepayProps {
  onClose: IModalProps['handleClose'];
  isXvsEnabled: boolean;
  asset: Asset;
}

const BorrowRepay: React.FC<IBorrowRepayProps> = ({ onClose, asset, isXvsEnabled }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const tabsContent: TabContent[] = [
    {
      title: t('borrowRepayModal.repayTabTitle'),
      content: (
        <div css={styles.container}>
          <Repay asset={asset} onClose={onClose} isXvsEnabled={isXvsEnabled} />
        </div>
      ),
    },
  ];

  if (isAssetEnabled(asset.id)) {
    tabsContent.unshift({
      title: t('borrowRepayModal.borrowTabTitle'),
      content: (
        <div css={styles.container}>
          <Borrow asset={asset} onClose={onClose} isXvsEnabled={isXvsEnabled} />
        </div>
      ),
    });
  }

  return (
    <Modal isOpen title={<Token tokenId={asset.id} variant="h4" />} handleClose={onClose}>
      <Tabs tabsContent={tabsContent} />
    </Modal>
  );
};

export default BorrowRepay;
