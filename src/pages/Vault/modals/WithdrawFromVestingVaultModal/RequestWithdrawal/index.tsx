/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { ConnectWallet, Spinner, TextButton } from 'components';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import {
  useGetXvsVaultLockedDeposits,
  useGetXvsVaultPoolInfo,
  useGetXvsVaultUserInfo,
  useRequestWithdrawalFromXvsVault,
} from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';

import TransactionForm, { TransactionFormProps } from '../../../TransactionForm';
import { useStyles } from './styles';

export interface RequestWithdrawalUiProps {
  stakedToken: Token;
  isInitialLoading: boolean;
  requestableWei: BigNumber;
  onSubmitSuccess: () => void;
  onSubmit: TransactionFormProps['onSubmit'];
  isSubmitting: boolean;
  displayWithdrawalRequestList: () => void;
  lockingPeriodMs: number | undefined;
}

export const RequestWithdrawalUi: React.FC<RequestWithdrawalUiProps> = ({
  stakedToken,
  isInitialLoading,
  requestableWei,
  lockingPeriodMs,
  onSubmitSuccess,
  onSubmit,
  isSubmitting,
  displayWithdrawalRequestList,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const handleSubmit: TransactionFormProps['onSubmit'] = async amountWei => {
    const res = await onSubmit(amountWei);
    onSubmitSuccess();
    return res;
  };

  return (
    <>
      {isInitialLoading || !lockingPeriodMs ? (
        <Spinner />
      ) : (
        <>
          <TransactionForm
            token={stakedToken}
            availableTokensLabel={t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.availableTokensLabel',
              { tokenSymbol: stakedToken.symbol },
            )}
            availableTokensWei={requestableWei}
            submitButtonLabel={t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.submitButtonLabel',
            )}
            submitButtonDisabledLabel={t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.submitButtonDisabledLabel',
            )}
            successfulTransactionTitle={t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.successfulTransactionTitle',
            )}
            successfulTransactionDescription={t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.successfulTransactionDescription',
            )}
            lockingPeriodMs={lockingPeriodMs}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />

          <TextButton
            onClick={displayWithdrawalRequestList}
            css={styles.displayWithdrawalRequestListButton}
          >
            {t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.displayWithdrawalRequestListButton',
            )}
          </TextButton>
        </>
      )}
    </>
  );
};

export interface RequestWithdrawalProps {
  stakedToken: Token;
  poolIndex: number;
  handleClose: () => void;
  handleDisplayWithdrawalRequestList: () => void;
}

const RequestWithdrawal: React.FC<RequestWithdrawalProps> = ({
  stakedToken,
  poolIndex,
  handleDisplayWithdrawalRequestList,
  handleClose,
}) => {
  const { account } = useAuth();
  const { t } = useTranslation();

  const {
    mutateAsync: requestWithdrawalFromXvsVault,
    isLoading: isRequestingWithdrawalFromXvsVault,
  } = useRequestWithdrawalFromXvsVault();

  const {
    data: xvsVaultUserLockedDepositsData = {
      lockedDeposits: [],
    },
    isLoading: isGetXvsVaultUserLockedDepositsLoading,
  } = useGetXvsVaultLockedDeposits(
    {
      poolIndex,
      rewardTokenAddress: TOKENS.xvs.address,
      accountAddress: account?.address || '',
    },
    {
      placeholderData: {
        lockedDeposits: [],
      },
      enabled: !!account?.address,
    },
  );

  const { data: xvsVaultUserInfo, isLoading: isGetXvsVaultUserInfoLoading } =
    useGetXvsVaultUserInfo(
      {
        poolIndex,
        rewardTokenAddress: TOKENS.xvs.address,
        accountAddress: account?.address || '',
      },
      {
        enabled: !!account?.address,
      },
    );

  const requestableWei = useMemo(() => {
    if (!xvsVaultUserInfo?.stakedAmountWei) {
      return new BigNumber(0);
    }

    // Subtract sum of all active withdrawal requests amounts to amount of
    // tokens staked by user
    const pendingLockedDepositsSum = xvsVaultUserLockedDepositsData.lockedDeposits.reduce(
      (acc, xvsVaultUserLockedDeposit) => acc.plus(xvsVaultUserLockedDeposit.amountWei),
      new BigNumber(0),
    );
    return xvsVaultUserInfo.stakedAmountWei.minus(pendingLockedDepositsSum);
  }, [
    JSON.stringify(xvsVaultUserLockedDepositsData.lockedDeposits),
    JSON.stringify(xvsVaultUserInfo),
  ]);

  const { data: xvsVaultPoolInfo, isLoading: isGetXvsVaultPoolInfoLoading } =
    useGetXvsVaultPoolInfo(
      {
        poolIndex,
        rewardTokenAddress: TOKENS.xvs.address,
      },
      {
        enabled: !!account?.address,
      },
    );

  const isInitialLoading =
    isGetXvsVaultPoolInfoLoading ||
    isGetXvsVaultUserInfoLoading ||
    isGetXvsVaultUserLockedDepositsLoading;

  const handleSubmit: TransactionFormProps['onSubmit'] = async amountWei =>
    requestWithdrawalFromXvsVault({
      poolIndex,
      rewardTokenAddress: TOKENS.xvs.address,
      amountWei,
    });

  return (
    <ConnectWallet
      message={t(
        'withdrawFromVestingVaultModalModal.requestWithdrawalTab.enableToken.connectWalletMessage',
      )}
    >
      <RequestWithdrawalUi
        stakedToken={stakedToken}
        isInitialLoading={isInitialLoading}
        requestableWei={requestableWei}
        lockingPeriodMs={xvsVaultPoolInfo?.lockingPeriodMs}
        onSubmitSuccess={handleClose}
        onSubmit={handleSubmit}
        isSubmitting={isRequestingWithdrawalFromXvsVault}
        displayWithdrawalRequestList={handleDisplayWithdrawalRequestList}
      />
    </ConnectWallet>
  );
};

export default RequestWithdrawal;
