import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import {
  useGetPrimeStatus,
  useGetPrimeToken,
  useGetXvsVaultLockedDeposits,
  useGetXvsVaultUserInfo,
  useRequestWithdrawalFromXvsVault,
} from 'clients/api';
import { InfoIcon, NoticeWarning, Spinner, TextButton } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { Footer } from 'containers/VaultCard/VenusVaultModal/Footer';
import { useForm } from 'containers/VaultCard/useForm';
import { isBefore } from 'date-fns/isBefore';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { VenusVault } from 'types';
import { convertTokensToMantissa } from 'utilities';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import { TransactionForm } from '../../../../TransactionForm';

export interface RequestWithdrawalFormProps {
  vault: VenusVault;
  displayWithdrawalRequestList: () => void;
}

export const RequestWithdrawalForm: React.FC<RequestWithdrawalFormProps> = ({
  vault,
  displayWithdrawalRequestList,
}) => {
  const { accountAddress } = useAccountAddress();
  const { t } = useTranslation();

  const now = useNow();

  const { mutateAsync: requestWithdrawalFromXvsVault } = useRequestWithdrawalFromXvsVault({
    waitForConfirmation: true,
  });

  const poolIndex = vault.poolIndex || 0;

  const {
    data: xvsVaultUserLockedDepositsData = {
      lockedDeposits: [],
    },
    isLoading: isGetXvsVaultUserLockedDepositsLoading,
  } = useGetXvsVaultLockedDeposits(
    {
      poolIndex,
      rewardTokenAddress: vault.rewardToken.address,
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      placeholderData: {
        lockedDeposits: [],
      },
      enabled: !!accountAddress,
    },
  );

  const { data: xvsVaultUserInfo, isLoading: isGetXvsVaultUserInfoLoading } =
    useGetXvsVaultUserInfo(
      {
        poolIndex,
        rewardTokenAddress: vault.rewardToken.address,
        accountAddress: accountAddress || NULL_ADDRESS,
      },
      {
        enabled: !!accountAddress,
      },
    );

  let requestableAmountMantissa = new BigNumber(xvsVaultUserInfo?.stakedAmountMantissa || 0);
  let userHasUnlockedDeposits = false;

  // Subtract sum of all active withdrawal requests amounts to amount of
  // tokens staked by user
  xvsVaultUserLockedDepositsData.lockedDeposits.forEach(lockedDeposit => {
    requestableAmountMantissa = requestableAmountMantissa.minus(lockedDeposit.amountMantissa);

    if (isBefore(lockedDeposit.unlockedAt, now)) {
      userHasUnlockedDeposits = true;
    }
  });

  const { data: getPrimeTokenData, isLoading: isGetPrimeTokenLoading } = useGetPrimeToken({
    accountAddress,
  });
  const { data: getPrimeStatusData, isLoading: isGetPrimeStatusLoading } = useGetPrimeStatus({
    accountAddress,
  });

  const limitFromTokens = convertMantissaToTokens({
    value: requestableAmountMantissa,
    token: vault.stakedToken,
  });

  const form = useForm({
    limitFromTokens,
  });

  const fromAmountTokensFieldValue = form.watch('fromAmountTokens');
  const fromAmountTokens = new BigNumber(fromAmountTokensFieldValue || 0);

  const readablePrimeMinimumXvsStake = useConvertMantissaToReadableTokenString({
    value: getPrimeStatusData?.primeMinimumStakedXvsMantissa,
    token: vault.stakedToken,
  });

  const warning = useMemo(() => {
    const shouldDisplayPrimeWarning =
      getPrimeTokenData?.exists &&
      !getPrimeTokenData?.isIrrevocable &&
      getPrimeStatusData?.xvsVaultPoolId === poolIndex &&
      fromAmountTokens.isGreaterThan(0);

    if (!shouldDisplayPrimeWarning || !xvsVaultUserInfo) {
      return undefined;
    }

    const primeLossDeltaMantissa = xvsVaultUserInfo.stakedAmountMantissa
      .minus(xvsVaultUserInfo.pendingWithdrawalsTotalAmountMantissa)
      .minus(getPrimeStatusData.primeMinimumStakedXvsMantissa);

    const primeLossDeltaTokens = convertMantissaToTokens({
      value: primeLossDeltaMantissa,
      token: vault.stakedToken,
    });

    if (fromAmountTokens.isGreaterThanOrEqualTo(primeLossDeltaTokens)) {
      return t(
        'vaultCard.vaultModal.requestWithdrawalFromVestingVaultForm.primeLossWarning.message',
        {
          minimumXvsStake: readablePrimeMinimumXvsStake,
        },
      );
    }
  }, [
    getPrimeTokenData,
    getPrimeStatusData,
    xvsVaultUserInfo,
    vault.stakedToken,
    fromAmountTokens,
    poolIndex,
    readablePrimeMinimumXvsStake,
    t,
  ]);

  const isInitialLoading =
    isGetXvsVaultUserInfoLoading ||
    isGetXvsVaultUserLockedDepositsLoading ||
    isGetPrimeTokenLoading ||
    isGetPrimeStatusLoading;

  const handleSubmit = async () => {
    const amountMantissa = convertTokensToMantissa({
      value: fromAmountTokens,
      token: vault.stakedToken,
    });

    // Send request to withdraw
    const res = await requestWithdrawalFromXvsVault({
      poolIndex,
      rewardTokenAddress: vault.rewardToken.address,
      amountMantissa: BigInt(amountMantissa.toFixed()),
    });

    displayWithdrawalRequestList();

    return res;
  };

  return (
    <div className="flex flex-col gap-y-1">
      {isInitialLoading ? (
        <Spinner />
      ) : (
        <TransactionForm
          onSubmit={handleSubmit}
          fromToken={vault.stakedToken}
          form={form}
          limitFromTokens={limitFromTokens}
          fromTokenFieldLabel={t(
            'vaultCard.vaultModal.requestWithdrawalFromVestingVaultForm.requestWithdrawalField.label',
          )}
          submitButtonLabel={t(
            'vaultCard.vaultModal.requestWithdrawalFromVestingVaultForm.submitButton.label',
          )}
          fromTokenPriceCents={vault.stakedTokenPriceCents.toNumber()}
          footer={
            <div className="flex flex-col gap-y-4">
              <Footer action="withdraw" vault={vault} fromAmountTokens={fromAmountTokens} />

              {!!warning && <NoticeWarning description={warning} />}
            </div>
          }
        />
      )}

      {!!accountAddress && (
        <TextButton
          onClick={displayWithdrawalRequestList}
          className={cn('py-3 w-full', userHasUnlockedDeposits && 'text-yellow')}
        >
          <div className="flex items-center gap-x-1">
            {t(
              'vaultCard.vaultModal.requestWithdrawalFromVestingVaultForm.displayWithdrawalRequestListButton.label',
            )}

            {userHasUnlockedDeposits && (
              <InfoIcon
                className="text-inherit"
                tooltip={t(
                  'vaultCard.vaultModal.requestWithdrawalFromVestingVaultForm.displayWithdrawalRequestListButton.tooltip',
                )}
              />
            )}
          </div>
        </TextButton>
      )}
    </div>
  );
};
