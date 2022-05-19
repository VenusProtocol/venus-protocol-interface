/** @jsxImportSource @emotion/react */
import React from 'react';

import { Asset } from 'types';
import { Tabs, Modal, IModalProps, Token } from 'components';
import { ITab } from 'components/v2/Tabs';
import { useTranslation } from 'translation';
import { isFeatureEnabledForAsset } from 'utilities/flags';
import { notBoolean } from 'utilities/common';
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

  const tabsContent: ITab[] = [
    isFeatureEnabledForAsset(asset.id) && {
      title: t('borrowRepayModal.borrowTabTitle'),
      content: (
        <div css={styles.container}>
          <Borrow asset={asset} onClose={onClose} isXvsEnabled={isXvsEnabled} />
        </div>
      ),
    },
    {
      title: t('borrowRepayModal.repayTabTitle'),
      content: (
        <div css={styles.container}>
          <Repay asset={asset} onClose={onClose} isXvsEnabled={isXvsEnabled} />
        </div>
      ),
    },
  ].filter(notBoolean);

  return (
    <Modal isOpened title={<Token symbol={asset.id} variant="h4" />} handleClose={onClose}>
      <Tabs tabsContent={tabsContent} />
    </Modal>
  );
};

export default BorrowRepay;
