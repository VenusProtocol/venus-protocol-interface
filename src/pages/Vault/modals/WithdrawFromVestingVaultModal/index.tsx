/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';

import { getToken } from 'utilities';
import { TokenId } from 'types';
import { Tabs, Modal, IModalProps, TabContent } from 'components';
import { useTranslation } from 'translation';
import Withdraw from './Withdraw';
import RequestWithdrawal from './RequestWithdrawal';
import WithdrawalRequestList from './WithdrawalRequestList';
import { useStyles } from './styles';

export interface WithdrawFromVestingVaultModalProps {
  handleClose: IModalProps['handleClose'];
  stakedTokenId: TokenId;
  poolIndex: number;
}

// TODO: add test to check it renders without crashing

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
