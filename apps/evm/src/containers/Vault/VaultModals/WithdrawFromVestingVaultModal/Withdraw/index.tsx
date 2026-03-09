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

import { NULL_ADDRESS } from 'constants/address';
import { SwitchChain } from 'containers/SwitchChain';
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

  const handleSubmit = async () => {
    await onSubmit();

    onSubmitSuccess();
  };

  const readableWithdrawableTokens = useConvertMantissaToReadableTokenString({
    value: withdrawableMantissa,
    token: stakedToken,
  });

  const hasWithdrawableTokens = !!withdrawableMantissa && withdrawableMantissa.isGreaterThan(0);

  let submitDom = (
    <PrimaryButton
      type="submit"
      onClick={handleSubmit}
      loading={isSubmitting}
      disabled={!hasWithdrawableTokens}
      className="w-full"
    >
      {t('withdrawFromVestingVaultModalModal.withdrawTab.submitButton')}
    </PrimaryButton>
  );

  if (hasWithdrawableTokens) {
    submitDom = <SwitchChain>{submitDom}</SwitchChain>;
  }

  return (
    <>
      {isInitialLoading || !withdrawableMantissa ? (
        <Spinner />
      ) : (
        <div className="space-y-6">
          <LabeledInlineContent
            iconSrc={stakedToken}
            data-testid={TEST_IDS.availableTokens}
            label={t('withdrawFromVestingVaultModalModal.withdrawTab.availableTokens', {
              tokenSymbol: stakedToken.symbol,
            })}
          >
            {readableWithdrawableTokens}
          </LabeledInlineContent>

          {submitDom}
        </div>
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
      accountAddress: accountAddress || NULL_ADDRESS,
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
      analyticVariant="vesting_vault_withdraw_modal"
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
