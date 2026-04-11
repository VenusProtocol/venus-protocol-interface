import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import {
  useGetPrimeStatus,
  useGetPrimeToken,
  useGetXvsVaultLockedDeposits,
  useGetXvsVaultUserInfo,
  useRequestWithdrawalFromXvsVault,
} from 'clients/api';
import { Spinner, TextButton } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { ConnectWallet } from 'containers/ConnectWallet';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Token } from 'types';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import TransactionForm, { type TransactionFormProps } from '../../../TransactionForm';

export interface RequestWithdrawalFormProps {
  poolIndex: number;
  stakedToken: Token;
  rewardToken: Token;
  lockingPeriodMs: number;
  displayWithdrawalRequestList: () => void;
}

export const RequestWithdrawalForm: React.FC<RequestWithdrawalFormProps> = ({
  poolIndex,
  stakedToken,
  rewardToken,
  lockingPeriodMs,
  displayWithdrawalRequestList,
}) => {
  const { accountAddress } = useAccountAddress();
  const { t } = useTranslation();

  const { mutateAsync: requestWithdrawalFromXvsVault, isPending: isSubmitting } =
    useRequestWithdrawalFromXvsVault({
      waitForConfirmation: true,
    });

  const {
    data: xvsVaultUserLockedDepositsData = {
      lockedDeposits: [],
    },
    isLoading: isGetXvsVaultUserLockedDepositsLoading,
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

  const { data: xvsVaultUserInfo, isLoading: isGetXvsVaultUserInfoLoading } =
    useGetXvsVaultUserInfo(
      {
        poolIndex,
        rewardTokenAddress: rewardToken.address,
        accountAddress: accountAddress || NULL_ADDRESS,
      },
      {
        enabled: !!accountAddress,
      },
    );

  const requestableMantissa = useMemo(() => {
    if (!xvsVaultUserInfo?.stakedAmountMantissa) {
      return new BigNumber(0);
    }

    // Subtract sum of all active withdrawal requests amounts to amount of
    // tokens staked by user
    const pendingLockedDepositsSum = xvsVaultUserLockedDepositsData.lockedDeposits.reduce(
      (acc, xvsVaultUserLockedDeposit) => acc.plus(xvsVaultUserLockedDeposit.amountMantissa),
      new BigNumber(0),
    );

    return xvsVaultUserInfo.stakedAmountMantissa.minus(pendingLockedDepositsSum);
  }, [xvsVaultUserLockedDepositsData, xvsVaultUserInfo]);

  const { data: getPrimeTokenData, isLoading: isGetPrimeTokenLoading } = useGetPrimeToken({
    accountAddress,
  });
  const { data: getPrimeStatusData, isLoading: isGetPrimeStatusLoading } = useGetPrimeStatus({
    accountAddress,
  });

  const readablePrimeMinimumXvsStake = useConvertMantissaToReadableTokenString({
    value: getPrimeStatusData?.primeMinimumStakedXvsMantissa,
    token: stakedToken,
  });

  const warning: TransactionFormProps['warning'] = useMemo(() => {
    const shouldDisplayPrimeWarning =
      getPrimeTokenData?.exists &&
      !getPrimeTokenData?.isIrrevocable &&
      getPrimeStatusData?.xvsVaultPoolId === poolIndex;

    if (!shouldDisplayPrimeWarning || !xvsVaultUserInfo) {
      return undefined;
    }

    const primeLossDeltaMantissa = xvsVaultUserInfo.stakedAmountMantissa
      .minus(xvsVaultUserInfo.pendingWithdrawalsTotalAmountMantissa)
      .minus(getPrimeStatusData.primeMinimumStakedXvsMantissa);

    const primeLossDeltaTokens = convertMantissaToTokens({
      value: primeLossDeltaMantissa,
      token: stakedToken,
    });

    return {
      amountTokens: primeLossDeltaTokens,
      message: t(
        'requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.primeLossWarning.message',
        {
          minimumXvsStake: readablePrimeMinimumXvsStake,
        },
      ),
      submitButtonLabel: t(
        'requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.primeLossWarning.submitButtonLabel',
      ),
    };
  }, [
    getPrimeTokenData,
    getPrimeStatusData,
    xvsVaultUserInfo,
    stakedToken,
    poolIndex,
    readablePrimeMinimumXvsStake,
    t,
  ]);

  const isInitialLoading =
    isGetXvsVaultUserInfoLoading ||
    isGetXvsVaultUserLockedDepositsLoading ||
    isGetPrimeTokenLoading ||
    isGetPrimeStatusLoading;

  const handleSubmit: TransactionFormProps['onSubmit'] = async amountMantissa => {
    await requestWithdrawalFromXvsVault({
      poolIndex,
      rewardTokenAddress: rewardToken.address,
      amountMantissa: BigInt(amountMantissa.toFixed()),
    });

    displayWithdrawalRequestList();
  };

  return (
    <ConnectWallet
      analyticVariant="vesting_vault_request_withdrawal_modal"
      message={t(
        'requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.approveToken.connectWalletMessage',
      )}
    >
      <>
        {isInitialLoading ? (
          <Spinner />
        ) : (
          <>
            <TransactionForm
              token={stakedToken}
              warning={warning}
              availableTokensLabel={t(
                'requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.availableTokensLabel',
                { tokenSymbol: stakedToken.symbol },
              )}
              availableTokensMantissa={requestableMantissa}
              submitButtonLabel={t(
                'requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.submitButtonLabel',
              )}
              submitButtonDisabledLabel={t(
                'requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.submitButtonDisabledLabel',
              )}
              lockingPeriodMs={lockingPeriodMs}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />

            <TextButton onClick={displayWithdrawalRequestList} className="mt-1 py-3 w-full">
              {t(
                'requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.displayWithdrawalRequestListButton',
              )}
            </TextButton>
          </>
        )}
      </>
    </ConnectWallet>
  );
};
