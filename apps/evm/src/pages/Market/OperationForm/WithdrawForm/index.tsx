import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@venusprotocol/ui';
import { useGetVTokenBalance, useWithdraw } from 'clients/api';
import {
  Delimiter,
  LabeledInlineContent,
  RiskAcknowledgementToggle,
  Toggle,
  TokenTextField,
} from 'components';
import { useChain } from 'hooks/useChain';
import useDelegateApproval from 'hooks/useDelegateApproval';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, BalanceMutation, Pool } from 'types';
import { calculateHealthFactor, convertTokensToMantissa } from 'utilities';

import { NULL_ADDRESS } from 'constants/address';
import {
  HEALTH_FACTOR_MODERATE_THRESHOLD,
  HEALTH_FACTOR_SAFE_MAX_THRESHOLD,
} from 'constants/healthFactor';
import { ConnectWallet } from 'containers/ConnectWallet';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { useAnalytics } from 'libs/analytics';
import { ApyBreakdown } from '../ApyBreakdown';
import { OperationDetails } from '../OperationDetails';
import { calculateAmountDollars } from '../calculateAmountDollars';
import SubmitSection from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

export interface WithdrawFormUiProps {
  isUserConnected: boolean;
  asset: Asset;
  pool: Pool;
  onSubmit: UseFormInput['onSubmit'];
  isSubmitting: boolean;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  formValues: FormValues;
  isWrapUnwrapNativeTokenEnabled: boolean;
  isDelegateApproved: boolean | undefined;
  isDelegateApprovedLoading: boolean;
  isApproveDelegateLoading: boolean;
  approveDelegateAction: () => Promise<unknown>;
  onSubmitSuccess?: () => void;
}

