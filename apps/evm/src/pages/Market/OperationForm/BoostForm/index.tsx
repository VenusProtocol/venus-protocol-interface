import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import {
  Delimiter,
  LabeledInlineContent,
  RiskAcknowledgementToggle,
  SelectTokenTextField,
} from 'components';
import { HEALTH_FACTOR_MODERATE_THRESHOLD } from 'constants/healthFactor';
import { ConnectWallet } from 'containers/ConnectWallet';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { useAnalytics } from 'libs/analytics';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, BalanceMutation, Pool, TokenBalance } from 'types';
import { areTokensEqual, convertTokensToMantissa, formatTokensToReadableValue } from 'utilities';
import { ApyBreakdown } from '../ApyBreakdown';
import { calculateAmountDollars } from '../calculateAmountDollars';
import { Flow } from './Flow';
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

    // TODO: calculate
    const maxTokens = new BigNumber(100);
    const moderateRiskMaxTokens = new BigNumber(80);

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
        if (asset.userCollateralFactor === 0 || asset.vToken.symbol === 'vBNB') {
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

  const balanceMutations: BalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: fromAsset.vToken.address,
      action: 'supply',
      amountTokens: new BigNumber(formValues.amountTokens || 0),
    },
  ];

  const { data: getSimulatedPoolData } = useSimulateBalanceMutations({
    pool,
    balanceMutations,
  });
  const simulatedPool = getSimulatedPoolData?.pool;

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
    simulatedPool?.userHealthFactor !== undefined &&
    simulatedPool?.userHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD;

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
          <Flow
            fromTokenSymbol={fromAsset.vToken.underlyingToken.symbol}
            toTokenSymbol={toAsset.vToken.underlyingToken.symbol}
          />

          <SelectTokenTextField
            data-testid={TEST_IDS.selectTokenTextField}
            name="amountTokens"
            displayTokenIcon
            token={fromAsset.vToken.underlyingToken}
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

        {!accountAddress && <ApyBreakdown pool={pool} balanceMutations={balanceMutations} />}
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

          {/* TODO: update */}
          <LeverageSlider
            disabled={isDisabled}
            fromAsset={fromAsset}
            toAsset={toAsset}
            value="10"
            onChange={leverageFactor =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                leverageFactor,
              }))
            }
          />

          <Delimiter />

          {/* TODO: add operation details */}

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
