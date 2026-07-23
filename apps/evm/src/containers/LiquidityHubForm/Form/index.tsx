import type BigNumber from 'bignumber.js';

import { liquidityHubs as fakeLiquidityHubs } from '__mocks__/models/liquidityHubs';
import { useGetPool } from 'clients/api';
import { Delimiter, TokenTextField } from 'components';
import { type TokenApproval, TxFormSubmitButton } from 'containers/TxFormSubmitButton';
import { useChain } from 'hooks/useChain';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { AssetBalanceMutation, LiquidityHubBalanceMutation, VhToken } from 'types';
import { type FormValues, useForm } from './useForm';

export * from './useForm';

export interface FormProps {
  vhToken: VhToken;
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
}

export const Form: React.FC<FormProps> = ({
  vhToken,
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
}) => {
  const { accountAddress } = useAccountAddress();
  const { corePoolComptrollerContractAddress } = useChain();

  const isUserConnected = !!accountAddress;

  const { t } = useTranslation();

  // TODO: fetch from the API
  const liquidityHubs = fakeLiquidityHubs;

  const affectsCorePool = balanceMutations.some(
    balanceMutation => balanceMutation.type === 'asset',
  );

  const { data: getPools } = useGetPool(
    {
      poolComptrollerAddress: corePoolComptrollerContractAddress,
      accountAddress,
    },
    {
      enabled: affectsCorePool,
    },
  );

  const pool = getPools?.pool;

  const { data: getSimulatedPoolData } = useSimulateBalanceMutations({
    pool,
    balanceMutations,
  });
  const simulatedPool = getSimulatedPoolData?.pool;

  const { formError, isFormValid, handleSubmit } = useForm({
    vhToken,
    liquidityHubs,
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
      amountTokens: (safeLimitTokens ?? limitTokens).dp(vhToken.decimals).toFixed(),
    }));

  // TODO: wire up
  const isLoading = false;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TokenTextField
        name="amountTokens"
        token={vhToken.underlyingToken}
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
