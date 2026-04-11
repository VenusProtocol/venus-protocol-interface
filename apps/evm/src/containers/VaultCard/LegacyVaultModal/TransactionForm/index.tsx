import BigNumber from 'bignumber.js';
import type { UseFormReturn } from 'react-hook-form';
import type { Address } from 'viem';

import { useGetBalanceOf } from 'clients/api';
import { AvailableBalance, LabeledSlider, NoticeInfo, SpendingLimit } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { RhfTokenTextField } from 'containers/Form';
import { type Approval, TxFormSubmitButton } from 'containers/TxFormSubmitButton';
import useTokenApproval from 'hooks/useTokenApproval';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Token } from 'types';
import { convertMantissaToTokens } from 'utilities';
import { formatTokensToReadableValue } from 'utilities/formatTokensToReadableValue';

export interface FormValues {
  fromAmountTokens: string;
}

export interface TransactionFormProps {
  form: UseFormReturn<FormValues>;
  fromToken: Token;
  limitFromTokens: BigNumber;
  fromTokenFieldLabel: string;
  submitButtonLabel: string;
  onSubmit: () => Promise<unknown>;
  fromTokenPriceCents?: number;
  footer?: React.ReactNode;
  spenderAddress?: Address;
}

// TODO: adapt and use for all vault types (missing: Pendle and institutional vaults)
export const TransactionForm: React.FC<TransactionFormProps> = ({
  fromToken,
  fromTokenPriceCents,
  form,
  limitFromTokens,
  fromTokenFieldLabel,
  spenderAddress,
  submitButtonLabel,
  onSubmit,
  footer,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const fromAmountTokensFieldValue = form.watch('fromAmountTokens');
  const fromAmountTokens = new BigNumber(fromAmountTokensFieldValue || 0);

  const approval: Approval | undefined =
    spenderAddress && fromAmountTokens.isGreaterThan(0)
      ? {
          type: 'token',
          spenderAddress,
          token: fromToken,
        }
      : undefined;

  const {
    isWalletSpendingLimitLoading,
    walletSpendingLimitTokens,
    revokeWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading,
    isApproveTokenLoading,
  } = useTokenApproval({
    token: fromToken,
    spenderAddress,
    accountAddress,
  });

  const { data: getFromTokenBalanceData, isLoading: isGetFromTokenWalletBalanceLoading } =
    useGetBalanceOf(
      {
        accountAddress: accountAddress || NULL_ADDRESS,
        token: fromToken,
      },
      {
        enabled: !!accountAddress,
      },
    );
  const walletBalanceFromTokens =
    getFromTokenBalanceData &&
    convertMantissaToTokens({
      value: getFromTokenBalanceData.balanceMantissa,
      token: fromToken,
    });

  const readableLimit = formatTokensToReadableValue({
    value: limitFromTokens,
    token: fromToken,
  });

  const handleLimitClick = () =>
    form.setValue('fromAmountTokens', limitFromTokens.dp(fromToken.decimals).toFixed(), {
      shouldDirty: true,
      shouldValidate: true,
    });

  const handleSliderChange = (percentage: number) => {
    const amountTokens = limitFromTokens
      .multipliedBy(percentage)
      .div(100)
      .dp(fromToken.decimals)
      .toFixed();

    form.setValue('fromAmountTokens', amountTokens, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const sliderValue = limitFromTokens.isGreaterThan(0)
    ? (Number(fromAmountTokens.toNumber()) * 100) / limitFromTokens.toNumber()
    : 0;

  const isLoading =
    isGetFromTokenWalletBalanceLoading ||
    isWalletSpendingLimitLoading ||
    isApproveTokenLoading ||
    form.formState.isSubmitting;

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }

    try {
      await onSubmit();

      form.reset();
    } catch (error) {
      handleError({ error });
    }
  };

  return (
    // TODO: update UI when user is disconnected
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-y-4">
      {!!accountAddress && (
        <>
          <RhfTokenTextField<FormValues>
            label={fromTokenFieldLabel}
            control={form.control}
            name="fromAmountTokens"
            token={fromToken}
            tokenPriceCents={fromTokenPriceCents}
          />

          <AvailableBalance readableBalance={readableLimit} onClick={handleLimitClick} />

          {!!spenderAddress && (
            <SpendingLimit
              token={fromToken}
              walletBalanceTokens={walletBalanceFromTokens}
              walletSpendingLimitTokens={walletSpendingLimitTokens}
              onRevoke={revokeWalletSpendingLimit}
              isRevokeLoading={isRevokeWalletSpendingLimitLoading}
            />
          )}

          <LabeledSlider value={sliderValue} onChange={handleSliderChange} />
        </>
      )}

      {footer && <div>{footer}</div>}

      <TxFormSubmitButton
        approval={approval}
        submitButtonLabel={submitButtonLabel}
        isFormValid={form.formState.isValid}
        isLoading={isLoading}
      />

      {!accountAddress && <NoticeInfo description={t('vault.modals.connectWalletMessage')} />}
    </form>
  );
};
