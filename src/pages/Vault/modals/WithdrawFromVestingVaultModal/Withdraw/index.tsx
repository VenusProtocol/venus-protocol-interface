/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import isBefore from 'date-fns/isBefore';

import { AuthContext } from 'context/AuthContext';
import { TOKENS } from 'constants/tokens';
import { TokenId } from 'types';
import { getToken } from 'utilities';
import { useTranslation } from 'translation';
import {
  useGetXvsVaultPoolInfo,
  useGetXvsVaultWithdrawalRequests,
  useExecuteWithdrawalFromXvsVault,
} from 'clients/api';
import { ConnectWallet, Spinner } from 'components';
import TransactionForm from '../../../TransactionForm';

export interface WithdrawProps {
  stakedTokenId: TokenId;
  poolIndex: number;
}

// TODO: add tests

const Withdraw: React.FC<WithdrawProps> = ({ stakedTokenId, poolIndex }) => {
  const { account } = useContext(AuthContext);
  const stakedToken = getToken(stakedTokenId);
  const { t } = useTranslation();

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

  const {
    data: xvsVaultUserWithdrawalRequests,
    isLoading: isGetXvsVaultUserWithdrawalRequestsLoading,
  } = useGetXvsVaultWithdrawalRequests(
    {
      poolIndex,
      rewardTokenAddress: TOKENS.xvs.address,
      accountAddress: account?.address || '',
    },
    {
      enabled: !!account?.address,
    },
  );

  const withdrawableWei = useMemo(() => {
    const now = new Date();

    // Sum up withdrawal requests that are unlocked
    return (xvsVaultUserWithdrawalRequests || []).reduce(
      (acc, xvsVaultUserWithdrawalRequest) =>
        isBefore(xvsVaultUserWithdrawalRequest.unlockedAt, now)
          ? acc.plus(xvsVaultUserWithdrawalRequest.amountWei)
          : acc,
      new BigNumber(0),
    );
  }, [JSON.stringify(xvsVaultUserWithdrawalRequests)]);

  const {
    mutateAsync: executeWithdrawalFromXvsVault,
    isLoading: isExecutingWithdrawalFromXvsVault,
  } = useExecuteWithdrawalFromXvsVault({
    stakedTokenId,
  });

  const isInitialLoading =
    isGetXvsVaultPoolInfoLoading || isGetXvsVaultUserWithdrawalRequestsLoading;

  const handleSubmit = () =>
    executeWithdrawalFromXvsVault({
      poolIndex,
      // account has to be defined at this stage since we don't display the form
      // if no account is connected
      fromAccountAddress: account?.address || '',
      rewardTokenAddress: TOKENS.xvs.address,
    });

  return (
    <ConnectWallet
      message={t('withdrawFromVestingVaultModalModal.withdrawTab.enableToken.connectWalletMessage')}
    >
      {isInitialLoading || !xvsVaultPoolInfo || !xvsVaultUserWithdrawalRequests ? (
        <Spinner />
      ) : (
        <TransactionForm
          tokenId={stakedTokenId}
          availableTokensLabel={t(
            'withdrawFromVestingVaultModalModal.withdrawTab.availableTokensLabel',
            { tokenSymbol: stakedToken.symbol },
          )}
          availableTokensWei={withdrawableWei}
          submitButtonLabel={t('withdrawFromVestingVaultModalModal.withdrawTab.submitButtonLabel')}
          submitButtonDisabledLabel={t(
            'withdrawFromVestingVaultModalModal.withdrawTab.submitButtonDisabledLabel',
          )}
          successfulTransactionTitle={t(
            'withdrawFromVestingVaultModalModal.withdrawTab.successfulTransactionTitle',
          )}
          successfulTransactionDescription={t(
            'withdrawFromVestingVaultModalModal.withdrawTab.successfulTransactionDescription',
          )}
          lockingPeriodMs={xvsVaultPoolInfo?.lockingPeriodMs}
          onSubmit={handleSubmit}
          isSubmitting={isExecutingWithdrawalFromXvsVault}
        />
      )}
    </ConnectWallet>
  );
};

export default Withdraw;
