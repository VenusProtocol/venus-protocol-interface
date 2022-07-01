/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import isBefore from 'date-fns/isBefore';

import TEST_IDS from 'constants/testIds';
import { AuthContext } from 'context/AuthContext';
import { TOKENS } from 'constants/tokens';
import { TokenId } from 'types';
import { getToken } from 'utilities';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import { useTranslation } from 'translation';
import { useGetXvsVaultWithdrawalRequests, useExecuteWithdrawalFromXvsVault } from 'clients/api';
import { ConnectWallet, Spinner, LabeledInlineContent, PrimaryButton } from 'components';
import { useStyles } from './styles';

export interface WithdrawUiProps {
  stakedTokenId: TokenId;
  isInitialLoading: boolean;
  onSubmitSuccess: () => void;
  onSubmit: () => Promise<unknown>;
  isSubmitting: boolean;
  withdrawableWei?: BigNumber;
}

const WithdrawUi: React.FC<WithdrawUiProps> = ({
  stakedTokenId,
  isInitialLoading,
  onSubmit,
  onSubmitSuccess,
  isSubmitting,
  withdrawableWei,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const handleSubmit = async () => {
    await onSubmit();

    onSubmitSuccess();
  };

  const stakedToken = getToken(stakedTokenId);

  const readableWithdrawableTokens = useConvertWeiToReadableTokenString({
    valueWei: withdrawableWei,
    tokenId: stakedTokenId,
    minimizeDecimals: true,
  });

  return (
    <ConnectWallet
      message={t('withdrawFromVestingVaultModalModal.withdrawTab.enableToken.connectWalletMessage')}
    >
      {isInitialLoading || !withdrawableWei ? (
        <Spinner />
      ) : (
        <>
          <LabeledInlineContent
            css={styles.content}
            iconName={stakedTokenId}
            data-testid={TEST_IDS.vault.vaultItem.withdrawFromVestingVaultModal.availableTokens}
            label={t('withdrawFromVestingVaultModalModal.withdrawTab.availableTokens', {
              tokenSymbol: stakedToken.symbol,
            })}
          >
            {readableWithdrawableTokens}
          </LabeledInlineContent>

          <PrimaryButton
            type="submit"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={withdrawableWei.isEqualTo(0)}
            fullWidth
          >
            {t('withdrawFromVestingVaultModalModal.withdrawTab.submitButton')}
          </PrimaryButton>
        </>
      )}
    </ConnectWallet>
  );
};

export interface WithdrawProps {
  stakedTokenId: TokenId;
  poolIndex: number;
  handleClose: () => void;
}

const Withdraw: React.FC<WithdrawProps> = ({ stakedTokenId, poolIndex, handleClose }) => {
  const { account } = useContext(AuthContext);

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

  const handleSubmit = () =>
    executeWithdrawalFromXvsVault({
      poolIndex,
      // account has to be defined at this stage since we don't display the form
      // if no account is connected
      fromAccountAddress: account?.address || '',
      rewardTokenAddress: TOKENS.xvs.address,
    });

  return (
    <WithdrawUi
      stakedTokenId={stakedTokenId}
      isInitialLoading={isGetXvsVaultUserWithdrawalRequestsLoading}
      isSubmitting={isExecutingWithdrawalFromXvsVault}
      withdrawableWei={withdrawableWei}
      onSubmit={handleSubmit}
      onSubmitSuccess={handleClose}
    />
  );
};

export default Withdraw;
