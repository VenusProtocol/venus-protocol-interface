/** @jsxImportSource @emotion/react */
import { Modal, ModalProps, TabContent, Tabs, TokenIconWithSymbol } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { isAssetEnabled } from 'utilities';

import { TOKENS } from 'constants/tokens';

import Announcement from '../Announcement';
import { useStyles } from '../styles';
import Borrow from './Borrow';
import Repay from './Repay';

export interface BorrowRepayProps {
  onClose: ModalProps['handleClose'];
  isXvsEnabled: boolean;
  asset: Asset;
}

const BorrowRepay: React.FC<BorrowRepayProps> = ({ onClose, asset, isXvsEnabled }) => {
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

  // Prevent user from being able to borrow a disabled token
  if (
    isAssetEnabled(asset.token.id) &&
    // Temporarily disable borrowing BUSD
    asset.token.address.toLowerCase() !== TOKENS.busd.address.toLowerCase()
  ) {
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
    <Modal
      isOpen
      title={<TokenIconWithSymbol token={asset.token} variant="h4" />}
      handleClose={onClose}
    >
      <>
        <Announcement token={asset.token} />

        <Tabs tabsContent={tabsContent} />
      </>
    </Modal>
  );
};

export default BorrowRepay;
