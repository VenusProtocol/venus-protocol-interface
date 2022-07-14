/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { ConnectWallet, LabeledInlineContent, PrimaryButton, Spinner } from 'components';
import isBefore from 'date-fns/isBefore';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { getToken } from 'utilities';

import { useExecuteWithdrawalFromXvsVault, useGetXvsVaultLockedDeposits } from 'clients/api';
import TEST_IDS from 'constants/testIds';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';

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
    <>
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
    </>
  );
};

export interface WithdrawProps {
  stakedTokenId: TokenId;
  poolIndex: number;
  handleClose: () => void;
}

const Withdraw: React.FC<WithdrawProps> = ({ stakedTokenId, poolIndex, handleClose }) => {
  const { t } = useTranslation();
  const { account } = useContext(AuthContext);

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

  const withdrawableWei = useMemo(() => {
    const now = new Date();

    return xvsVaultUserLockedDeposits.reduce(
      (acc, xvsVaultUserLockedDeposit) =>
        isBefore(xvsVaultUserLockedDeposit.unlockedAt, now)
          ? acc.plus(xvsVaultUserLockedDeposit.amountWei)
          : acc,
      new BigNumber(0),
    );
  }, [JSON.stringify(xvsVaultUserLockedDeposits)]);

  const {
    mutateAsync: executeWithdrawalFromXvsVault,
    isLoading: isExecutingWithdrawalFromXvsVault,
  } = useExecuteWithdrawalFromXvsVault({
    stakedTokenId,
  });

  const handleSubmit = () =>
    executeWithdrawalFromXvsVault({
      poolIndex,
      // account is always defined at this stage since we don't display the form
      // if no account is connected
      fromAccountAddress: account?.address || '',
      rewardTokenAddress: TOKENS.xvs.address,
    });

  return (
    <ConnectWallet
      message={t('withdrawFromVestingVaultModalModal.withdrawTab.enableToken.connectWalletMessage')}
    >
      <WithdrawUi
        stakedTokenId={stakedTokenId}
        isInitialLoading={isGetXvsVaultUserLockedDepositsLoading}
        isSubmitting={isExecutingWithdrawalFromXvsVault}
        withdrawableWei={withdrawableWei}
        onSubmit={handleSubmit}
        onSubmitSuccess={handleClose}
      />
    </ConnectWallet>
  );
};

export default Withdraw;
