import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@venusprotocol/ui';
import { useBorrow } from 'clients/api';
import {
  Delimiter,
  LabeledInlineContent,
  RiskAcknowledgementToggle,
  Toggle,
  TokenTextField,
} from 'components';
import {
  HEALTH_FACTOR_MODERATE_THRESHOLD,
  HEALTH_FACTOR_SAFE_MAX_THRESHOLD,
} from 'constants/healthFactor';
import { useChain } from 'hooks/useChain';
import useDelegateApproval from 'hooks/useDelegateApproval';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import type { Asset, BalanceMutation, Pool } from 'types';
import {
  calculateHealthFactor,
  convertTokensToMantissa,
  formatTokensToReadableValue,
} from 'utilities';

import { NULL_ADDRESS } from 'constants/address';
import { ConnectWallet } from 'containers/ConnectWallet';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { useAnalytics } from 'libs/analytics';
import { useAccountAddress } from 'libs/wallet';
import { ApyBreakdown } from '../ApyBreakdown';
import { OperationDetails } from '../OperationDetails';
import { calculateAmountDollars } from '../calculateAmountDollars';
import { EModeBanner } from './EModeBanner';
import SubmitSection from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

export interface BorrowFormUiProps {
  isUserConnected: boolean;
  asset: Asset;
  pool: Pool;
  onSubmit: UseFormInput['onSubmit'];
  isSubmitting: boolean;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  formValues: FormValues;
  isWrapUnwrapNativeTokenEnabled: boolean;
  isEModeFeatureEnabled: boolean;
  isDelegateApproved: boolean | undefined;
  isDelegateApprovedLoading: boolean;
  isApproveDelegateLoading: boolean;
  approveDelegateAction: () => Promise<unknown>;
  onSubmitSuccess?: () => void;
}

