/** @jsxImportSource @emotion/react */
import { Announcement, Modal, ModalProps, TabContent, Tabs, TokenIconWithSymbol } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { VToken } from 'types';
import { isTokenEnabled } from 'utilities';

import Borrow from './Borrow';
import Repay from './Repay';
import { useStyles } from './styles';

export interface BorrowRepayProps {
  onClose: ModalProps['handleClose'];
  vToken: VToken;
  poolComptrollerAddress: string;
}

const BorrowRepay: React.FC<BorrowRepayProps> = ({ onClose, vToken, poolComptrollerAddress }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const tabsContent: TabContent[] = [
    {
      title: t('borrowRepayModal.repayTabTitle'),
      content: (
        <div css={styles.container}>
          <Repay
            vToken={vToken}
            poolComptrollerAddress={poolComptrollerAddress}
            onClose={onClose}
          />
        </div>
      ),
    },
  ];

  if (isTokenEnabled(vToken.underlyingToken)) {
    tabsContent.unshift({
      title: t('borrowRepayModal.borrowTabTitle'),
      content: (
        <div css={styles.container}>
          <Borrow
            vToken={vToken}
            poolComptrollerAddress={poolComptrollerAddress}
            onClose={onClose}
          />
        </div>
      ),
    });
  }

  return (
    <Modal
      isOpen
      title={<TokenIconWithSymbol token={vToken.underlyingToken} variant="h4" />}
      handleClose={onClose}
    >
      <>
        <Announcement token={vToken.underlyingToken} />

        <Tabs tabsContent={tabsContent} />
      </>
    </Modal>
  );
};

export default BorrowRepay;