export const WithdrawFormUi: React.FC<WithdrawFormUiProps> = ({
  isUserConnected,
  onSubmitSuccess,
  asset,
  pool,
  setFormValues,
  formValues,
  onSubmit,
  isSubmitting,
  isWrapUnwrapNativeTokenEnabled,
  isDelegateApproved,
  isDelegateApprovedLoading,
  isApproveDelegateLoading,
  approveDelegateAction,
}) => {
  const { t } = useTranslation();
  const { nativeToken } = useChain();
  const { captureAnalyticEvent } = useAnalytics();

  const canUnwrapToNativeToken = useMemo(
    () => isWrapUnwrapNativeTokenEnabled && !!asset.vToken.underlyingToken.tokenWrapped,
    [isWrapUnwrapNativeTokenEnabled, asset.vToken.underlyingToken.tokenWrapped],
  );

  const handleToggleReceiveNativeToken = () => {
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      receiveNativeToken: !currentFormValues.receiveNativeToken,
    }));
  };

  const handleToggleAcknowledgeRisk = (checked: boolean) => {
    if (checked) {
      captureAnalyticEvent('withdraw_risks_acknowledged', {
        poolName: pool.name,
        assetSymbol: asset.vToken.underlyingToken.symbol,
        usdAmount: calculateAmountDollars({
          amountTokens: formValues.amountTokens,
          tokenPriceCents: asset.tokenPriceCents,
        }),
        maxSelected: false,
        safeBorrowLimitExceeded: new BigNumber(formValues.amountTokens).isGreaterThan(
          moderateRiskMaxTokens,
        ),
      });
    }

    setFormValues(currentFormValues => ({
      ...currentFormValues,
      acknowledgeRisk: checked,
    }));
  };

  const hypotheticalHealthFactor = useMemo(() => {
    if (
      !Number(formValues.amountTokens) ||
      !asset.isCollateralOfUser ||
      !pool.userLiquidationThresholdCents ||
      !pool.userBorrowBalanceCents ||
      pool.userBorrowBalanceCents.isEqualTo(0)
    ) {
      return undefined;
    }

    const withdrawCollateralValueCents = new BigNumber(formValues.amountTokens)
      .multipliedBy(asset.userLiquidationThresholdPercentage / 100)
      // Convert tokens to cents
      .multipliedBy(asset.tokenPriceCents);

    const hypotheticalUserLiquidationThresholdCents = pool.userLiquidationThresholdCents.minus(
      withdrawCollateralValueCents,
    );

    return calculateHealthFactor({
      borrowBalanceCents: pool.userBorrowBalanceCents.toNumber(),
      liquidationThresholdCents: hypotheticalUserLiquidationThresholdCents.toNumber(),
    });
  }, [asset, pool, formValues.amountTokens]);

  const [limitTokens, safeLimitTokens, moderateRiskMaxTokens] = useMemo(() => {
    const assetLiquidityTokens = new BigNumber(asset.liquidityCents).dividedBy(
      asset.tokenPriceCents,
    );
    // If asset isn't used as collateral user can withdraw the entire supply balance without
    // affecting their borrow limit, if there's enough liquidity
    const availableTokens = BigNumber.minimum(asset.userSupplyBalanceTokens, assetLiquidityTokens);

    if (
      !asset.isCollateralOfUser ||
      asset.userCollateralFactor === 0 ||
      !pool.userBorrowLimitCents ||
      !pool.userLiquidationThresholdCents ||
      !pool.userBorrowBalanceCents ||
      pool.userBorrowBalanceCents.isEqualTo(0)
    ) {
      return [availableTokens, availableTokens, availableTokens];
    }

    // Calculate how much token user can withdraw before they risk getting
    // liquidated

    // Return 0 if borrow limit has already been reached
    if (pool.userBorrowBalanceCents.isGreaterThanOrEqualTo(pool.userBorrowLimitCents)) {
      return [new BigNumber(0), new BigNumber(0), new BigNumber(0)];
    }

    const marginWithUserBorrowLimitTokens = pool.userBorrowLimitCents
      .minus(pool.userBorrowBalanceCents)
      .dividedBy(asset.userCollateralFactor)
      .dividedBy(asset.tokenPriceCents);

    let marginWithUserSafeBorrowLimitTokens =
      // We base the safe borrow limit on the liquidation threshold because that's the base used to
      // calculate the health factor
      pool.userLiquidationThresholdCents
        .minus(pool.userBorrowBalanceCents.multipliedBy(HEALTH_FACTOR_SAFE_MAX_THRESHOLD))
        .dividedBy(asset.userCollateralFactor)
        .dividedBy(asset.tokenPriceCents);

    if (marginWithUserSafeBorrowLimitTokens.isLessThan(0)) {
      marginWithUserSafeBorrowLimitTokens = new BigNumber(0);
    }

    let marginWithUserModerateRiskBorrowLimitTokens =
      // We base the safe borrow limit on the liquidation threshold because that's the base used to
      // calculate the health factor
      pool.userLiquidationThresholdCents
        .minus(pool.userBorrowBalanceCents.multipliedBy(HEALTH_FACTOR_MODERATE_THRESHOLD))
        .dividedBy(asset.userCollateralFactor)
        .dividedBy(asset.tokenPriceCents);

    if (marginWithUserModerateRiskBorrowLimitTokens.isLessThan(0)) {
      marginWithUserModerateRiskBorrowLimitTokens = new BigNumber(0);
    }

    const maxTokens = BigNumber.min(availableTokens, marginWithUserBorrowLimitTokens).dp(
      asset.vToken.underlyingToken.decimals,
    );

    const safeMaxTokens = BigNumber.min(maxTokens, marginWithUserSafeBorrowLimitTokens).dp(
      asset.vToken.underlyingToken.decimals,
    );

    const moderateRiskMaxTokens = BigNumber.min(
      maxTokens,
      marginWithUserModerateRiskBorrowLimitTokens,
    ).dp(asset.vToken.underlyingToken.decimals);

    return [maxTokens, safeMaxTokens, moderateRiskMaxTokens];
  }, [asset, pool]);

  const _debouncedInputAmountTokens = useDebounceValue(formValues.amountTokens);
  const debouncedInputAmountTokens = new BigNumber(_debouncedInputAmountTokens || 0);

  const balanceMutations: BalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: asset.vToken.address,
      action: 'withdraw',
      amountTokens: debouncedInputAmountTokens,
    },
  ];

  const { data: getSimulatedPoolData } = useSimulateBalanceMutations({
    pool,
    balanceMutations,
  });
  const simulatedPool = getSimulatedPoolData?.pool;

  const { handleSubmit, isFormValid, formError } = useForm({
    asset,
    poolName: pool.name,
    limitTokens,
    moderateRiskMaxTokens,
    onSubmitSuccess,
    onSubmit,
    formValues,
    setFormValues,
  });

  const isRiskyOperation =
    hypotheticalHealthFactor !== undefined &&
    hypotheticalHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD;

  const shouldAskUserRiskAcknowledgement =
    isRiskyOperation && (!formError || formError?.code === 'REQUIRES_RISK_ACKNOWLEDGEMENT');

  const captureAmountSetAnalyticEvent = ({
    amountTokens,
    maxSelected,
  }: { amountTokens: BigNumber | string; maxSelected: boolean; selectedPercentage?: number }) => {
    if (Number(formValues.amountTokens) > 0) {
      captureAnalyticEvent(
        'withdraw_amount_set',
        {
          poolName: pool.name,
          assetSymbol: asset.vToken.underlyingToken.symbol,
          usdAmount: calculateAmountDollars({
            amountTokens,
            tokenPriceCents: asset.tokenPriceCents,
          }),
          maxSelected,
          safeBorrowLimitExceeded: new BigNumber(amountTokens).isGreaterThan(moderateRiskMaxTokens),
        },
        {
          debounced: true,
        },
      );
    }
  };

  const handleSafeMaxButtonClick = () => {
    captureAmountSetAnalyticEvent({
      amountTokens: safeLimitTokens,
      maxSelected: true,
    });

    // Update field value to correspond to user's wallet balance
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens: safeLimitTokens.toFixed(),
    }));
  };

  const readableWithdrawableAmountTokens = useFormatTokensToReadableValue({
    value: limitTokens,
    token: formValues.fromToken,
  });

  if (!asset) {
    return undefined;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <TokenTextField
          data-testid={TEST_IDS.valueInput}
          name="amountTokens"
          token={asset.vToken.underlyingToken}
          value={formValues.amountTokens}
          onChange={amountTokens => {
            captureAmountSetAnalyticEvent({
              amountTokens,
              maxSelected: false,
            });

            setFormValues(currentFormValues => ({
              ...currentFormValues,
              amountTokens,
            }));
          }}
          disabled={!isUserConnected || isSubmitting}
          rightMaxButton={{
            label: t('operationForm.safeMaxButtonLabel'),
            onClick: handleSafeMaxButtonClick,
          }}
          hasError={
            isUserConnected &&
            !isSubmitting &&
            Number(formValues.amountTokens) > 0 &&
            !!formError &&
            formError.code !== 'REQUIRES_RISK_ACKNOWLEDGEMENT'
          }
          description={
            isUserConnected && !isSubmitting && !!formError?.message ? (
              <p className="text-red">{formError.message}</p>
            ) : undefined
          }
        />

        {!isUserConnected && (
          <ApyBreakdown
            pool={pool}
            simulatedPool={simulatedPool}
            balanceMutations={balanceMutations}
          />
        )}
      </div>

      <ConnectWallet
        className={cn('space-y-4', isUserConnected ? 'mt-2' : 'mt-6')}
        analyticVariant="withdraw_form"
      >
        <div className="space-y-4">
          <LabeledInlineContent
            label={t('operationForm.availableAmount')}
            data-testid={TEST_IDS.availableAmount}
          >
            {readableWithdrawableAmountTokens}
          </LabeledInlineContent>

          <Delimiter />

          {canUnwrapToNativeToken && (
            <>
              <LabeledInlineContent
                data-testid={TEST_IDS.receiveNativeToken}
                label={t('operationForm.receiveNativeToken.label', {
                  tokenSymbol: nativeToken.symbol,
                })}
                tooltip={t('operationForm.receiveNativeToken.tooltip', {
                  wrappedNativeTokenSymbol: asset.vToken.underlyingToken.symbol,
                  nativeTokenSymbol: nativeToken.symbol,
                })}
              >
                <Toggle
                  onChange={handleToggleReceiveNativeToken}
                  value={formValues.receiveNativeToken}
                />
              </LabeledInlineContent>

              <Delimiter />
            </>
          )}

          <OperationDetails
            action="withdraw"
            pool={pool}
            simulatedPool={simulatedPool}
            balanceMutations={balanceMutations}
          />

          {shouldAskUserRiskAcknowledgement && (
            <RiskAcknowledgementToggle
              value={formValues.acknowledgeRisk}
              onChange={(_, checked) => handleToggleAcknowledgeRisk(checked)}
            />
          )}
        </div>

        <SubmitSection
          isFormSubmitting={isSubmitting}
          isFormValid={isFormValid}
          formError={formError}
          isDelegateApproved={isDelegateApproved}
          isDelegateApprovedLoading={isDelegateApprovedLoading}
          approveDelegateAction={approveDelegateAction}
          isApproveDelegateLoading={isApproveDelegateLoading}
        />
      </ConnectWallet>
    </form>
  );
};

