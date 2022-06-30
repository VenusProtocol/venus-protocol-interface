/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { AuthContext } from 'context/AuthContext';
import { TOKENS } from 'constants/tokens';
import { TokenId } from 'types';
import { getToken } from 'utilities';
import { useTranslation } from 'translation';
import {
  useGetXvsVaultPoolInfo,
  useGetXvsVaultUserInfo,
  useRequestWithdrawalFromXvsVault,
  useGetXvsVaultWithdrawalRequests,
} from 'clients/api';
import { ConnectWallet, Spinner, TextButton } from 'components';
import TransactionForm, { ITransactionFormProps } from '../../../TransactionForm';
import { useStyles } from './styles';

export interface RequestWithdrawalProps {
  stakedTokenId: TokenId;
  poolIndex: number;
  handleClose: () => void;
  handleDisplayWithdrawalRequestList: () => void;
}

// TODO: add tests

const RequestWithdrawal: React.FC<RequestWithdrawalProps> = ({
  stakedTokenId,
  poolIndex,
  handleDisplayWithdrawalRequestList,
}) => {
  const { account } = useContext(AuthContext);
  const stakedToken = getToken(stakedTokenId);
  const { t } = useTranslation();
  const styles = useStyles();

  const {
    mutateAsync: requestWithdrawalFromXvsVault,
    isLoading: isRequestingWithdrawalFromXvsVault,
  } = useRequestWithdrawalFromXvsVault();

  const {
    data: xvsVaultUserWithdrawalRequests = [],
    isLoading: isGetXvsVaultUserWithdrawalRequestsLoading,
  } = useGetXvsVaultWithdrawalRequests(
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

    // Subtract sum of all pending withdrawal requests amounts to amount of
    // tokens staked by user
    const pendingWithdrawalRequestsSum = xvsVaultUserWithdrawalRequests.reduce(
      (acc, xvsVaultUserWithdrawalRequest) => acc.plus(xvsVaultUserWithdrawalRequest.amountWei),
      new BigNumber(0),
    );
    return xvsVaultUserInfo.stakedAmountWei.minus(pendingWithdrawalRequestsSum);
  }, [JSON.stringify(xvsVaultUserWithdrawalRequests), JSON.stringify(xvsVaultUserInfo)]);

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
    isGetXvsVaultUserWithdrawalRequestsLoading;

  const handleSubmit: ITransactionFormProps['onSubmit'] = amountWei =>
    requestWithdrawalFromXvsVault({
      poolIndex,
      // account has to be defined at this stage since we don't display the form
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
      {isInitialLoading || !xvsVaultPoolInfo || !xvsVaultUserInfo ? (
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
            lockingPeriodMs={xvsVaultPoolInfo.lockingPeriodMs}
            onSubmit={handleSubmit}
            isSubmitting={isRequestingWithdrawalFromXvsVault}
          />

          <TextButton
            onClick={handleDisplayWithdrawalRequestList}
            css={styles.displayWithdrawalRequestListButton}
          >
            {t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.displayWithdrawalRequestListButton',
            )}
          </TextButton>
        </>
      )}
    </ConnectWallet>
  );
};

export default RequestWithdrawal;
