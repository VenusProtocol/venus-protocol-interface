import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
import useDelegateApproval from 'hooks/useDelegateApproval';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetNativeTokenGatewayContractAddress } from 'libs/contracts';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool } from 'types';
import { calculateHealthFactor, convertTokensToMantissa } from 'utilities';

import { NULL_ADDRESS } from 'constants/address';
import { ConnectWallet } from 'containers/ConnectWallet';
import { useAccountAddress } from 'libs/wallet';
import { AssetInfo } from '../AssetInfo';
import { OperationDetails } from '../OperationDetails';
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
  isWrapUnwrapNativeTokenEnabled,
  isDelegateApproved,
  isDelegateApprovedLoading,
  isApproveDelegateLoading,
  approveDelegateAction,
}) => {
  const { t } = useTranslation();
  const { nativeToken } = useGetChainMetadata();

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
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      acknowledgeRisk: checked,
    }));
  };

  const hypotheticalHealthFactor = useMemo(() => {
    if (
      !Number(formValues.amountTokens) ||
      !pool.userBorrowBalanceCents ||
      !pool.userBorrowLimitCents
    ) {
      return undefined;
    }

    const amountCents = new BigNumber(formValues.amountTokens).multipliedBy(asset.tokenPriceCents);

    return calculateHealthFactor({
      borrowBalanceCents: pool.userBorrowBalanceCents.plus(amountCents).toNumber(),
      borrowLimitCents: pool.userBorrowLimitCents.toNumber(),
    });
  }, [asset, pool, formValues.amountTokens]);

  // Calculate maximum amount of tokens user can borrow
  const [limitTokens, safeLimitTokens] = useMemo(() => {
    // Return 0 values while asset is loading or if borrow limit has been
    // reached
    if (
      !pool.userBorrowBalanceCents ||
      !pool.userBorrowLimitCents ||
      pool.userBorrowBalanceCents.isGreaterThanOrEqualTo(pool.userBorrowLimitCents)
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

    let marginWithUserSafeBorrowLimitTokens = pool.userBorrowLimitCents
      .div(HEALTH_FACTOR_SAFE_MAX_THRESHOLD)
      .minus(pool.userBorrowBalanceCents)
      // Convert to tokens
      .dividedBy(asset.tokenPriceCents);

    if (marginWithUserSafeBorrowLimitTokens.isLessThan(0)) {
      marginWithUserSafeBorrowLimitTokens = new BigNumber(0);
    }

    // Borrow cap limit
    const marginWithBorrowCapTokens = asset.borrowBalanceTokens.isLessThan(asset.borrowCapTokens)
      ? asset.borrowCapTokens.minus(asset.borrowBalanceTokens)
      : new BigNumber(0);

    const maxTokens = BigNumber.min(
      assetLiquidityTokens,
      marginWithUserBorrowLimitTokens,
      marginWithBorrowCapTokens,
    ).dp(asset.vToken.underlyingToken.decimals);

    const safeMaxTokens = BigNumber.min(maxTokens, marginWithUserSafeBorrowLimitTokens).dp(
      asset.vToken.underlyingToken.decimals,
    );

    return [maxTokens, safeMaxTokens];
  }, [asset, pool]);

  const readableLimit = useFormatTokensToReadableValue({
    value: limitTokens,
    token: asset.vToken.underlyingToken,
  });

  const { handleSubmit, isFormValid, formError } = useForm({
    asset,
    pool,
    hypotheticalHealthFactor,
    limitTokens,
    onSubmitSuccess,
    onSubmit,
    formValues,
    setFormValues,
  });

  const handleSafeMaxButtonClick = useCallback(() => {
    // Update field value to correspond to user's wallet balance
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens: safeLimitTokens.toFixed(),
    }));
  }, [safeLimitTokens, setFormValues]);

  const isRiskyOperation = useMemo(
    () =>
      hypotheticalHealthFactor !== undefined &&
      hypotheticalHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD &&
      (!formError || formError.code === 'REQUIRES_RISK_ACKNOWLEDGEMENT'),
    [hypotheticalHealthFactor, formError],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <TokenTextField
          data-testid={TEST_IDS.tokenTextField}
          name="amountTokens"
          token={asset.vToken.underlyingToken}
          value={formValues.amountTokens}
          onChange={amountTokens =>
            setFormValues(currentFormValues => ({
              ...currentFormValues,
              amountTokens,
            }))
          }
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

        {!isUserConnected && <AssetInfo asset={asset} action="borrow" />}
      </div>

      <ConnectWallet className={cn('space-y-6', isUserConnected ? 'mt-4' : 'mt-6')}>
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
            amountTokens={new BigNumber(formValues.amountTokens || 0)}
            asset={asset}
            action="borrow"
            pool={pool}
          />

          {isRiskyOperation && (
            <RiskAcknowledgementToggle
              value={formValues.acknowledgeRisk}
              onChange={(_, checked) => handleToggleAcknowledgeRisk(checked)}
            />
          )}
        </div>

        <SubmitSection
          isFormSubmitting={isSubmitting}
          isFormValid={isFormValid}
          formErrorCode={formError?.code}
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

  const nativeTokenGatewayContractAddress = useGetNativeTokenGatewayContractAddress({
    comptrollerContractAddress: pool.comptrollerAddress,
  });

  const {
    isDelegateApproved,
    isDelegateApprovedLoading,
    isUseUpdatePoolDelegateStatusLoading,
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
      isWrapUnwrapNativeTokenEnabled={isWrapUnwrapNativeTokenEnabled}
      asset={asset}
      pool={pool}
      formValues={formValues}
      setFormValues={setFormValues}
      onSubmitSuccess={onSubmitSuccess}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      isDelegateApproved={isDelegateApproved}
      isDelegateApprovedLoading={isDelegateApprovedLoading}
      isApproveDelegateLoading={isUseUpdatePoolDelegateStatusLoading}
      approveDelegateAction={() => updatePoolDelegateStatus({ approvedStatus: true })}
    />
  );
};

export default BorrowForm;
