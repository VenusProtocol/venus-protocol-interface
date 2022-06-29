/** @jsxImportSource @emotion/react */
import React from 'react';

import { getToken } from 'utilities';
import { TokenId } from 'types';
import { Tabs, Modal, IModalProps, TabContent } from 'components';
import { useTranslation } from 'translation';
import { useStyles } from './styles';

export interface WithdrawFromVestingVaultModalProps {
  handleClose: IModalProps['handleClose'];
  stakedTokenId: TokenId;
}

const WithdrawFromVestingVaultModal: React.FC<WithdrawFromVestingVaultModalProps> = ({
  handleClose,
  stakedTokenId,
}) => {
  const stakedToken = getToken(stakedTokenId);
  const { t } = useTranslation();
  const styles = useStyles();

  const tabsContent: TabContent[] = [
    {
      title: t('withdrawFromVestingVaultModalModal.withdrawTabTitle'),
      content: <div css={styles.tabContainer}>Withdraw</div>,
    },
    {
      title: t('withdrawFromVestingVaultModalModal.requestWithdrawalTabTitle'),
      content: <div css={styles.tabContainer}>Request</div>,
    },
  ];

  return (
    <Modal
      isOpen
      title={t('withdrawFromVestingVaultModalModal.title', {
        tokenSymbol: stakedToken.symbol,
      })}
      handleClose={handleClose}
    >
      <Tabs tabsContent={tabsContent} />
    </Modal>
  );
};

export default WithdrawFromVestingVaultModal;
