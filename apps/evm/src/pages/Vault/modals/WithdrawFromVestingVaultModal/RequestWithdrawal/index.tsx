/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useMemo } from 'react';

import {
  useGetPrimeStatus,
  useGetPrimeToken,
  useGetXvsVaultLockedDeposits,
  useGetXvsVaultPoolInfo,
  useGetXvsVaultUserInfo,
  useRequestWithdrawalFromXvsVault,
} from 'clients/api';
import { Spinner, TextButton } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { Token } from 'types';
import { convertMantissaToTokens } from 'utilities';

import TransactionForm, { TransactionFormProps } from '../../../TransactionForm';
import { useStyles as useSharedStyles } from '../styles';

export interface RequestWithdrawalUiProps {
  stakedToken: Token;
  isInitialLoading: boolean;
  requestableMantissa: BigNumber;
  onSubmitSuccess: () => void;
  onSubmit: TransactionFormProps['onSubmit'];
  warning: TransactionFormProps['warning'];
  isSubmitting: boolean;
  displayWithdrawalRequestList: () => void;
  lockingPeriodMs: number | undefined;
}

export const RequestWithdrawalUi: React.FC<RequestWithdrawalUiProps> = ({
  stakedToken,
  isInitialLoading,
  requestableMantissa,
  lockingPeriodMs,
  onSubmitSuccess,
  onSubmit,
  isSubmitting,
  displayWithdrawalRequestList,
  warning,
}) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();

  const handleSubmit: TransactionFormProps['onSubmit'] = async amountMantissa => {
    const res = await onSubmit(amountMantissa);
    onSubmitSuccess();
    return res;
  };

  return (
    <>
      {isInitialLoading || !lockingPeriodMs ? (
        <Spinner />
      ) : (
        <>
          <TransactionForm
            token={stakedToken}
            warning={warning}
            availableTokensLabel={t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.availableTokensLabel',
              { tokenSymbol: stakedToken.symbol },
            )}
            availableTokensMantissa={requestableMantissa}
            submitButtonLabel={t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.submitButtonLabel',
            )}
            submitButtonDisabledLabel={t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.submitButtonDisabledLabel',
            )}
            lockingPeriodMs={lockingPeriodMs}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />

          <TextButton
            onClick={displayWithdrawalRequestList}
            css={sharedStyles.displayWithdrawalRequestListButton}
            className="w-full"
          >
            {t(
              'withdrawFromVestingVaultModalModal.requestWithdrawalTab.displayWithdrawalRequestListButton',
            )}
          </TextButton>
        </>
      )}
    </>
  );
};

export interface RequestWithdrawalProps {
  stakedToken: Token;
  poolIndex: number;
  handleClose: () => void;
  handleDisplayWithdrawalRequestList: () => void;
}

const RequestWithdrawal: React.FC<RequestWithdrawalProps> = ({
  stakedToken,
  poolIndex,
  handleDisplayWithdrawalRequestList,
  handleClose,
}) => {
  const { accountAddress } = useAccountAddress();
  const { t } = useTranslation();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const {
    mutateAsync: requestWithdrawalFromXvsVault,
    isLoading: isRequestingWithdrawalFromXvsVault,
  } = useRequestWithdrawalFromXvsVault();

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

  const { data: xvsVaultUserInfo, isLoading: isGetXvsVaultUserInfoLoading } =
    useGetXvsVaultUserInfo(
      {
        poolIndex,
        rewardTokenAddress: xvs!.address,
        accountAddress: accountAddress || '',
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

  const { data: xvsVaultPoolInfo, isLoading: isGetXvsVaultPoolInfoLoading } =
    useGetXvsVaultPoolInfo(
      {
        poolIndex,
        rewardTokenAddress: xvs!.address,
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { data: getPrimeTokenData, isLoading: isGetPrimeTokenLoading } = useGetPrimeToken({
    accountAddress,
  });
  const { data: getPrimeStatusData, isLoading: isGetPrimeStatusLoading } = useGetPrimeStatus({
    accountAddress,
  });

  const readablePrimeMinimumXvsStake = useConvertMantissaToReadableTokenString({
    value: getPrimeStatusData?.primeMinimumStakedXvsMantissa,
    token: xvs,
  });

  const warning: TransactionFormProps['warning'] = useMemo(() => {
    const shouldDisplayPrimeWarning =
      getPrimeTokenData?.exists &&
      !getPrimeTokenData?.isIrrevocable &&
      getPrimeStatusData?.xvsVaultPoolId === poolIndex;

    if (!shouldDisplayPrimeWarning || !xvsVaultUserInfo) {
      return undefined;
    }

    const primeLossDeltaWei = xvsVaultUserInfo.stakedAmountMantissa.minus(
      getPrimeStatusData.primeMinimumStakedXvsMantissa,
    );
    const primeLossDeltaTokens = convertMantissaToTokens({
      value: primeLossDeltaWei,
      token: xvs,
    });

    return {
      amountTokens: primeLossDeltaTokens,
      message: t(
        'withdrawFromVestingVaultModalModal.requestWithdrawalTab.primeLossWarning.message',
        {
          minimumXvsStake: readablePrimeMinimumXvsStake,
        },
      ),
      submitButtonLabel: t(
        'withdrawFromVestingVaultModalModal.requestWithdrawalTab.primeLossWarning.submitButtonLabel',
      ),
    };
  }, [
    getPrimeTokenData,
    getPrimeStatusData,
    xvsVaultUserInfo,
    xvs,
    poolIndex,
    readablePrimeMinimumXvsStake,
    t,
  ]);

  const isInitialLoading =
    isGetXvsVaultPoolInfoLoading ||
    isGetXvsVaultUserInfoLoading ||
    isGetXvsVaultUserLockedDepositsLoading ||
    isGetPrimeTokenLoading ||
    isGetPrimeStatusLoading;

  const handleSubmit: TransactionFormProps['onSubmit'] = async amountMantissa =>
    requestWithdrawalFromXvsVault({
      poolIndex,
      rewardTokenAddress: xvs!.address,
      amountMantissa,
    });

  return (
    <ConnectWallet
      message={t(
        'withdrawFromVestingVaultModalModal.requestWithdrawalTab.approveToken.connectWalletMessage',
      )}
    >
      <RequestWithdrawalUi
        stakedToken={stakedToken}
        isInitialLoading={isInitialLoading}
        requestableMantissa={requestableMantissa}
        lockingPeriodMs={xvsVaultPoolInfo?.lockingPeriodMs}
        onSubmitSuccess={handleClose}
        onSubmit={handleSubmit}
        isSubmitting={isRequestingWithdrawalFromXvsVault}
        displayWithdrawalRequestList={handleDisplayWithdrawalRequestList}
        warning={warning}
      />
    </ConnectWallet>
  );
};

export default RequestWithdrawal;
