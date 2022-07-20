/** @jsxImportSource @emotion/react */
import { Modal, ModalProps, TabContent, Tabs } from 'components';
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { getToken } from 'utilities';

import RequestWithdrawal from './RequestWithdrawal';
import Withdraw from './Withdraw';
import WithdrawalRequestList from './WithdrawalRequestList';
import { useStyles } from './styles';

export interface WithdrawFromVestingVaultModalProps {
  handleClose: ModalProps['handleClose'];
  stakedTokenId: TokenId;
  poolIndex: number;
}

const WithdrawFromVestingVaultModal: React.FC<WithdrawFromVestingVaultModalProps> = ({
  handleClose,
  stakedTokenId,
  poolIndex,
}) => {
  const [initialActiveTabIndex, setInitialActiveTabIndex] = useState(0);
  const [shouldDisplayWithdrawalRequestList, setShouldDisplayWithdrawalRequestList] =
    useState(false);

  const handleDisplayWithdrawalRequestList = () => {
    // Display withdrawal request list
    setShouldDisplayWithdrawalRequestList(true);
    // Set initial active tab index to 1 so that if user clicks on modal back button
    // they get redirect to the "Request withdrawal" tab
    setInitialActiveTabIndex(1);
  };

  const stakedToken = getToken(stakedTokenId);
  const { t } = useTranslation();
  const styles = useStyles();

  const tabsContent: TabContent[] = [
    {
      title: t('withdrawFromVestingVaultModalModal.withdrawTabTitle'),
      content: (
        <div css={styles.tabContainer}>
          <Withdraw stakedTokenId={stakedTokenId} poolIndex={poolIndex} handleClose={handleClose} />
        </div>
      ),
    },
    {
      title: t('withdrawFromVestingVaultModalModal.requestWithdrawalTabTitle'),
      content: (
        <div css={styles.tabContainer}>
          <RequestWithdrawal
            stakedTokenId={stakedTokenId}
            poolIndex={poolIndex}
            handleClose={handleClose}
            handleDisplayWithdrawalRequestList={handleDisplayWithdrawalRequestList}
          />
        </div>
      ),
    },
  ];

  return (
    <Modal
      isOpen
      title={
        shouldDisplayWithdrawalRequestList
          ? t('withdrawFromVestingVaultModalModal.withdrawalRequestListTitle')
          : t('withdrawFromVestingVaultModalModal.title', {
              tokenSymbol: stakedToken.symbol,
            })
      }
      handleBackAction={
        shouldDisplayWithdrawalRequestList
          ? () => setShouldDisplayWithdrawalRequestList(false)
          : undefined
      }
      handleClose={handleClose}
    >
      {shouldDisplayWithdrawalRequestList ? (
        <WithdrawalRequestList poolIndex={poolIndex} />
      ) : (
        <Tabs initialActiveTabIndex={initialActiveTabIndex} tabsContent={tabsContent} />
      )}
    </Modal>
  );
};

export default WithdrawFromVestingVaultModal;
