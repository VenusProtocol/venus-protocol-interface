/** @jsxImportSource @emotion/react */
import { Modal, ModalProps, Tabs } from 'components';
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import RequestWithdrawal from './RequestWithdrawal';
import Withdraw from './Withdraw';
import WithdrawalRequestList from './WithdrawalRequestList';
import { useStyles } from './styles';

export interface WithdrawFromVestingVaultModalProps {
  handleClose: ModalProps['handleClose'];
  stakedToken: Token;
  poolIndex: number;
  hasPendingWithdrawalsFromBeforeUpgrade: boolean;
}

const WithdrawFromVestingVaultModal: React.FC<WithdrawFromVestingVaultModalProps> = ({
  handleClose,
  stakedToken,
  poolIndex,
  hasPendingWithdrawalsFromBeforeUpgrade,
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

  const { t } = useTranslation();
  const styles = useStyles();

  const withdrawTabDom = (
    <div css={styles.tabContainer}>
      <Withdraw stakedToken={stakedToken} poolIndex={poolIndex} handleClose={handleClose} />
    </div>
  );

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
        <>
          {hasPendingWithdrawalsFromBeforeUpgrade ? (
            withdrawTabDom
          ) : (
            <Tabs
              initialActiveTabIndex={initialActiveTabIndex}
              tabsContent={[
                {
                  title: t('withdrawFromVestingVaultModalModal.withdrawTabTitle'),
                  content: withdrawTabDom,
                },
                {
                  title: t('withdrawFromVestingVaultModalModal.requestWithdrawalTabTitle'),
                  content: (
                    <div css={styles.tabContainer}>
                      <RequestWithdrawal
                        stakedToken={stakedToken}
                        poolIndex={poolIndex}
                        handleClose={handleClose}
                        handleDisplayWithdrawalRequestList={handleDisplayWithdrawalRequestList}
                      />
                    </div>
                  ),
                },
              ]}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default WithdrawFromVestingVaultModal;
