import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@venusprotocol/ui';
import {
  Delimiter,
  LabeledInlineContent,
  RiskAcknowledgementToggle,
  TokenTextField,
} from 'components';
import { HEALTH_FACTOR_MODERATE_THRESHOLD } from 'constants/healthFactor';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool } from 'types';
import { calculateHealthFactor, formatTokensToReadableValue } from 'utilities';

import { ConnectWallet } from 'containers/ConnectWallet';
import { useAnalytics } from 'libs/analytics';
import { useAccountAddress } from 'libs/wallet';
import { AssetInfo } from '../AssetInfo';
import { OperationDetails } from '../OperationDetails';
import { calculateAmountDollars } from '../calculateAmountDollars';
import { calculateMarginTokens } from '../calculateMarginTokens';
import SubmitSection from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

export interface BoostFormProps {
  asset: Asset;
  pool: Pool;
  onSubmitSuccess?: () => void;
}

const BoostForm: React.FC<BoostFormProps> = ({ asset, pool, onSubmitSuccess }) => {
  const { accountAddress } = useAccountAddress();

  const initialFormValues: FormValues = {
    amountTokens: '',
    fromToken: asset.vToken.underlyingToken,
    toToken: pool.assets[0].vToken.underlyingToken,
    acknowledgeRisk: false,
  };

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  // Reset form when user disconnects their wallet
  useEffect(() => {
    if (!accountAddress) {
      setFormValues(initialFormValues);
    }
  }, [accountAddress, initialFormValues]);

  const isSubmitting = false; // TODO: wire up

  const onSubmit: UseFormInput['onSubmit'] = async () => {
    // TODO: wire up
  };

  const { t } = useTranslation();
  const { captureAnalyticEvent } = useAnalytics();

  const hypotheticalHealthFactor =
    Number(formValues.amountTokens) &&
    pool.userBorrowBalanceCents &&
    pool.userLiquidationThresholdCents
      ? calculateHealthFactor({
          borrowBalanceCents: pool.userBorrowBalanceCents
            .plus(
              new BigNumber(
                // TODO: account for hypothetical borrow balance after swap
                formValues.amountTokens,
              ).multipliedBy(asset.tokenPriceCents),
            )
            .toNumber(),
          liquidationThresholdCents:
            // TODO: account for hypothetical supply balance after transaction
            pool.userLiquidationThresholdCents.toNumber(),
        })
      : undefined;

  // Calculate maximum amount of tokens user can borrow
  const [limitTokens, moderateRiskMaxTokens] = useMemo(() => {
    // Return 0 values while asset is loading or if borrow limit has been
    // reached
    if (
      !pool.userBorrowBalanceCents ||
      !pool.userBorrowLimitCents ||
      !pool.userLiquidationThresholdCents ||
      pool.userBorrowBalanceCents.isGreaterThanOrEqualTo(pool.userBorrowLimitCents) ||
      asset.borrowBalanceTokens.isGreaterThanOrEqualTo(asset.borrowCapTokens)
    ) {
      return [new BigNumber(0), new BigNumber(0)];
    }

    // Liquidities limit
    const assetLiquidityTokens = asset.liquidityCents
      // Convert to tokens
      .dividedBy(asset.tokenPriceCents);

    // Borrow limit
    const marginWithUserBorrowLimitTokens = calculateMarginTokens({
      balanceCents: pool.userBorrowBalanceCents,
      limitCents: pool.userBorrowLimitCents,
      tokenPriceCents: asset.tokenPriceCents,
    });

    const marginWithUserModerateRiskBorrowLimitTokens = calculateMarginTokens({
      balanceCents: pool.userBorrowBalanceCents,
      limitCents: pool.userLiquidationThresholdCents.div(HEALTH_FACTOR_MODERATE_THRESHOLD),
      tokenPriceCents: asset.tokenPriceCents,
    });

    // Borrow cap limit
    const marginWithBorrowCapTokens = asset.borrowCapTokens.minus(asset.borrowBalanceTokens);

    const maxTokens = BigNumber.min(
      assetLiquidityTokens,
      marginWithUserBorrowLimitTokens,
      marginWithBorrowCapTokens,
    );

    const moderateRiskMaxTokens = BigNumber.min(
      maxTokens,
      marginWithUserModerateRiskBorrowLimitTokens,
    ).dp(asset.vToken.underlyingToken.decimals);

    return [maxTokens, moderateRiskMaxTokens];
  }, [asset, pool]);

  const readableLimit = formatTokensToReadableValue({
    value: limitTokens,
    token: asset.vToken.underlyingToken,
  });

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
    amountTokens: _amountTokens,
    maxSelected: _maxSelected,
  }: { amountTokens: BigNumber | string; maxSelected: boolean; selectedPercentage?: number }) => {
    // TODO: capture event
  };

  const isRiskyOperation =
    hypotheticalHealthFactor !== undefined &&
    hypotheticalHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD;

  const shouldAskUserRiskAcknowledgement =
    isRiskyOperation && (!formError || formError?.code === 'REQUIRES_RISK_ACKNOWLEDGEMENT');

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
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
            !accountAddress ||
            isSubmitting ||
            formError?.code === 'BORROW_CAP_ALREADY_REACHED' ||
            formError?.code === 'NO_COLLATERALS'
          }
          hasError={
            !!accountAddress &&
            !isSubmitting &&
            Number(formValues.amountTokens) > 0 &&
            !!formError &&
            formError.code !== 'REQUIRES_RISK_ACKNOWLEDGEMENT'
          }
          description={
            !!accountAddress && !isSubmitting && !!formError?.message ? (
              <p className="text-red">{formError.message}</p>
            ) : undefined
          }
        />

        {!accountAddress && <AssetInfo asset={asset} action="borrow" />}
      </div>

      <ConnectWallet
        className={cn('space-y-6', accountAddress ? 'mt-4' : 'mt-6')}
        // TODO: add analytic variant
      >
        <div className="space-y-4">
          <LabeledInlineContent
            label={t('operationForm.availableAmount')}
            data-testid={TEST_IDS.availableAmount}
          >
            {readableLimit}
          </LabeledInlineContent>

          <Delimiter />

          <OperationDetails
            amountTokens={new BigNumber(formValues.amountTokens || 0)}
            asset={asset}
            action="borrow"
            pool={pool}
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
          formErrorCode={formError?.code}
        />
      </ConnectWallet>
    </form>
  );
};

export default BoostForm;
