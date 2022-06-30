/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import isBefore from 'date-fns/isBefore';

import { AuthContext } from 'context/AuthContext';
import { TOKENS } from 'constants/tokens';
import { TokenId } from 'types';
import { getToken } from 'utilities';
import { useTranslation } from 'translation';
import { useGetXvsVaultWithdrawalRequests, useExecuteWithdrawalFromXvsVault } from 'clients/api';
import { ConnectWallet, Spinner } from 'components';
import TransactionForm from '../../../TransactionForm';

export interface WithdrawProps {
  stakedTokenId: TokenId;
  poolIndex: number;
  handleClose: () => void;
}

// TODO: add tests

const Withdraw: React.FC<WithdrawProps> = ({ stakedTokenId, poolIndex }) => {
  const { account } = useContext(AuthContext);
  const stakedToken = getToken(stakedTokenId);
  const { t } = useTranslation();

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

  const withdrawableWei = useMemo(() => {
    const now = new Date();

    // Sum up withdrawal requests that are unlocked
    return xvsVaultUserWithdrawalRequests.reduce(
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

  const isInitialLoading = isGetXvsVaultUserWithdrawalRequestsLoading;

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
      {isInitialLoading || !xvsVaultUserWithdrawalRequests ? (
        <Spinner />
      ) : (
        // TODO: refactor (the input is useless since the withdraw method
        // doesn't accept an amount as parameter and always withdraws the full
        // amount available
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
          onSubmit={handleSubmit}
          isSubmitting={isExecutingWithdrawalFromXvsVault}
        />
      )}
    </ConnectWallet>
  );
};

export default Withdraw;
