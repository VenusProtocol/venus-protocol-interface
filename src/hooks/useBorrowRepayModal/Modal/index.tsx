/** @jsxImportSource @emotion/react */
import { Modal, ModalProps, TabContent, Tabs, TokenIconWithSymbol } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';
import { isTokenEnabled } from 'utilities';

import Borrow from './Borrow';
import Repay from './Repay';
import { useStyles } from './styles';

export interface BorrowRepayProps {
  onClose: ModalProps['handleClose'];
  includeXvs: boolean;
  token: Token;
  vToken: Token;
}

const BorrowRepay: React.FC<BorrowRepayProps> = ({ onClose, token, vToken, includeXvs }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const tabsContent: TabContent[] = [
    {
      title: t('borrowRepayModal.repayTabTitle'),
      content: (
        <div css={styles.container}>
          <Repay token={token} vToken={vToken} onClose={onClose} includeXvs={includeXvs} />
        </div>
      ),
    },
  ];

  if (isTokenEnabled(token)) {
    tabsContent.unshift({
      title: t('borrowRepayModal.borrowTabTitle'),
      content: (
        <div css={styles.container}>
          <Borrow token={token} vToken={vToken} onClose={onClose} includeXvs={includeXvs} />
        </div>
      ),
    });
  }

  return (
    <Modal isOpen title={<TokenIconWithSymbol token={token} variant="h4" />} handleClose={onClose}>
      <Tabs tabsContent={tabsContent} />
    </Modal>
  );
};

export default BorrowRepay;
