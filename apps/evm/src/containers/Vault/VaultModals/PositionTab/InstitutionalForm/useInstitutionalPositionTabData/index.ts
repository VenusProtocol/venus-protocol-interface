import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import {
  useDepositToInstitutionalVault,
  useGetBalanceOf,
  useWithdrawFromInstitutionalVault,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import useTokenApproval from 'hooks/useTokenApproval';
import { useAccountAddress } from 'libs/wallet';
import { type InstitutionalVault, VaultStatus } from 'types';
import { convertMantissaToTokens, convertTokensToMantissa } from 'utilities';

import type { Approval } from '../../SubmitButton/types';
import { type FormValues, useForm } from './useForm';

export type DisplayMode = 'deposit' | 'claim' | 'info' | 'refund';

const getDisplayMode = (status: VaultStatus): DisplayMode => {
  if (status === VaultStatus.Claim) return 'claim';
  if (status === VaultStatus.Refund) return 'refund';
  if (
    status === VaultStatus.Earning ||
    status === VaultStatus.Pending ||
    status === VaultStatus.Repaying
  ) {
    return 'info';
  }
  return 'deposit';
};

export interface UseInstitutionalPositionTabInput {
  vault: InstitutionalVault;
  onClose?: () => void;
}

export const useInstitutionalPositionTabData = ({
  vault,
  onClose,
}: UseInstitutionalPositionTabInput) => {
  const { accountAddress } = useAccountAddress();

  // --- Display mode derived from vault status ---
  const displayMode = getDisplayMode(vault.status);

  const isStake = displayMode === 'deposit';

  // --- Deposit window check ---
  const isDepositWindowClosed = useMemo(() => {
    return vault.status !== VaultStatus.Deposit;
  }, [vault.status]);

  // --- Form state (deposit mode only) ---
  const initialFormValues: FormValues = useMemo(
    () => ({ tokenAmount: '', fromToken: vault.stakedToken }),
    [vault.stakedToken],
  );

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  // Reset form when wallet disconnects
  // biome-ignore lint/correctness/useExhaustiveDependencies: also watch for wallet connect/disconnect
  useEffect(() => {
    setFormValues(initialFormValues);
  }, [accountAddress, initialFormValues]);

  // --- T&Cs state (deposit mode only) ---
  const [tcsAccepted, setTcsAccepted] = useState(false);

  // --- User staked (needed for all display modes) ---
  const userStakedTokens = useMemo(() => {
    if (!vault.userStakedMantissa) {
      return new BigNumber(0);
    }
    return convertMantissaToTokens({
      value: vault.userStakedMantissa,
      token: vault.stakedToken,
    });
  }, [vault.userStakedMantissa, vault.stakedToken]);

  // --- Balances (deposit mode only) ---
  const { data: balanceData, isLoading: isBalanceLoading } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token: vault.stakedToken,
    },
    { enabled: !!accountAddress && isStake },
  );

  const walletBalanceTokens = useMemo(() => {
    if (!balanceData) {
      return new BigNumber(0);
    }
    return convertMantissaToTokens({
      value: balanceData.balanceMantissa,
      token: vault.stakedToken,
    });
  }, [balanceData, vault.stakedToken]);

  // --- Max deposit capacity (deposit mode only) ---
  const maxDepositCapacityTokens = useMemo(() => {
    const remaining = vault.maxDepositedMantissa.minus(vault.totalDepositedMantissa);
    if (remaining.isLessThanOrEqualTo(0)) {
      return new BigNumber(0);
    }
    return convertMantissaToTokens({
      value: remaining,
      token: vault.stakedToken,
    });
  }, [vault.maxDepositedMantissa, vault.totalDepositedMantissa, vault.stakedToken]);

  // --- Min request tokens (deposit mode only) ---
  const minRequestTokens = useMemo(
    () =>
      convertMantissaToTokens({
        value: vault.minRequestMantissa,
        token: vault.stakedToken,
      }),
    [vault.minRequestMantissa, vault.stakedToken],
  );

  // --- Token approval (deposit mode only) ---
  const spenderAddress = isStake && vault.vaultAddress ? vault.vaultAddress : undefined;

  const {
    isTokenApproved: isFromTokenApproved,
    isApproveTokenLoading: isApproveFromTokenLoading,
    walletSpendingLimitTokens: fromTokenWalletSpendingLimitTokens,
  } = useTokenApproval({
    token: vault.stakedToken,
    spenderAddress,
    accountAddress,
  });

  // --- Available tokens (deposit mode only) ---
  const availableTokens = useMemo(() => {
    if (!isStake) {
      return userStakedTokens;
    }

    let tokens = walletBalanceTokens;

    if (fromTokenWalletSpendingLimitTokens?.isGreaterThan(0)) {
      tokens = BigNumber.min(tokens, fromTokenWalletSpendingLimitTokens);
    }

    if (maxDepositCapacityTokens.isGreaterThan(0)) {
      tokens = BigNumber.min(tokens, maxDepositCapacityTokens);
    }

    return tokens;
  }, [
    isStake,
    walletBalanceTokens,
    userStakedTokens,
    fromTokenWalletSpendingLimitTokens,
    maxDepositCapacityTokens,
  ]);

  // --- Mutation hooks ---
  const vaultAddress = vault.vaultAddress ?? NULL_ADDRESS;

  const { mutateAsync: depositToInstitutionalVault, isPending: isDepositing } =
    useDepositToInstitutionalVault({ vaultAddress });

  const { mutateAsync: withdrawFromInstitutionalVault, isPending: isWithdrawing } =
    useWithdrawFromInstitutionalVault({ vaultAddress });

  // --- Submit handler (deposit mode) ---
  async function handleOnSubmit() {
    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(formValues.tokenAmount),
      token: vault.stakedToken,
    });
    await depositToInstitutionalVault({ amountMantissa });
    onClose?.();
  }

  // --- Form validation (deposit mode only) ---
  const { handleSubmit, isFormValid, formError } = useForm({
    onSubmit: handleOnSubmit,
    formValues,
    setFormValues,
    availableTokens,
    token: vault.stakedToken,
    maxDepositCapacityTokens,
    minRequestTokens,
    isDepositWindowClosed,
    isStake,
  });

  // --- Approval (deposit mode only) ---
  const approval = useMemo((): Approval | undefined => {
    if (isStake && spenderAddress && !isFromTokenApproved) {
      return {
        type: 'token',
        token: vault.stakedToken,
        spenderAddress,
      };
    }

    return undefined;
  }, [isStake, spenderAddress, isFromTokenApproved, vault.stakedToken]);

  // --- Slider (deposit mode only) ---
  const availableTokenDecimals = vault.stakedToken.decimals;

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
      .dp(availableTokenDecimals)
      .toFixed();
    setFormValues(current => ({ ...current, tokenAmount }));
  };

  const handleAmountChange = (tokenAmount: string) => {
    const tokenAmountBN = new BigNumber(tokenAmount);
    setFormValues(current => ({
      ...current,
      tokenAmount:
        !tokenAmountBN.isNaN() && !tokenAmountBN.shiftedBy(availableTokenDecimals).isInteger()
          ? tokenAmountBN.toFixed(availableTokenDecimals, 1)
          : tokenAmount,
    }));
  };

  const handleMaxButtonClick = () => {
    setFormValues(current => ({
      ...current,
      tokenAmount: availableTokens.dp(availableTokenDecimals).toFixed(),
    }));
  };

  // --- Claim handler ---
  const handleWithdraw = async () => {
    if (vault.userStakedMantissa) {
      await withdrawFromInstitutionalVault({ amountMantissa: vault.userStakedMantissa });
    }
    onClose?.();
  };

  // --- Refund handler ---
  const handleRefund = async () => {
    if (vault.userStakedMantissa) {
      await withdrawFromInstitutionalVault({ amountMantissa: vault.userStakedMantissa });
    }
    onClose?.();
  };

  // --- Derived submit state ---
  const isUserConnected = !!accountAddress;
  const isSubmitting = isDepositing || isWithdrawing;
  const disableInput =
    !isUserConnected || isSubmitting || isApproveFromTokenLoading || isBalanceLoading;
  const disableSubmit = !isFormValid || isSubmitting || !tcsAccepted;

  return {
    // Display mode
    displayMode,
    isStake,

    // Form state (deposit mode)
    formValues,
    accountAddress,
    isUserConnected,
    tcsAccepted,
    setTcsAccepted,
    isDepositWindowClosed,

    // Tokens
    userStakedTokens,
    availableTokens,
    maxDepositCapacityTokens,
    minRequestTokens,

    // Form (deposit mode)
    handleSubmit,
    isFormValid,
    formError,
    approval,

    // UI state (deposit mode)
    sliderPercentage,
    disableInput,
    disableSubmit,
    isSubmitting,

    // Handlers
    handleAmountChange,
    handleSliderChange,
    handleMaxButtonClick,
    handleWithdraw,
    handleRefund,
  };
};
