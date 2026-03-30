import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import {
  useGetBalanceOf,
  useGetPendleSwapQuote,
  useGetTokenUsdPrice,
  useGetVTokenBalance,
  usePendlePtVaultDeposit,
  usePendlePtVaultWithdraw,
  useWithdraw,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { useNow } from 'hooks/useNow';
import useTokenApproval from 'hooks/useTokenApproval';
import { useAccountAddress } from 'libs/wallet';
import { type PendleVault, VaultManager } from 'types';
import { convertMantissaToTokens, convertTokensToMantissa } from 'utilities';

import type { Approval } from './SubmitButton/types';
import useForm, { type FormValues } from './useForm';

type ActionMode = 'deposit' | 'withdraw' | 'redeemAtMaturity';

export interface UsePositionTabInput {
  vault: PendleVault;
  initialMode?: ActionMode;
  onClose?: () => void;
}

const usePositionTab = ({ vault, initialMode = 'deposit', onClose }: UsePositionTabInput) => {
  const now = useNow();
  const { accountAddress } = useAccountAddress();

  const hasMatured = vault.maturityDate && now.getTime() > vault.maturityDate.getTime();

  // --- Action mode ---
  const forceActionMode = useMemo<ActionMode | undefined>(() => {
    if (vault.manager === VaultManager.Pendle && hasMatured) {
      return 'redeemAtMaturity';
    }
    return undefined;
  }, [vault.manager, hasMatured]);

  const [actionMode, setActionMode] = useState<ActionMode>(forceActionMode ?? initialMode);

  useEffect(() => {
    if (forceActionMode) {
      setActionMode(forceActionMode);
    }
  }, [forceActionMode]);

  const isStake = actionMode === 'deposit';

  // --- Form state ---
  const initialFormValues: FormValues = useMemo(
    () => ({ tokenAmount: '', fromToken: isStake ? vault.rewardToken : vault.stakedToken }),
    [isStake, vault.rewardToken, vault.stakedToken],
  );

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  // Reset form when wallet disconnects or action mode changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: also watch for wallet connect/disconnect
  useEffect(() => {
    setFormValues(initialFormValues);
  }, [accountAddress, initialFormValues]);

  const balanceToken = formValues.fromToken;
  const toToken = isStake ? vault.stakedToken : vault.rewardToken;

  // --- Balances ---
  const { data: priceUsdData } = useGetTokenUsdPrice({ token: formValues.fromToken });

  const { data: balanceData, isLoading: isBalanceLoading } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token: balanceToken,
    },
    { enabled: !!accountAddress },
  );

  const { data: getVTokenBalanceData } = useGetVTokenBalance(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      vTokenAddress: vault.asset.vToken.address,
    },
    { enabled: !!accountAddress && !isStake },
  );

  const balanceTokens = useMemo(() => {
    if (isBalanceLoading || !balanceData) return undefined;
    return convertMantissaToTokens({
      value: balanceData.balanceMantissa,
      token: balanceToken,
    });
  }, [balanceToken, balanceData, isBalanceLoading]);

  const userStakedTokens = convertMantissaToTokens({
    value: getVTokenBalanceData?.balanceMantissa ?? new BigNumber(0),
    token: vault.asset.vToken,
  });

  // --- Token approval ---
  const { address: pendlePtVaultAddress } = useGetContractAddress({ name: 'PendlePtVault' });
  const spenderAddress = isStake && pendlePtVaultAddress ? pendlePtVaultAddress : undefined;

  const {
    isTokenApproved: isFromTokenApproved,
    isApproveTokenLoading: isApproveFromTokenLoading,
    walletSpendingLimitTokens: fromTokenWalletSpendingLimitTokens,
  } = useTokenApproval({
    token: formValues.fromToken,
    spenderAddress,
    accountAddress,
  });

  // --- Available / limit tokens ---
  const limitTokens = useMemo(() => {
    let tokens = new BigNumber(balanceTokens || 0);

    if (fromTokenWalletSpendingLimitTokens?.isGreaterThan(0)) {
      tokens = BigNumber.min(tokens, fromTokenWalletSpendingLimitTokens);
    }

    const marginWithSupplyCapTokens = vault.asset.supplyCapTokens.isEqualTo(0)
      ? new BigNumber(0)
      : vault.asset.supplyCapTokens.minus(vault.asset.supplyBalanceTokens);
    tokens = BigNumber.min(tokens, marginWithSupplyCapTokens);

    return tokens;
  }, [
    vault.asset.supplyBalanceTokens,
    balanceTokens,
    fromTokenWalletSpendingLimitTokens,
    vault.asset.supplyCapTokens,
  ]);

  const availableTokens = (isStake ? limitTokens : userStakedTokens) ?? new BigNumber(0);

  // --- Swap quote ---
  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();

  const debouncedInputAmountTokens = useDebounceValue(formValues.tokenAmount || 0);
  const amountTokens = new BigNumber(debouncedInputAmountTokens);

  const {
    data: getSwapQuoteData,
    error: getSwapQuoteError,
    isLoading: isGetSwapQuoteLoading,
  } = useGetPendleSwapQuote(
    {
      fromToken: formValues.fromToken,
      toToken,
      amountTokens,
      slippagePercentage:
        actionMode === 'redeemAtMaturity' ? 0 : userSlippageTolerancePercentage / 100,
    },
    {
      enabled:
        amountTokens.isGreaterThan(0) &&
        amountTokens.lte(isStake ? limitTokens : userStakedTokens) &&
        actionMode !== 'redeemAtMaturity',
    },
  );

  // --- Form validation ---
  const { handleSubmit, isFormValid, formError } = useForm({
    onSubmit: handleOnSubmit,
    formValues,
    setFormValues,
    swapQuoteError: getSwapQuoteError ?? undefined,
    availableTokens,
    balanceTokens,
    token: balanceToken,
  });

  // --- Approval ---
  const approval = useMemo((): Approval | undefined => {
    if (!isStake && pendlePtVaultAddress) {
      return {
        type: 'delegate',
        delegateeAddress: pendlePtVaultAddress,
        poolComptrollerContractAddress: vault.poolComptrollerContractAddress,
      };
    }

    if (
      spenderAddress &&
      Array.isArray(getSwapQuoteData?.requiredApprovals) &&
      getSwapQuoteData.requiredApprovals.length > 0 &&
      !isFromTokenApproved
    ) {
      return {
        type: 'token',
        token: formValues.fromToken,
        spenderAddress,
      };
    }

    return undefined;
  }, [
    isStake,
    pendlePtVaultAddress,
    vault.poolComptrollerContractAddress,
    spenderAddress,
    getSwapQuoteData?.requiredApprovals,
    isFromTokenApproved,
    formValues.fromToken,
  ]);

  // --- Mutations ---
  const { mutateAsync: deposit, isPending: isDepositLoading } = usePendlePtVaultDeposit({
    pendleMarketAddress: getSwapQuoteData?.pendleMarketAddress ?? NULL_ADDRESS,
    isNative: formValues.fromToken.isNative,
  });

  const { mutateAsync: withdraw, isPending: isWithdrawLoading } = usePendlePtVaultWithdraw({
    pendleMarketAddress: getSwapQuoteData?.pendleMarketAddress ?? NULL_ADDRESS,
  });

  const { mutateAsync: withdrawAfterMaturity, isPending: isWithdrawAfterMaturityLoading } =
    useWithdraw();

  const isSubmitting = isDepositLoading || isWithdrawLoading || isWithdrawAfterMaturityLoading;

  // --- Submit handler ---
  async function handleOnSubmit() {
    const withdrawFull = !isStake && formValues.tokenAmount === availableTokens.toFixed();

    if (actionMode === 'redeemAtMaturity') {
      await withdrawAfterMaturity({
        poolName: vault.poolName,
        poolComptrollerContractAddress: vault.poolComptrollerContractAddress,
        vToken: vault.asset.vToken,
        withdrawFullSupply: withdrawFull,
        unwrap: formValues.fromToken.isNative,
        amountMantissa: getVTokenBalanceData?.balanceMantissa
          ? getVTokenBalanceData.balanceMantissa
          : convertTokensToMantissa({
              value: new BigNumber(formValues.tokenAmount),
              token: formValues.fromToken,
            }),
      });
    } else if (getSwapQuoteData) {
      const amountMantissa =
        withdrawFull && getVTokenBalanceData?.balanceMantissa
          ? getVTokenBalanceData.balanceMantissa
          : convertTokensToMantissa({
              value: new BigNumber(formValues.tokenAmount),
              token: isStake ? formValues.fromToken : vault.asset.vToken,
            });

      const params = {
        swapQuote: getSwapQuoteData,
        type: actionMode,
        fromToken: formValues.fromToken,
        toToken,
        amountMantissa,
        vToken: vault.asset.vToken,
      };

      if (actionMode === 'deposit') {
        await deposit(params);
      } else {
        await withdraw(params);
      }
    }

    onClose?.();
  }

  // --- Slider ---
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
      .dp(isStake ? balanceToken.decimals : vault.asset.vToken.decimals)
      .toFixed();
    setFormValues(current => ({ ...current, tokenAmount }));
  };

  const handleMaxButtonClick = () => {
    setFormValues(current => ({ ...current, tokenAmount: availableTokens.toFixed() }));
  };

  const handleActionModeChange = (index: number) => {
    setActionMode(index === 0 ? 'deposit' : 'withdraw');
  };

  // --- Derived submit state ---
  const isUserConnected = !!accountAddress;
  const disableInput =
    !isUserConnected || isSubmitting || isApproveFromTokenLoading || isBalanceLoading;
  const disableSubmit =
    !isFormValid ||
    isSubmitting ||
    isGetSwapQuoteLoading ||
    (actionMode !== 'redeemAtMaturity' && !getSwapQuoteData);

  return {
    // State
    actionMode,
    isStake,
    formValues,
    forceActionMode,
    hasMatured,
    accountAddress,
    isUserConnected,

    // Tokens
    balanceToken,
    toToken,
    priceUsdData,
    userStakedTokens,
    availableTokens,

    // Swap
    getSwapQuoteData,
    isGetSwapQuoteLoading,
    userSlippageTolerancePercentage,

    // Form
    handleSubmit,
    isFormValid,
    formError,
    approval,

    // UI state
    sliderPercentage,
    disableInput,
    disableSubmit,
    isSubmitting,

    // Handlers
    setFormValues,
    handleSliderChange,
    handleMaxButtonClick,
    handleActionModeChange,
  };
};

export default usePositionTab;
export type { ActionMode };
