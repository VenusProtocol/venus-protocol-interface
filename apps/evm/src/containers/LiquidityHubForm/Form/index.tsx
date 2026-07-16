import type BigNumber from 'bignumber.js';

import { liquidityHubs as fakeLiquidityHubs } from '__mocks__/models/liquidityHubs';
import { useGetPool } from 'clients/api';
import { BalanceUpdates, Delimiter, LabeledInlineContent, TokenTextField } from 'components';
import { AccountLiquidityHubDailyEarnings } from 'containers/AccountLiquidityHubDailyEarnings';
import { AccountPoolHealth } from 'containers/AccountPoolHealth';
import { type TokenApproval, TxFormSubmitButton } from 'containers/TxFormSubmitButton';
import { useChain } from 'hooks/useChain';
import { useSimulateLiquidityHubMutations } from 'hooks/useSimulateLiquidityHubMutations';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { AssetBalanceMutation, LiquidityHub, LiquidityHubBalanceMutation } from 'types';
import { formatPercentageToReadableValue, shouldShowAccountHealth } from 'utilities';
import { type FormValues, useForm } from './useForm';
import type { UseFormValidationInput } from './useForm/useFormValidation';

export * from './useForm';

export interface FormProps {
  liquidityHub: LiquidityHub;
  onSubmit: (formValues: FormValues) => Promise<unknown>;
  balanceMutations: Array<AssetBalanceMutation | LiquidityHubBalanceMutation>;
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
}

export const Form: React.FC<FormProps> = ({
  liquidityHub,
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
}) => {
  const { accountAddress } = useAccountAddress();
  const { corePoolComptrollerContractAddress } = useChain();

  const isUserConnected = !!accountAddress;

  const { t } = useTranslation();

  const affectsCorePool = balanceMutations.some(
    balanceMutation => balanceMutation.type === 'asset',
  );

  const { data: getPools, isLoading: isGetPoolLoading } = useGetPool(
    {
      poolComptrollerAddress: corePoolComptrollerContractAddress,
      accountAddress,
    },
    {
      enabled: affectsCorePool,
    },
  );

  const pool = getPools?.pool;

  const { data: getSimulatedPoolData, isLoading: isGetSimulatedPoolLoading } =
    useSimulatePoolMutations({
      pool,
      balanceMutations,
    });
  const simulatedPool = getSimulatedPoolData?.pool;

  // TODO: fetch from API
  const liquidityHubs = fakeLiquidityHubs;

  const { liquidityHubs: simulatedLiquidityHubs } = useSimulateLiquidityHubMutations({
    liquidityHubs,
    balanceMutations,
  });

  const { formError, isFormValid, handleSubmit } = useForm({
    validate: validateForm,
    liquidityHub,
    limitTokens,
    pool,
    simulatedPool,
    balanceMutations,
    formValues,
    setFormValues,
    onSubmit,
    onSubmitSuccess,
  });

  const toggleAcknowledgeRisk = () =>
    setFormValues(values => ({
      ...values,
      acknowledgeRisk: !values.acknowledgeRisk,
    }));

  const handleRightMaxButtonClick = () =>
    setFormValues(values => ({
      ...values,
      amountTokens: (safeLimitTokens ?? limitTokens).dp(liquidityHub.vhToken.decimals).toFixed(),
    }));

  const isLoading = isGetPoolLoading || isGetSimulatedPoolLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isUserConnected && (
        <>
          <TokenTextField
            name="amountTokens"
            token={liquidityHub.vhToken.underlyingToken}
            value={formValues.amountTokens}
            onChange={amountTokens =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                amountTokens,
              }))
            }
            disabled={
              !isUserConnected || isSubmitting || formError?.code === 'SUPPLY_CAP_ALREADY_REACHED'
            }
            rightMaxButton={{
              label: rightMaxButtonLabel ?? t('liquidityHubForm.rightMaxButtonLabel'),
              onClick: handleRightMaxButtonClick,
            }}
            hasError={
              isUserConnected && !isSubmitting && !!formError && Number(formValues.amountTokens) > 0
            }
            description={
              isUserConnected && !isSubmitting && !!formError?.message ? (
                <p className="text-red">{formError.message}</p>
              ) : undefined
            }
          />

          {availableBalance}

          <Delimiter />

          <BalanceUpdates
            pool={pool}
            liquidityHubs={liquidityHubs}
            balanceMutations={balanceMutations}
          />

          <Delimiter />
        </>
      )}

      <LabeledInlineContent label={t('liquidityHubForm.supplyApy')}>
        {formatPercentageToReadableValue(liquidityHub.supplyApyPercentage)}
      </LabeledInlineContent>

      <Delimiter />

      {pool &&
        shouldShowAccountHealth({
          pool,
          simulatedPool,
        }) && <AccountPoolHealth pool={pool} simulatedPool={simulatedPool} />}

      <AccountLiquidityHubDailyEarnings
        liquidityHubs={liquidityHubs}
        simulatedLiquidityHubs={simulatedLiquidityHubs}
      />

      <TxFormSubmitButton
        approval={approval}
        submitButtonLabel={submitButtonLabel}
        isFormValid={isFormValid}
        isLoading={isLoading}
        isUserAcknowledgingRisk={formValues.acknowledgeRisk}
        setAcknowledgeRisk={toggleAcknowledgeRisk}
        balanceMutations={balanceMutations}
        simulatedPool={simulatedPool}
      />
    </form>
  );
};