export interface WithdrawFormProps {
  asset: Asset;
  pool: Pool;
  onSubmitSuccess?: () => void;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ asset, pool, onSubmitSuccess }) => {
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const { accountAddress } = useAccountAddress();

  const initialFormValues: FormValues = useMemo(
    () => ({
      amountTokens: '',
      fromToken: asset.vToken.underlyingToken,
      receiveNativeToken: !!asset.vToken.underlyingToken.tokenWrapped,
      acknowledgeRisk: false,
    }),
    [asset],
  );

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  // Reset form when user disconnects their wallet
  useEffect(() => {
    if (!accountAddress) {
      setFormValues(initialFormValues);
    }
  }, [accountAddress, initialFormValues]);

  const { data: getVTokenBalanceData } = useGetVTokenBalance(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      vTokenAddress: asset.vToken.address,
    },
    {
      enabled: !!accountAddress,
    },
  );
  const vTokenBalanceMantissa = getVTokenBalanceData?.balanceMantissa;

  const { mutateAsync: withdraw, isPending: isWithdrawLoading } = useWithdraw();

  const { address: nativeTokenGatewayContractAddress } = useGetContractAddress({
    name: 'NativeTokenGateway',
    poolComptrollerContractAddress: pool.comptrollerAddress,
  });

  const {
    isDelegateApproved,
    isDelegateApprovedLoading,
    isUpdateDelegateStatusLoading,
    updatePoolDelegateStatus,
  } = useDelegateApproval({
    delegateeAddress: nativeTokenGatewayContractAddress || NULL_ADDRESS,
    poolComptrollerAddress: pool.comptrollerAddress,
    enabled: formValues.receiveNativeToken && isWrapUnwrapNativeTokenEnabled,
  });

  const onSubmit: UseFormInput['onSubmit'] = async ({ fromToken, fromTokenAmountTokens }) => {
    const withdrawFullSupply = asset.userSupplyBalanceTokens.isEqualTo(fromTokenAmountTokens);

    // This case should never be reached, but just in case we throw a generic
    // internal error
    if (!asset || (withdrawFullSupply && !vTokenBalanceMantissa)) {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    return withdraw({
      poolName: pool.name,
      poolComptrollerContractAddress: pool.comptrollerAddress,
      vToken: asset.vToken,
      withdrawFullSupply,
      unwrap: formValues.receiveNativeToken,
      amountMantissa: withdrawFullSupply
        ? vTokenBalanceMantissa!
        : convertTokensToMantissa({
            value: new BigNumber(fromTokenAmountTokens),
            token: fromToken,
          }),
    });
  };

  return (
    <WithdrawFormUi
      isUserConnected={!!accountAddress}
      isWrapUnwrapNativeTokenEnabled={isWrapUnwrapNativeTokenEnabled}
      onSubmitSuccess={onSubmitSuccess}
      asset={asset}
      pool={pool}
      formValues={formValues}
      setFormValues={setFormValues}
      onSubmit={onSubmit}
      isSubmitting={isWithdrawLoading}
      isDelegateApproved={isDelegateApproved}
      isDelegateApprovedLoading={isDelegateApprovedLoading}
      isApproveDelegateLoading={isUpdateDelegateStatusLoading}
      approveDelegateAction={() => updatePoolDelegateStatus({ approvedStatus: true })}
    />
  );
};

export default WithdrawForm;
