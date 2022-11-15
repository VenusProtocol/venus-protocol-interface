/** @jsxImportSource @emotion/react */
import { Modal, ModalProps, TabContent, Tabs, TokenIconWithSymbol } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { isAssetEnabled } from 'utilities';

import Borrow from './Borrow';
import Repay from './Repay';
import { useStyles } from './styles';

export interface BorrowRepayProps {
  onClose: ModalProps['handleClose'];
  includeXvs: boolean;
  asset: Asset;
}

const BorrowRepay: React.FC<BorrowRepayProps> = ({ onClose, asset, includeXvs }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const tabsContent: TabContent[] = [
    {
      title: t('borrowRepayModal.repayTabTitle'),
      content: (
        <div css={styles.container}>
          <Repay asset={asset} onClose={onClose} includeXvs={includeXvs} />
        </div>
      ),
    },
  ];

  if (isAssetEnabled(asset.token.id)) {
    tabsContent.unshift({
      title: t('borrowRepayModal.borrowTabTitle'),
      content: (
        <div css={styles.container}>
          <Borrow asset={asset} onClose={onClose} includeXvs={includeXvs} />
        </div>
      ),
    });
  }

  return (
    <Modal
      isOpen
      title={<TokenIconWithSymbol token={asset.token} variant="h4" />}
      handleClose={onClose}
    >
      <Tabs tabsContent={tabsContent} />
    </Modal>
  );
};

export default BorrowRepay;
