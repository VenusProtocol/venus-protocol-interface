/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { isBefore } from 'date-fns/isBefore';
import { useMemo } from 'react';

import { useExecuteWithdrawalFromXvsVault, useGetXvsVaultLockedDeposits } from 'clients/api';
import { LabeledInlineContent, PrimaryButton, Spinner } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Token } from 'types';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

export interface WithdrawUiProps {
  stakedToken: Token;
  isInitialLoading: boolean;
  onSubmitSuccess: () => void;
  onSubmit: () => Promise<unknown>;
  isSubmitting: boolean;
  withdrawableMantissa?: BigNumber;
}

const WithdrawUi: React.FC<WithdrawUiProps> = ({
  stakedToken,
  isInitialLoading,
  onSubmit,
  onSubmitSuccess,
  isSubmitting,
  withdrawableMantissa,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const handleSubmit = async () => {
    await onSubmit();

    onSubmitSuccess();
  };

  const readableWithdrawableTokens = useConvertMantissaToReadableTokenString({
    value: withdrawableMantissa,
    token: stakedToken,
  });

  return (
    <>
      {isInitialLoading || !withdrawableMantissa ? (
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
            disabled={withdrawableMantissa.isEqualTo(0)}
            className="w-full"
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
  const { accountAddress } = useAccountAddress();

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

  const withdrawableMantissa = useMemo(() => {
    const now = new Date();

    return xvsVaultUserLockedDepositsData.lockedDeposits.reduce(
      (acc, xvsVaultUserLockedDeposit) =>
        isBefore(xvsVaultUserLockedDeposit.unlockedAt, now)
          ? acc.plus(xvsVaultUserLockedDeposit.amountMantissa)
          : acc,
      new BigNumber(0),
    );
  }, [xvsVaultUserLockedDepositsData]);

  const {
    mutateAsync: executeWithdrawalFromXvsVault,
    isPending: isExecutingWithdrawalFromXvsVault,
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
        withdrawableMantissa={withdrawableMantissa}
        onSubmit={handleSubmit}
        onSubmitSuccess={handleClose}
      />
    </ConnectWallet>
  );
};

export default Withdraw;
