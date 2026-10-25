import type BigNumber from 'bignumber.js';

import { useGetLiquidityHubs, useGetPool } from 'clients/api';
import {
  ApyBreakdown,
  type ApyBreakdownItem,
  BalanceUpdates,
  Delimiter,
  TokenTextField,
} from 'components';
import { AccountLiquidityHubDailyEarnings } from 'containers/AccountLiquidityHubDailyEarnings';
import { AccountPoolHealth } from 'containers/AccountPoolHealth';
import { type Approval, TxFormSubmitButton } from 'containers/TxFormSubmitButton';
import { useChain } from 'hooks/useChain';
import { useSimulateLiquidityHubMutations } from 'hooks/useSimulateLiquidityHubMutations';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useEffect } from 'react';
import type { AssetBalanceMutation, LiquidityHub, LiquidityHubBalanceMutation } from 'types';
import { areAddressesEqual, areTokensEqual, shouldShowAccountHealth } from 'utilities';
import { type FormValues, initialFormValues, useForm } from './useForm';
import type { UseFormValidationInput } from './useForm/useFormValidation';

export * from './useForm';

export interface AmountSetInput {
  amountTokens: BigNumber | string;
  maxSelected: boolean;
}

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
  approval?: Approval | Approval[];
  isApprovalLoading?: boolean;
  includeCorePool?: boolean;
  validateForm?: UseFormValidationInput['validate'];
  onAmountSet?: (input: AmountSetInput) => void;
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
  isApprovalLoading = false,
  includeCorePool = false,
  validateForm,
  onAmountSet,
}) => {
  const { accountAddress } = useAccountAddress();
  const { corePoolComptrollerContractAddress } = useChain();

  const isUserConnected = !!accountAddress;

  const { t } = useTranslation();

  const affectsCorePool =
    includeCorePool || balanceMutations.some(balanceMutation => balanceMutation.type === 'asset');

  const { data: getPools, isLoading: isGetPoolLoading } = useGetPool(
    {
      poolComptrollerAddress: corePoolComptrollerContractAddress,
      accountAddress,
    },
    {
      enabled: affectsCorePool,
    },
  );

  const pool = affectsCorePool ? getPools?.pool : undefined;

  const { data: getSimulatedPoolData, isLoading: isGetSimulatedPoolLoading } =
    useSimulatePoolMutations({
      pool,
      balanceMutations,
    });
  const simulatedPool = getSimulatedPoolData?.pool;

  const vhMarketVTokenAddress = pool?.assets.find(asset =>
    areTokensEqual(asset.vToken.underlyingToken, liquidityHub.vhToken),
  )?.vToken.address;

  const displayedBalanceMutations = balanceMutations.filter(
    balanceMutation =>
      balanceMutation.type !== 'asset' ||
      !vhMarketVTokenAddress ||
      !areAddressesEqual(balanceMutation.vTokenAddress, vhMarketVTokenAddress),
  );

  const { data: getLiquidityHubsData, isLoading: isGetLiquidityHubsLoading } = useGetLiquidityHubs({
    accountAddress,
  });

  const liquidityHubs = getLiquidityHubsData?.liquidityHubs ?? [];

  const { liquidityHubs: simulatedLiquidityHubs } = useSimulateLiquidityHubMutations({
    liquidityHubs,
    balanceMutations,
  });

  const apyBreakdownItems: ApyBreakdownItem[] = [
    {
      type: 'supply',
      token: liquidityHub.vhToken.underlyingToken,
      baseApyPercentage: liquidityHub.supplyApyPercentage,
      tokenDistributions: liquidityHub.supplyTokenDistributions,
    },
  ];

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

  const handleRightMaxButtonClick = () => {
    const amountTokens = (safeLimitTokens ?? limitTokens)
      .dp(liquidityHub.vhToken.underlyingToken.decimals)
      .toFixed();

    onAmountSet?.({
      amountTokens,
      maxSelected: true,
    });

    setFormValues(values => ({
      ...values,
      amountTokens,
    }));
  };

  const isLoading =
    isSubmitting ||
    isApprovalLoading ||
    isGetLiquidityHubsLoading ||
    isGetPoolLoading ||
    isGetSimulatedPoolLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TokenTextField
        name="amountTokens"
        token={liquidityHub.vhToken.underlyingToken}
        value={formValues.amountTokens}
        onChange={amountTokens => {
          onAmountSet?.({
            amountTokens,
            maxSelected: false,
          });

          setFormValues(currentFormValues => ({
            ...currentFormValues,
            amountTokens,
          }));
        }}
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

      {isUserConnected && (
        <>
          {availableBalance}

          <Delimiter />

          <BalanceUpdates
            pool={pool}
            liquidityHubs={liquidityHubs}
            balanceMutations={displayedBalanceMutations}
          />

          <Delimiter />
        </>
      )}

      <ApyBreakdown
        items={apyBreakdownItems}
        renderType={isUserConnected ? 'accordion' : 'block'}
      />

      {isUserConnected && (
        <>
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
        </>
      )}

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
