import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@venusprotocol/ui';
import {
  Delimiter,
  Icon,
  LabeledInlineContent,
  RiskAcknowledgementToggle,
  SelectTokenTextField,
  ValueUpdate,
} from 'components';
import { HEALTH_FACTOR_MODERATE_THRESHOLD } from 'constants/healthFactor';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool, TokenBalance } from 'types';
import {
  areTokensEqual,
  calculateHealthFactor,
  convertTokensToMantissa,
  formatTokensToReadableValue,
} from 'utilities';

import { ConnectWallet } from 'containers/ConnectWallet';
import { SwapDetails } from 'containers/SwapDetails';
import { useAnalytics } from 'libs/analytics';
import { useAccountAddress } from 'libs/wallet';
import { AssetInfo } from '../AssetInfo';
import { OperationDetails } from '../OperationDetails';
import { calculateAmountDollars } from '../calculateAmountDollars';
import { calculateMarginTokens } from '../calculateMarginTokens';
import { LeverageSlider } from './LeverageSlider';
import SubmitSection from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

export interface BoostFormProps {
  asset: Asset;
  pool: Pool;
  onSubmitSuccess?: () => void;
}

const BoostForm: React.FC<BoostFormProps> = ({ asset: fromAsset, pool, onSubmitSuccess }) => {
  const { accountAddress } = useAccountAddress();

  const initialFormValues: FormValues = useMemo(() => {
    let initialToAsset = fromAsset;

    // Find asset with the highest collateral factor and initialize form with it
    let highestCollateralFactor = 0;

    pool.assets.forEach(a => {
      if (a.userCollateralFactor > highestCollateralFactor) {
        highestCollateralFactor = a.userCollateralFactor;
        initialToAsset = a;
      }
    });

    return {
      amountTokens: '',
      fromToken: fromAsset.vToken.underlyingToken,
      toToken: initialToAsset.vToken.underlyingToken,
      leverageFactor: '',
      acknowledgeRisk: false,
    };
  }, [fromAsset, pool.assets]);

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const toAsset =
    pool.assets.find(a => areTokensEqual(a.vToken.underlyingToken, formValues.toToken)) ||
    fromAsset;

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
              ).multipliedBy(fromAsset.tokenPriceCents),
            )
            .toNumber(),
          liquidationThresholdCents:
            // TODO: account for hypothetical supply balance after transaction
            pool.userLiquidationThresholdCents.toNumber(),
        })
      : undefined;

  // Calculate maximum amount of tokens user can borrow
  const [limitTokens, moderateRiskMaxTokens] = useMemo(() => {
    // Return 0 values while asset is loading or if borrow limit has been reached
    if (
      !pool.userBorrowBalanceCents ||
      !pool.userBorrowLimitCents ||
      !pool.userLiquidationThresholdCents ||
      pool.userBorrowBalanceCents.isGreaterThanOrEqualTo(pool.userBorrowLimitCents) ||
      fromAsset.borrowBalanceTokens.isGreaterThanOrEqualTo(fromAsset.borrowCapTokens)
    ) {
      return [new BigNumber(0), new BigNumber(0)];
    }

    // Liquidities limit
    const assetLiquidityTokens = fromAsset.liquidityCents
      // Convert to tokens
      .dividedBy(fromAsset.tokenPriceCents);

    // Borrow limit
    const marginWithUserBorrowLimitTokens = calculateMarginTokens({
      balanceCents: pool.userBorrowBalanceCents,
      limitCents: pool.userBorrowLimitCents,
      tokenPriceCents: fromAsset.tokenPriceCents,
    });

    const marginWithUserModerateRiskBorrowLimitTokens = calculateMarginTokens({
      balanceCents: pool.userBorrowBalanceCents,
      limitCents: pool.userLiquidationThresholdCents.div(HEALTH_FACTOR_MODERATE_THRESHOLD),
      tokenPriceCents: fromAsset.tokenPriceCents,
    });

    // Borrow cap limit
    const marginWithBorrowCapTokens = fromAsset.borrowCapTokens.minus(
      fromAsset.borrowBalanceTokens,
    );

    const maxTokens = BigNumber.min(
      assetLiquidityTokens,
      marginWithUserBorrowLimitTokens,
      marginWithBorrowCapTokens,
    );

    const moderateRiskMaxTokens = BigNumber.min(
      maxTokens,
      marginWithUserModerateRiskBorrowLimitTokens,
    ).dp(fromAsset.vToken.underlyingToken.decimals);

    return [maxTokens, moderateRiskMaxTokens];
  }, [fromAsset, pool]);

  const readableLimit = formatTokensToReadableValue({
    value: limitTokens,
    token: fromAsset.vToken.underlyingToken,
  });

  const userMarginWithBorrowLimitCents = pool.userBorrowLimitCents?.minus(
    pool.userBorrowBalanceCents || 0,
  );

  const tokenBalances: TokenBalance[] = userMarginWithBorrowLimitCents
    ? pool.assets.reduce<TokenBalance[]>((acc, asset) => {
        // Skip tokens that can't be collaterals
        if (asset.userCollateralFactor === 0) {
          return acc;
        }

        const balanceMantissa = convertTokensToMantissa({
          value: userMarginWithBorrowLimitCents.dividedBy(asset.tokenPriceCents),
          token: asset.vToken.underlyingToken,
        });

        const tokenBalance: TokenBalance = {
          token: asset.vToken.underlyingToken,
          balanceMantissa,
        };

        return [...acc, tokenBalance];
      }, [])
    : [];

  const { handleSubmit, isFormValid, formError } = useForm({
    asset: fromAsset,
    pool,
    moderateRiskMaxTokens,
    limitTokens,
    onSubmitSuccess,
    onSubmit,
    formValues,
    setFormValues,
    initialFormValues,
  });

  const handleToggleAcknowledgeRisk = (checked: boolean) => {
    if (checked) {
      captureAnalyticEvent('borrow_risks_acknowledged', {
        poolName: pool.name,
        assetSymbol: fromAsset.vToken.underlyingToken.symbol,
        usdAmount: calculateAmountDollars({
          amountTokens: formValues.amountTokens,
          tokenPriceCents: fromAsset.tokenPriceCents,
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

  const handleMaxButtonClick = () => {
    captureAmountSetAnalyticEvent({
      amountTokens: limitTokens,
      maxSelected: true,
    });

    // Update field value to correspond to user's wallet balance
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens: limitTokens.toFixed(),
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

  const isDisabled =
    !accountAddress ||
    isSubmitting ||
    formError?.code === 'BORROW_CAP_ALREADY_REACHED' ||
    formError?.code === 'NO_COLLATERALS';

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-x-[2px] text-grey text-sm">
            <p>
              {t('operationForm.boost.flows.borrow', {
                tokenSymbol: fromAsset.vToken.underlyingToken.symbol,
              })}
            </p>

            <Icon className="w-5 h-5" name="chevronRight" />

            <p>{t('operationForm.boost.flows.swap')}</p>

            <Icon className="w-5 h-5" name="chevronRight" />

            <p>
              {t('operationForm.boost.flows.supply', {
                tokenSymbol: toAsset.vToken.underlyingToken.symbol,
              })}
            </p>
          </div>

          <SelectTokenTextField
            data-testid={TEST_IDS.tokenTextField}
            name="amountTokens"
            displayTokenIcon
            token={formValues.fromToken}
            selectedToken={toAsset.vToken.underlyingToken}
            selectedTokenLabel={t('operationForm.boost.supply')}
            tokenBalances={tokenBalances}
            value={formValues.amountTokens}
            onChangeSelectedToken={toToken =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                toToken,
              }))
            }
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
            disabled={isDisabled}
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
        </div>

        {!accountAddress && <AssetInfo asset={fromAsset} action="borrow" />}
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
            <button
              className="transition-colors hover:text-blue"
              type="button"
              onClick={handleMaxButtonClick}
            >
              {readableLimit}
            </button>
          </LabeledInlineContent>

          <Delimiter />

          <LeverageSlider
            disabled={isDisabled}
            asset={toAsset}
            value={formValues.leverageFactor}
            onChange={leverageFactor =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                leverageFactor,
              }))
            }
          />

          <div className="space-y-2">
            <LabeledInlineContent
              label={t('operationForm.supplyBalance', {
                tokenSymbol: toAsset.vToken.underlyingToken.symbol,
              })}
              iconSrc={toAsset.vToken.underlyingToken}
            >
              <ValueUpdate
                original={formatTokensToReadableValue({
                  value: toAsset.userSupplyBalanceTokens,
                  token: toAsset.vToken.underlyingToken,
                  addSymbol: false,
                })}
                // TODO: add hypothetical supply balance
              />
            </LabeledInlineContent>

            <LabeledInlineContent
              label={t('operationForm.borrowBalance', {
                tokenSymbol: fromAsset.vToken.underlyingToken.symbol,
              })}
              iconSrc={fromAsset.vToken.underlyingToken}
            >
              <ValueUpdate
                original={formatTokensToReadableValue({
                  value: fromAsset.userBorrowBalanceTokens,
                  token: fromAsset.vToken.underlyingToken,
                  addSymbol: false,
                })}
                // TODO: add hypothetical borrow balance
              />
            </LabeledInlineContent>
          </div>

          <Delimiter />

          <SwapDetails
            // TODO: pass swap details
            fromToken={fromAsset.vToken.underlyingToken}
            toToken={toAsset.vToken.underlyingToken}
          />

          <Delimiter />

          <OperationDetails
            amountTokens={new BigNumber(formValues.amountTokens || 0)}
            asset={fromAsset}
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