export const BorrowFormUi: React.FC<BorrowFormUiProps> = ({
  isUserConnected,
  asset,
  pool,
  onSubmitSuccess,
  onSubmit,
  isSubmitting,
  setFormValues,
  formValues,
  isDelegateApproved,
  isDelegateApprovedLoading,
  isApproveDelegateLoading,
  approveDelegateAction,
  isWrapUnwrapNativeTokenEnabled,
  isEModeFeatureEnabled,
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

  const hypotheticalHealthFactor =
    Number(formValues.amountTokens) &&
    pool.userBorrowBalanceCents &&
    pool.userLiquidationThresholdCents
      ? calculateHealthFactor({
          borrowBalanceCents: pool.userBorrowBalanceCents
            .plus(new BigNumber(formValues.amountTokens).multipliedBy(asset.tokenPriceCents))
            .toNumber(),
          liquidationThresholdCents: pool.userLiquidationThresholdCents.toNumber(),
        })
      : undefined;

  // Calculate maximum amount of tokens user can borrow
  const [limitTokens, safeLimitTokens, moderateRiskMaxTokens] = useMemo(() => {
    // Return 0 values while asset is loading or if borrow limit has been
    // reached
    if (
      !pool.userBorrowBalanceCents ||
      !pool.userBorrowLimitCents ||
      !pool.userLiquidationThresholdCents ||
      pool.userBorrowBalanceCents.isGreaterThanOrEqualTo(pool.userBorrowLimitCents) ||
      asset.borrowBalanceTokens.isGreaterThanOrEqualTo(asset.borrowCapTokens)
    ) {
      return [new BigNumber(0), new BigNumber(0), new BigNumber(0)];
    }

    // Liquidities limit
    const assetLiquidityTokens = asset.liquidityCents
      // Convert to tokens
      .dividedBy(asset.tokenPriceCents);

    // Borrow limit
    const marginWithUserBorrowLimitTokens = pool.userBorrowLimitCents
      .minus(pool.userBorrowBalanceCents)
      // Convert to tokens
      .dividedBy(asset.tokenPriceCents);

    let marginWithUserSafeBorrowLimitTokens =
      // We base the safe borrow limit on the liquidation threshold because that's the base used to
      // calculate the health factor
      pool.userLiquidationThresholdCents
        .div(HEALTH_FACTOR_SAFE_MAX_THRESHOLD)
        .minus(pool.userBorrowBalanceCents)
        // Convert to tokens
        .dividedBy(asset.tokenPriceCents);

    if (marginWithUserSafeBorrowLimitTokens.isLessThan(0)) {
      marginWithUserSafeBorrowLimitTokens = new BigNumber(0);
    }

    let marginWithUserModerateRiskBorrowLimitTokens = pool.userLiquidationThresholdCents
      .div(HEALTH_FACTOR_MODERATE_THRESHOLD)
      .minus(pool.userBorrowBalanceCents)
      // Convert to tokens
      .dividedBy(asset.tokenPriceCents);

    if (marginWithUserModerateRiskBorrowLimitTokens.isLessThan(0)) {
      marginWithUserModerateRiskBorrowLimitTokens = new BigNumber(0);
    }

    // Borrow cap limit
    const marginWithBorrowCapTokens = asset.borrowCapTokens.minus(asset.borrowBalanceTokens);

    const maxTokens = BigNumber.min(
      assetLiquidityTokens,
      marginWithUserBorrowLimitTokens,
      marginWithBorrowCapTokens,
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

  const readableLimit = formatTokensToReadableValue({
    value: limitTokens,
    token: asset.vToken.underlyingToken,
  });

  const _debouncedInputAmountTokens = useDebounceValue(formValues.amountTokens);
  const debouncedInputAmountTokens = new BigNumber(_debouncedInputAmountTokens || 0);

  const balanceMutations: BalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: asset.vToken.address,
      action: 'borrow',
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
    pool,
    moderateRiskMaxTokens,
    limitTokens,
    onSubmitSuccess,
    onSubmit,
    formValues,
    setFormValues,
  });

  const handleToggleAcknowledgeRisk = (checked: boolean) => {
    if (checked) {
      captureAnalyticEvent('borrow_risks_acknowledged', {
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

  const captureAmountSetAnalyticEvent = ({
    amountTokens,
    maxSelected,
  }: { amountTokens: BigNumber | string; maxSelected: boolean; selectedPercentage?: number }) => {
    if (Number(formValues.amountTokens) > 0) {
      captureAnalyticEvent(
        'borrow_amount_set',
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

  const isRiskyOperation =
    hypotheticalHealthFactor !== undefined &&
    hypotheticalHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD;

  const shouldAskUserRiskAcknowledgement =
    isRiskyOperation && (!formError || formError?.code === 'REQUIRES_RISK_ACKNOWLEDGEMENT');

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {isEModeFeatureEnabled && pool.eModeGroups.length > 0 && !pool.userEModeGroup && (
          <EModeBanner poolComptrollerContractAddress={pool.comptrollerAddress} />
        )}

        <TokenTextField
          data-testid={TEST_IDS.tokenTextField}
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
          disabled={
            !isUserConnected ||
            isSubmitting ||
            formError?.code === 'BORROW_CAP_ALREADY_REACHED' ||
            formError?.code === 'NO_COLLATERALS'
          }
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

        {!isUserConnected && <ApyBreakdown pool={pool} balanceMutations={balanceMutations} />}
      </div>

      <ConnectWallet
        className={cn('space-y-4', isUserConnected ? 'mt-2' : 'mt-6')}
        analyticVariant="borrow_form"
      >
        <div className="space-y-4">
          <LabeledInlineContent
            label={t('operationForm.availableAmount')}
            data-testid={TEST_IDS.availableAmount}
          >
            {readableLimit}
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
            action="borrow"
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

export interface BorrowFormProps {
  asset: Asset;
  pool: Pool;
  onSubmitSuccess?: () => void;
}

const BorrowForm: React.FC<BorrowFormProps> = ({ asset, pool, onSubmitSuccess }) => {
  const { accountAddress } = useAccountAddress();

  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const isEModeFeatureEnabled = useIsFeatureEnabled({ name: 'eMode' });

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

  const { mutateAsync: borrow, isPending: isBorrowLoading } = useBorrow();

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

  const isSubmitting = isBorrowLoading;

  const onSubmit: BorrowFormUiProps['onSubmit'] = async ({ fromToken, fromTokenAmountTokens }) => {
    const amountMantissa = BigInt(
      convertTokensToMantissa({
        value: new BigNumber(fromTokenAmountTokens.trim()),
        token: fromToken,
      }).toFixed(),
    );

    return borrow({
      poolName: pool.name,
      poolComptrollerAddress: pool.comptrollerAddress,
      vToken: asset.vToken,
      amountMantissa,
      unwrap: formValues.receiveNativeToken,
    });
  };

  return (
    <BorrowFormUi
      isUserConnected={!!accountAddress}
      asset={asset}
      pool={pool}
      formValues={formValues}
      setFormValues={setFormValues}
      onSubmitSuccess={onSubmitSuccess}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      isDelegateApproved={isDelegateApproved}
      isDelegateApprovedLoading={isDelegateApprovedLoading}
      isApproveDelegateLoading={isUpdateDelegateStatusLoading}
      approveDelegateAction={() => updatePoolDelegateStatus({ approvedStatus: true })}
      isWrapUnwrapNativeTokenEnabled={isWrapUnwrapNativeTokenEnabled}
      isEModeFeatureEnabled={isEModeFeatureEnabled}
    />
  );
};

export default BorrowForm;
