import type BigNumber from 'bignumber.js';
import { useEffect } from 'react';

import {
  ApyBreakdown,
  type ApyBreakdownItem,
  BalanceUpdates,
  Delimiter,
  SelectTokenTextField,
  TokenTextField,
} from 'components';
import { AccountPoolHealth } from 'containers/AccountPoolHealth';
import type { OptionalTokenBalance } from 'containers/TokenListWrapper';
import { type TokenApproval, TxFormSubmitButton } from 'containers/TxFormSubmitButton';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { AssetBalanceMutation, SpokePool, Token } from 'types';
import { shouldShowAccountHealth } from 'utilities';
import { type FormValues, initialFormValues, useForm } from './useForm';
import type { UseFormValidationInput } from './useForm/useFormValidation';

export * from './useForm';

export interface FormProps {
  spokePool: SpokePool;
  token: Token;
  onSubmit: (formValues: FormValues) => Promise<unknown>;
  balanceMutations: AssetBalanceMutation[];
  formValues: FormValues;
  setFormValues: (setter: FormValues | ((newFormValues: FormValues) => FormValues)) => void;
  isSubmitting: boolean;
  submitButtonLabel: string;
  limitTokens: BigNumber;
  availableBalance: React.ReactNode;
  safeLimitTokens?: BigNumber;
  rightMaxButtonLabel?: string;
  onSubmitSuccess?: () => void;
  approval?: TokenApproval;
  validateForm?: UseFormValidationInput['validate'];
  apyBreakdownItems?: ApyBreakdownItem[];
  belowAmountInput?: React.ReactNode;
  tokenBalances?: OptionalTokenBalance[];
  onChangeSelectedToken?: (token: Token) => void;
}

export const Form: React.FC<FormProps> = ({
  spokePool,
  token,
  availableBalance,
  balanceMutations,
  onSubmit,
  onSubmitSuccess,
  formValues,
  setFormValues,
  rightMaxButtonLabel,
  limitTokens,
  safeLimitTokens,
  submitButtonLabel,
  isSubmitting,
  approval,
  validateForm,
  apyBreakdownItems = [],
  belowAmountInput,
  tokenBalances,
  onChangeSelectedToken,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const isUserConnected = !!accountAddress;

  const { data: getSimulatedPoolData, isLoading: isGetSimulatedPoolLoading } =
    useSimulatePoolMutations({
      pool: spokePool,
      balanceMutations,
    });
  const simulatedPool = getSimulatedPoolData?.pool;

  const { formError, isFormValid, handleSubmit } = useForm({
    validate: validateForm,
    pool: spokePool,
    simulatedPool,
    limitTokens,
    balanceMutations,
    formValues,
    setFormValues,
    onSubmit,
    onSubmitSuccess,
  });

  // Reset form when user disconnects their wallet
  useEffect(() => {
    if (!accountAddress) {
      setFormValues(initialFormValues);
    }
  }, [accountAddress, setFormValues]);

  const toggleAcknowledgeRisk = () =>
    setFormValues(values => ({
      ...values,
      acknowledgeRisk: !values.acknowledgeRisk,
    }));

  const handleRightMaxButtonClick = () =>
    setFormValues(values => ({
      ...values,
      amountTokens: (safeLimitTokens ?? limitTokens).dp(token.decimals).toFixed(),
    }));

  const handleAmountChange = (amountTokens: string) =>
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens,
    }));

  const amountInputProps = {
    name: 'amountTokens',
    value: formValues.amountTokens,
    onChange: handleAmountChange,
    disabled: !isUserConnected || isSubmitting,
    rightMaxButton: {
      label: rightMaxButtonLabel ?? t('spokeForm.rightMaxButtonLabel'),
      onClick: handleRightMaxButtonClick,
    },
    hasError:
      isUserConnected && !isSubmitting && !!formError && Number(formValues.amountTokens) > 0,
    description:
      isUserConnected && !isSubmitting && !!formError?.message ? (
        <p className="text-red">{formError.message}</p>
      ) : undefined,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {tokenBalances && onChangeSelectedToken ? (
        <SelectTokenTextField
          {...amountInputProps}
          tokenBalances={tokenBalances}
          selectedToken={token}
          onChangeSelectedToken={onChangeSelectedToken}
        />
      ) : (
        <TokenTextField {...amountInputProps} token={token} />
      )}

      {belowAmountInput}

      {isUserConnected && (
        <>
          {availableBalance}

          <Delimiter />

          <BalanceUpdates pool={spokePool} balanceMutations={balanceMutations} />

          <Delimiter />
        </>
      )}

      {apyBreakdownItems.length > 0 && (
        <ApyBreakdown
          items={apyBreakdownItems}
          renderType={isUserConnected ? 'accordion' : 'block'}
        />
      )}

      {isUserConnected && shouldShowAccountHealth({ pool: spokePool, simulatedPool }) && (
        <>
          <Delimiter />

          <AccountPoolHealth pool={spokePool} simulatedPool={simulatedPool} />
        </>
      )}

      <TxFormSubmitButton
        approval={approval}
        submitButtonLabel={submitButtonLabel}
        isFormValid={isFormValid}
        isLoading={isSubmitting || isGetSimulatedPoolLoading}
        isUserAcknowledgingRisk={formValues.acknowledgeRisk}
        setAcknowledgeRisk={toggleAcknowledgeRisk}
        balanceMutations={balanceMutations}
        simulatedPool={simulatedPool}
      />
    </form>
  );
};
