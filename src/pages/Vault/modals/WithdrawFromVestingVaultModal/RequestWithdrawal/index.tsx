/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { ConnectWallet, Spinner, TextButton } from 'components';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { getToken } from 'utilities';

import {
  useGetXvsVaultLockedDeposits,
  useGetXvsVaultPoolInfo,
  useGetXvsVaultUserInfo,
  useRequestWithdrawalFromXvsVault,
} from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';

import TransactionForm, { TransactionFormProps } from '../../../TransactionForm';
import { useStyles } from './styles';

export interface RequestWithdrawalUiProps {
  stakedTokenId: TokenId;
  isInitialLoading: boolean;
  requestableWei: BigNumber;
  onSubmitSuccess: () => void;
  onSubmit: TransactionFormProps['onSubmit'];
  isSubmitting: boolean;
  displayWithdrawalRequestList: () => void;
  lockingPeriodMs: number | undefined;
}

export const RequestWithdrawalUi: React.FC<RequestWithdrawalUiProps> = ({
  stakedTokenId,
  isInitialLoading,
  requestableWei,
  lockingPeriodMs,
  onSubmitSuccess,
  onSubmit,
  isSubmitting,
  displayWithdrawalRequestList,
}) => {
  const stakedToken = getToken(stakedTokenId);
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
            tokenId={stakedTokenId}
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
  stakedTokenId: TokenId;
  poolIndex: number;
  handleClose: () => void;
  handleDisplayWithdrawalRequestList: () => void;
}

const RequestWithdrawal: React.FC<RequestWithdrawalProps> = ({
  stakedTokenId,
  poolIndex,
  handleDisplayWithdrawalRequestList,
  handleClose,
}) => {
  const { account } = useContext(AuthContext);
  const { t } = useTranslation();

  const {
    mutateAsync: requestWithdrawalFromXvsVault,
    isLoading: isRequestingWithdrawalFromXvsVault,
  } = useRequestWithdrawalFromXvsVault();

  const {
    data: xvsVaultUserLockedDeposits = [],
    isLoading: isGetXvsVaultUserLockedDepositsLoading,
  } = useGetXvsVaultLockedDeposits(
    {
      poolIndex,
      rewardTokenAddress: TOKENS.xvs.address,
      accountAddress: account?.address || '',
    },
    {
      placeholderData: [],
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
    const pendingLockedDepositsSum = xvsVaultUserLockedDeposits.reduce(
      (acc, xvsVaultUserLockedDeposit) => acc.plus(xvsVaultUserLockedDeposit.amountWei),
      new BigNumber(0),
    );
    return xvsVaultUserInfo.stakedAmountWei.minus(pendingLockedDepositsSum);
  }, [JSON.stringify(xvsVaultUserLockedDeposits), JSON.stringify(xvsVaultUserInfo)]);

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
      // account is always defined at this stage since we don't display the form
      // if no account is connected
      fromAccountAddress: account?.address || '',
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
        stakedTokenId={stakedTokenId}
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
