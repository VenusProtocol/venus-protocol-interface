import { isBefore } from 'date-fns/isBefore';

import { useExecuteWithdrawalFromXvsVault, useGetXvsVaultLockedDeposits } from 'clients/api';
import { Icon, LabeledInlineContent, PrimaryButton, Spinner } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { ConnectWallet } from 'containers/ConnectWallet';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { LockedDeposit, Token } from 'types';
import { convertMantissaToTokens } from 'utilities';

export interface WithdrawalRequestListProps {
  poolIndex: number;
  stakedToken: Token;
  rewardToken: Token;
  onClose: () => void;
  hideWithdrawalRequestList: () => void;
}

export const WithdrawalRequestList: React.FC<WithdrawalRequestListProps> = ({
  poolIndex,
  stakedToken,
  rewardToken,
  onClose,
  hideWithdrawalRequestList,
}) => {
  const { accountAddress } = useAccountAddress();
  const { t } = useTranslation();
  const now = useNow();

  const {
    data: userLockedDepositsData = {
      lockedDeposits: [],
    },
    isLoading: isGetXvsVaultUserLockedDepositsLoading,
    error: getXvsVaultUserLockedDepositsError,
  } = useGetXvsVaultLockedDeposits(
    {
      poolIndex,
      rewardTokenAddress: rewardToken.address,
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      placeholderData: {
        lockedDeposits: [],
      },
      enabled: !!accountAddress,
    },
  );

  const {
    mutateAsync: executeWithdrawalFromXvsVault,
    isPending: isExecutingWithdrawalFromXvsVault,
  } = useExecuteWithdrawalFromXvsVault({
    stakedToken,
  });

  const handleSubmit = async () => {
    await executeWithdrawalFromXvsVault({
      poolIndex,
      rewardTokenAddress: rewardToken.address,
    });

    onClose();
  };

  const hasWithdrawableBalance = userLockedDepositsData.lockedDeposits.some(lockedDeposit =>
    isBefore(lockedDeposit.unlockedAt, now),
  );

  return (
    <div className="flex flex-col gap-y-6">
      <div className="relative">
        <button
          type="button"
          className="absolute left-0 top-[50%] -translate-y-[50%] cursor-pointer transition-colors text-light-grey hover:text-white"
          onClick={hideWithdrawalRequestList}
        >
          <Icon className="rotate-180 size-5 text-inherit" name="arrowRight" />
        </button>

        <p className="text-p2s text-center">
          {t('requestWithdrawalFromVestingVaultForm.withdrawalRequestList.title')}
        </p>
      </div>

      <ConnectWallet
        analyticVariant="vesting_vault_withdrawal_requests_modal"
        message={t(
          'requestWithdrawalFromVestingVaultForm.withdrawalRequestList.approveToken.connectWalletMessage',
        )}
      >
        {isGetXvsVaultUserLockedDepositsLoading || getXvsVaultUserLockedDepositsError ? (
          <Spinner />
        ) : userLockedDepositsData.lockedDeposits.length === 0 ? (
          <p className="text-b1r text-center text-light-grey">
            {t('requestWithdrawalFromVestingVaultForm.withdrawalRequestList.emptyState')}
          </p>
        ) : (
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-3">
              {userLockedDepositsData.lockedDeposits.map((userLockedDeposit: LockedDeposit) => (
                <LabeledInlineContent
                  iconSrc={stakedToken}
                  key={`withdrawal-request-list-item-${userLockedDeposit.unlockedAt.getTime()}`}
                  invertTextColors
                  label={convertMantissaToTokens({
                    value: userLockedDeposit.amountMantissa,
                    token: stakedToken,
                    returnInReadableFormat: true,
                  })}
                >
                  {isBefore(userLockedDeposit.unlockedAt, now) ? (
                    <span className="text-white">
                      {t('requestWithdrawalFromVestingVaultForm.withdrawalRequestList.unlocked')}
                    </span>
                  ) : (
                    t('requestWithdrawalFromVestingVaultForm.withdrawalRequestList.locked', {
                      date: userLockedDeposit.unlockedAt,
                    })
                  )}
                </LabeledInlineContent>
              ))}
            </div>

            <PrimaryButton
              onClick={handleSubmit}
              loading={isExecutingWithdrawalFromXvsVault}
              disabled={!hasWithdrawableBalance}
              className="w-full"
            >
              {t('requestWithdrawalFromVestingVaultForm.withdrawalRequestList.withdrawButtonLabel')}
            </PrimaryButton>
          </div>
        )}
      </ConnectWallet>
    </div>
  );
};
