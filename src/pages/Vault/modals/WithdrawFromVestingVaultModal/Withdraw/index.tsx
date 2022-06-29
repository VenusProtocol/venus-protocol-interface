/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';

import { AuthContext } from 'context/AuthContext';
import { TOKENS } from 'constants/tokens';
import { TokenId } from 'types';
import { getToken } from 'utilities';
import { useTranslation } from 'translation';
import { useGetXvsVaultPoolInfo } from 'clients/api';
import { ConnectWallet, Spinner } from 'components';
import TransactionForm from '../../../TransactionForm';

export interface WithdrawProps {
  stakedTokenId: TokenId;
  poolIndex: number;
}

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

  const isInitialLoading = isGetXvsVaultPoolInfoLoading;

  // TODO: fetch
  const availableTokensWei = new BigNumber(1000);

  // TODO: call mutation
  const handleSubmit = () => {};

  return (
    <ConnectWallet
      message={t('withdrawFromVestingVaultModalModal.withdrawTab.enableToken.connectWalletMessage')}
    >
      {isInitialLoading || !xvsVaultPoolInfo ? (
        <Spinner />
      ) : (
        <TransactionForm
          tokenId={stakedTokenId}
          availableTokensLabel={t(
            'withdrawFromVestingVaultModalModal.withdrawTab.availableTokensLabel',
            { tokenSymbol: stakedToken.symbol },
          )}
          availableTokensWei={availableTokensWei}
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
          isSubmitting={false}
        />
      )}
    </ConnectWallet>
  );
};

export default Withdraw;
