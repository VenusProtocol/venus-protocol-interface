/** @jsxImportSource @emotion/react */
import { useState } from 'react';

import { Modal, type ModalProps, Tabs, TextButton } from 'components';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

import RequestWithdrawal from './RequestWithdrawal';
import Withdraw from './Withdraw';
import WithdrawalRequestList from './WithdrawalRequestList';
import { useStyles } from './styles';

export interface WithdrawFromVestingVaultModalProps {
  handleClose: ModalProps['handleClose'];
  stakedToken: Token;
  poolIndex: number;
  userHasPendingWithdrawalsFromBeforeUpgrade: boolean;
}

const WithdrawFromVestingVaultModal: React.FC<WithdrawFromVestingVaultModalProps> = ({
  handleClose,
  stakedToken,
  poolIndex,
  userHasPendingWithdrawalsFromBeforeUpgrade,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const [shouldDisplayWithdrawalRequestList, setShouldDisplayWithdrawalRequestList] =
    useState(false);

  const handleDisplayWithdrawalRequestList = () => {
    // Display withdrawal request list
    setShouldDisplayWithdrawalRequestList(true);
    // Set initial active tab index to 1 so that if user clicks on modal back button
    // they get redirect to the "Request withdrawal" tab
    setInitialActiveTabId(tabs[1].id);
  };

  const tabs: Tab[] = [
    {
      id: 'withdraw',
      title: t('withdrawFromVestingVaultModalModal.withdrawTabTitle'),
      content: (
        <div css={styles.tabContainer}>
          <Withdraw stakedToken={stakedToken} poolIndex={poolIndex} handleClose={handleClose} />
        </div>
      ),
    },
    {
      id: 'request-withdrawal',
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
  ];

  const [initialActiveTabId, setInitialActiveTabId] = useState(tabs[0].id);

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
          {userHasPendingWithdrawalsFromBeforeUpgrade ? (
            <>
              <div css={styles.tabContainer}>
                <Withdraw
                  stakedToken={stakedToken}
                  poolIndex={poolIndex}
                  handleClose={handleClose}
                />

                <TextButton
                  onClick={handleDisplayWithdrawalRequestList}
                  css={styles.displayWithdrawalRequestListButton}
                  className="w-full"
                >
                  {t('withdrawFromVestingVaultModalModal.displayWithdrawalRequestListButton')}
                </TextButton>
              </div>
            </>
          ) : (
            <Tabs initialActiveTabId={initialActiveTabId} tabs={tabs} />
          )}
        </>
      )}
    </Modal>
  );
};

export default WithdrawFromVestingVaultModal;
