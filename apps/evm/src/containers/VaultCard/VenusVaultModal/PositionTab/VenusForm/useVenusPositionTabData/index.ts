import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import {
  useGetBalanceOf,
  useGetPrimeStatus,
  useGetPrimeToken,
  useGetVaiVaultUserInfo,
  useGetXvsVaultLockedDeposits,
  useGetXvsVaultUserInfo,
  useRequestWithdrawalFromXvsVault,
  useStakeInVault,
  useWithdrawFromVaiVault,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useTokenApproval from 'hooks/useTokenApproval';
import { useAccountAddress } from 'libs/wallet';
import type { VenusVault } from 'types';
import { convertMantissaToTokens, convertTokensToMantissa } from 'utilities';

import type { Approval } from 'containers/VaultCard/VaultModal/PositionTab/SubmitButton/types';
import type { ActionMode } from 'containers/VaultCard/VaultModal/PositionTab/types';
import { type FormValues, useForm } from './useForm';

export interface UseVenusPositionTabDataInput {
  vault: VenusVault;
  initialMode?: ActionMode;
  onClose?: () => void;
}

export const useVenusPositionTabData = ({
  vault,
  initialMode = 'deposit',
  onClose,
}: UseVenusPositionTabDataInput) => {
  const { accountAddress } = useAccountAddress();

  const isXvsVault = typeof vault.poolIndex === 'number';

  // --- Action mode ---
  const [actionMode, setActionMode] = useState<ActionMode>(initialMode);
  const isDeposit = actionMode === 'deposit';

  // --- Withdrawal request list display state ---
  const [shouldDisplayWithdrawalRequestList, setShouldDisplayWithdrawalRequestList] =
    useState(false);

  // --- Form state ---
  const [formValues, setFormValues] = useState<FormValues>({
    tokenAmount: '',
  });

  // Reset form when wallet or action mode changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset form on wallet or mode change only
  useEffect(() => {
    setFormValues({ tokenAmount: '' });
    setShouldDisplayWithdrawalRequestList(false);
  }, [accountAddress, actionMode]);

  // --- Balances ---
  const { data: walletBalanceData, isLoading: isWalletBalanceLoading } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token: vault.stakedToken,
    },
    { enabled: !!accountAddress },
  );

  const walletBalanceTokens = walletBalanceData
    ? convertMantissaToTokens({
        value: walletBalanceData.balanceMantissa,
        token: vault.stakedToken,
      })
    : new BigNumber(0);

  // --- XVS vault staked amount ---
  const { data: xvsVaultUserInfo, isLoading: isXvsVaultUserInfoLoading } = useGetXvsVaultUserInfo(
    {
      poolIndex: vault.poolIndex ?? 0,
      rewardTokenAddress: vault.rewardToken.address,
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress && isXvsVault,
    },
  );

  // --- VAI vault staked amount ---
  const { data: vaiVaultUserInfo, isLoading: isVaiVaultUserInfoLoading } = useGetVaiVaultUserInfo(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress && !isXvsVault,
    },
  );

  // --- Staked amount ---
  const userStakedTokens = useMemo(() => {
    if (isXvsVault && xvsVaultUserInfo) {
      return convertMantissaToTokens({
        value: xvsVaultUserInfo.stakedAmountMantissa,
        token: vault.stakedToken,
      });
    }

    if (!isXvsVault && vaiVaultUserInfo) {
      return convertMantissaToTokens({
        value: vaiVaultUserInfo.stakedVaiMantissa,
        token: vault.stakedToken,
      });
    }

    return new BigNumber(0);
  }, [isXvsVault, xvsVaultUserInfo, vaiVaultUserInfo, vault.stakedToken]);

  // --- XVS locked deposits (for withdrawal request availability) ---
  const { data: xvsLockedDepositsData } = useGetXvsVaultLockedDeposits(
    {
      poolIndex: vault.poolIndex ?? 0,
      rewardTokenAddress: vault.rewardToken.address,
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress && isXvsVault,
      placeholderData: { lockedDeposits: [] },
    },
  );

  // For XVS withdraw, requestableMantissa is staked minus pending withdrawals
  const requestableMantissa = useMemo(() => {
    if (!isXvsVault || !xvsVaultUserInfo) {
      return new BigNumber(0);
    }

    const pendingSum = (xvsLockedDepositsData?.lockedDeposits ?? []).reduce(
      (acc, deposit) => acc.plus(deposit.amountMantissa),
      new BigNumber(0),
    );

    return xvsVaultUserInfo.stakedAmountMantissa.minus(pendingSum);
  }, [isXvsVault, xvsVaultUserInfo, xvsLockedDepositsData]);

  const xvsRequestablTokens = convertMantissaToTokens({
    value: requestableMantissa,
    token: vault.stakedToken,
  });

  // --- Available tokens (what can be deposited or withdrawn) ---
  const availableTokens = useMemo(() => {
    if (isDeposit) {
      return walletBalanceTokens;
    }

    // For XVS vault withdraw, cap to requestable
    if (isXvsVault) {
      return xvsRequestablTokens;
    }

    return userStakedTokens;
  }, [isDeposit, walletBalanceTokens, isXvsVault, xvsRequestablTokens, userStakedTokens]);

  // --- Token approval (for deposit only) ---
  const { address: xvsVaultContractAddress } = useGetContractAddress({ name: 'XvsVault' });
  const { address: vaiVaultContractAddress } = useGetContractAddress({ name: 'VaiVault' });

  const spenderAddress = useMemo(() => {
    if (!isDeposit) {
      return undefined;
    }
    return isXvsVault ? xvsVaultContractAddress : vaiVaultContractAddress;
  }, [isDeposit, isXvsVault, xvsVaultContractAddress, vaiVaultContractAddress]);

  const {
    isTokenApproved,
    isApproveTokenLoading,
    walletSpendingLimitTokens,
  } = useTokenApproval({
    token: vault.stakedToken,
    spenderAddress,
    accountAddress,
  });

  // --- Prime data (XVS only) ---
  const { data: primeTokenData } = useGetPrimeToken(
    { accountAddress },
    { enabled: !!accountAddress && isXvsVault },
  );

  const { data: primeStatusData } = useGetPrimeStatus(
    { accountAddress },
    { enabled: isXvsVault },
  );

  // --- Mutations ---
  const { stake, isLoading: isStakeLoading } = useStakeInVault();

  const { mutateAsync: requestWithdrawalFromXvsVault, isPending: isRequestWithdrawLoading } =
    useRequestWithdrawalFromXvsVault({ waitForConfirmation: true });

  const { mutateAsync: withdrawFromVaiVault, isPending: isVaiWithdrawLoading } =
    useWithdrawFromVaiVault();

  const isSubmitting = isStakeLoading || isRequestWithdrawLoading || isVaiWithdrawLoading;

  // --- Submit handler ---
  async function handleOnSubmit() {
    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(formValues.tokenAmount),
      token: vault.stakedToken,
    });

    if (isDeposit) {
      await stake({
        amountMantissa,
        stakedToken: vault.stakedToken,
        rewardToken: vault.rewardToken,
        poolIndex: vault.poolIndex,
      });
    } else if (isXvsVault && typeof vault.poolIndex === 'number') {
      await requestWithdrawalFromXvsVault({
        poolIndex: vault.poolIndex,
        rewardTokenAddress: vault.rewardToken.address,
        amountMantissa: BigInt(amountMantissa.toFixed()),
      });
      setShouldDisplayWithdrawalRequestList(true);
      return; // Don't close – show withdrawal request list
    } else {
      await withdrawFromVaiVault({
        amountMantissa: BigInt(amountMantissa.toFixed()),
      });
    }

    onClose?.();
  }

  // --- Form validation ---
  const { handleSubmit, isFormValid, formError } = useForm({
    onSubmit: handleOnSubmit,
    formValues,
    setFormValues,
    availableTokens,
    token: vault.stakedToken,
  });

  // --- Approval ---
  const approval = useMemo((): Approval | undefined => {
    if (!isDeposit || !spenderAddress) {
      return undefined;
    }

    if (!isTokenApproved) {
      return {
        type: 'token',
        token: vault.stakedToken,
        spenderAddress,
      };
    }

    return undefined;
  }, [isDeposit, spenderAddress, isTokenApproved, vault.stakedToken]);

  // --- Slider ---
  const tokenDecimals = vault.stakedToken.decimals;
  const sliderPercentage =
    availableTokens.isGreaterThan(0) && Number(formValues.tokenAmount) > 0
      ? Math.min(
          100,
          new BigNumber(formValues.tokenAmount)
            .multipliedBy(100)
            .div(availableTokens)
            .dp(1)
            .toNumber(),
        )
      : 0;

  const handleSliderChange = (percentage: number) => {
    const tokenAmount = availableTokens
      .multipliedBy(percentage)
      .div(100)
      .dp(tokenDecimals)
      .toFixed();
    setFormValues(current => ({ ...current, tokenAmount }));
  };

  const handleAmountChange = (tokenAmount: string) => {
    const tokenAmountBN = new BigNumber(tokenAmount);
    setFormValues(current => ({
      ...current,
      tokenAmount:
        !tokenAmountBN.isNaN() && !tokenAmountBN.shiftedBy(tokenDecimals).isInteger()
          ? tokenAmountBN.toFixed(tokenDecimals, 1)
          : tokenAmount,
    }));
  };

  const handleMaxButtonClick = () => {
    setFormValues(current => ({
      ...current,
      tokenAmount: availableTokens.dp(tokenDecimals).toFixed(),
    }));
  };

  const handleActionModeChange = (index: number) => {
    setActionMode(index === 0 ? 'deposit' : 'withdraw');
  };

  // --- Derived submit state ---
  const isUserConnected = !!accountAddress;
  const isDataLoading =
    isWalletBalanceLoading ||
    (isXvsVault && isXvsVaultUserInfoLoading) ||
    (!isXvsVault && isVaiVaultUserInfoLoading);
  const disableInput = !isUserConnected || isSubmitting || isApproveTokenLoading || isDataLoading;
  const disableSubmit = !isFormValid || isSubmitting;

  return {
    // State
    actionMode,
    isDeposit,
    isXvsVault,
    formValues,
    accountAddress,
    isUserConnected,

    // Tokens
    userStakedTokens,
    availableTokens,
    walletBalanceTokens,
    walletSpendingLimitTokens,

    // Form
    handleSubmit,
    isFormValid,
    formError,
    approval,

    // Prime
    primeTokenData,
    primeStatusData,

    // Withdrawal requests (XVS only)
    xvsLockedDepositsData,
    shouldDisplayWithdrawalRequestList,
    setShouldDisplayWithdrawalRequestList,

    // UI state
    sliderPercentage,
    disableInput,
    disableSubmit,
    isSubmitting,
    isDataLoading,

    // Handlers
    handleAmountChange,
    handleSliderChange,
    handleMaxButtonClick,
    handleActionModeChange,
  };
};
