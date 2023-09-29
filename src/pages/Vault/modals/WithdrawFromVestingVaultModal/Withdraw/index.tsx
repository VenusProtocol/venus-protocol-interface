/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { ConnectWallet, LabeledInlineContent, PrimaryButton, Spinner } from 'components';
import isBefore from 'date-fns/isBefore';
import { useGetToken } from 'packages/tokens';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { useExecuteWithdrawalFromXvsVault, useGetXvsVaultLockedDeposits } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

export interface WithdrawUiProps {
  stakedToken: Token;
  isInitialLoading: boolean;
  onSubmitSuccess: () => void;
  onSubmit: () => Promise<unknown>;
  isSubmitting: boolean;
  withdrawableWei?: BigNumber;
}

const WithdrawUi: React.FC<WithdrawUiProps> = ({
  stakedToken,
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

  const readableWithdrawableTokens = useConvertWeiToReadableTokenString({
    valueWei: withdrawableWei,
    token: stakedToken,
  });

  return (
    <>
      {isInitialLoading || !withdrawableWei ? (
        <Spinner />
      ) : (
        <>
          <LabeledInlineContent
            css={styles.content}
            iconSrc={stakedToken}
            data-testid={TEST_IDS.availableTokens}
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
  stakedToken: Token;
  poolIndex: number;
  handleClose: () => void;
}

const Withdraw: React.FC<WithdrawProps> = ({ stakedToken, poolIndex, handleClose }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAuth();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const {
    data: xvsVaultUserLockedDepositsData = {
      lockedDeposits: [],
    },
    isLoading: isGetXvsVaultUserLockedDepositsLoading,
  } = useGetXvsVaultLockedDeposits(
    {
      poolIndex,
      rewardTokenAddress: xvs!.address,
      accountAddress: accountAddress || '',
    },
    {
      placeholderData: {
        lockedDeposits: [],
      },
      enabled: !!accountAddress,
    },
  );

  const withdrawableWei = useMemo(() => {
    const now = new Date();

    return xvsVaultUserLockedDepositsData.lockedDeposits.reduce(
      (acc, xvsVaultUserLockedDeposit) =>
        isBefore(xvsVaultUserLockedDeposit.unlockedAt, now)
          ? acc.plus(xvsVaultUserLockedDeposit.amountWei)
          : acc,
      new BigNumber(0),
    );
  }, [JSON.stringify(xvsVaultUserLockedDepositsData.lockedDeposits)]);

  const {
    mutateAsync: executeWithdrawalFromXvsVault,
    isLoading: isExecutingWithdrawalFromXvsVault,
  } = useExecuteWithdrawalFromXvsVault({
    stakedToken,
  });

  const handleSubmit = () =>
    executeWithdrawalFromXvsVault({
      poolIndex,
      rewardTokenAddress: xvs!.address,
    });

  return (
    <ConnectWallet
      message={t(
        'withdrawFromVestingVaultModalModal.withdrawTab.approveToken.connectWalletMessage',
      )}
    >
      <WithdrawUi
        stakedToken={stakedToken}
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
