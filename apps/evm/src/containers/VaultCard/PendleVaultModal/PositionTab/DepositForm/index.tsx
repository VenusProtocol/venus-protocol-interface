import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetBalanceOf, useGetPendleSwapQuote, useStakeInPendleVault } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { TransactionForm } from 'containers/VaultCard/TransactionForm';
import { useForm } from 'containers/VaultCard/useForm';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { PendleVault } from 'types';
import {
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatTokensToReadableValue,
} from 'utilities';

import { Footer } from '../Footer';

export interface DepositFormProps {
  vault: PendleVault;
  onClose: () => void;
}

export const DepositForm: React.FC<DepositFormProps> = ({ vault, onClose }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { address: pendlePtVaultAddress } = useGetContractAddress({ name: 'PendlePtVault' });

  const fromToken = vault.stakedToken;
  const toToken = vault.rewardToken;
  const fromTokenPriceCents = vault.stakedTokenPriceCents;

  const { data: getUserWalletBalanceData } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token: fromToken,
    },
    { enabled: !!accountAddress },
  );
  const userWalletBalanceMantissa = getUserWalletBalanceData?.balanceMantissa;

  const userStakedTokens = convertMantissaToTokens({
    value: vault.userStakeBalanceMantissa ?? new BigNumber(0),
    token: vault.asset.vToken.underlyingToken,
  });

  const spenderAddress = pendlePtVaultAddress;

  const { walletSpendingLimitTokens: fromTokenWalletSpendingLimitTokens } = useTokenApproval({
    token: fromToken,
    spenderAddress,
    accountAddress,
  });

  const limitFromTokens = useMemo(() => {
    const userWalletBalanceTokens = userWalletBalanceMantissa
      ? convertMantissaToTokens({
          value: userWalletBalanceMantissa,
          token: fromToken,
        })
      : new BigNumber(0);

    const marginWithSupplyCapTokens = vault.asset.supplyCapTokens.isEqualTo(0)
      ? new BigNumber(0)
      : vault.asset.supplyCapTokens.minus(vault.asset.supplyBalanceTokens);

    return BigNumber.min(userWalletBalanceTokens, marginWithSupplyCapTokens);
  }, [
    userWalletBalanceMantissa,
    fromToken,
    vault.asset.supplyBalanceTokens,
    vault.asset.supplyCapTokens,
  ]);

  const form = useForm({
    limitFromTokens,
    walletSpendingLimitTokens: fromTokenWalletSpendingLimitTokens,
  });

  const fromAmountTokensFieldValue = form.watch('fromAmountTokens') ?? '0';
  const debouncedFromAmountTokens = useDebounceValue(fromAmountTokensFieldValue);
  const fromAmountTokens = new BigNumber(debouncedFromAmountTokens);

  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();

  const {
    data: getSwapQuoteData,
    error: swapQuoteError,
    isLoading: isGetSwapQuoteLoading,
  } = useGetPendleSwapQuote(
    {
      fromToken,
      toToken,
      amountTokens: fromAmountTokens,
      slippagePercentage: userSlippageTolerancePercentage,
    },
    {
      enabled: fromAmountTokens.isGreaterThan(0) && fromAmountTokens.lte(limitFromTokens),
    },
  );

  const { mutateAsync: deposit } = useStakeInPendleVault({
    pendleMarketAddress: getSwapQuoteData?.pendleMarketAddress ?? NULL_ADDRESS,
    isNative: fromToken.isNative,
  });

  const handleSubmit = async () => {
    if (!getSwapQuoteData) {
      return;
    }

    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(fromAmountTokensFieldValue),
      token: fromToken,
    });

    await deposit({
      swapQuote: getSwapQuoteData,
      type: 'deposit',
      fromToken,
      toToken,
      amountMantissa,
      vToken: vault.asset.vToken,
    });

    onClose();
  };

  const estimatedReceivedTokens = getSwapQuoteData?.estimatedReceivedTokensMantissa
    ? convertMantissaToTokens({
        value: getSwapQuoteData.estimatedReceivedTokensMantissa,
        token: toToken,
      })
    : undefined;

  const estimatedYieldTokensTokens = estimatedReceivedTokens?.minus(fromAmountTokens);
  const estimatedYieldTokensReadable = estimatedYieldTokensTokens
    ? `≈ ${formatTokensToReadableValue({
        value: estimatedYieldTokensTokens,
        token: toToken,
      })}`
    : PLACEHOLDER_KEY;

  return (
    <TransactionForm
      onSubmit={handleSubmit}
      form={form}
      fromToken={fromToken}
      limitFromTokens={limitFromTokens}
      fromTokenFieldLabel={t('vault.modals.deposit')}
      submitButtonLabel={t('vault.modals.deposit')}
      fromTokenPriceCents={fromTokenPriceCents.toNumber()}
      spenderAddress={spenderAddress}
      swapQuote={getSwapQuoteData}
      swapQuoteError={swapQuoteError ?? undefined}
      swapFromToken={fromToken}
      swapToToken={toToken}
      isLoading={isGetSwapQuoteLoading}
      footer={
        <Footer
          actionMode="deposit"
          vault={vault}
          fromToken={fromToken}
          toToken={toToken}
          userStakedTokens={userStakedTokens}
          userSlippageTolerancePercentage={userSlippageTolerancePercentage}
          swapQuote={getSwapQuoteData}
          estDiffAmountReadable={estimatedYieldTokensReadable}
        />
      }
    />
  );
};
