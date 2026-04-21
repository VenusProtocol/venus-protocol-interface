import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import { useBorrow } from 'clients/api';
import { Delimiter, LabeledInlineContent, Toggle, TokenTextField } from 'components';
import {
  HEALTH_FACTOR_MODERATE_THRESHOLD,
  HEALTH_FACTOR_SAFE_MAX_THRESHOLD,
} from 'constants/healthFactor';
import { useChain } from 'hooks/useChain';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import type { Asset, AssetBalanceMutation, Pool } from 'types';
import { convertTokensToMantissa, formatTokensToReadableValue } from 'utilities';

import { NULL_ADDRESS } from 'constants/address';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { useAnalytics } from 'libs/analytics';
import { useAccountAddress } from 'libs/wallet';
import { Footer } from '../Footer';
import type { Approval } from '../Footer/types';
import { calculateAmountDollars } from '../calculateAmountDollars';
import { EModeBanner } from './EModeBanner';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

export interface BorrowFormProps {
  asset: Asset;
  pool: Pool;
  onSubmitSuccess?: () => void;
}

const BorrowForm: React.FC<BorrowFormProps> = ({ asset, pool, onSubmitSuccess }) => {
  const { t } = useTranslation();
  const { nativeToken } = useChain();
  const { captureAnalyticEvent } = useAnalytics();
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
    [asset.vToken.underlyingToken],
  );

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  // Reset form when user disconnects their wallet
  useEffect(() => {
    if (!accountAddress) {
      setFormValues(initialFormValues);
    }
  }, [accountAddress, initialFormValues]);

  // Reset form when initial values change, which indicates the base asset was changed
  useEffect(() => {
    setFormValues(initialFormValues);
  }, [initialFormValues]);

  const { mutateAsync: borrow, isPending: isSubmitting } = useBorrow();

  const { address: nativeTokenGatewayContractAddress } = useGetContractAddress({
    name: 'NativeTokenGateway',
    poolComptrollerContractAddress: pool.comptrollerAddress,
  });

  const isUserConnected = !!accountAddress;

  const onSubmit: UseFormInput['onSubmit'] = async ({ fromToken, fromTokenAmountTokens }) => {
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

  // Calculate maximum amount of tokens user can borrow
  const [limitTokens, safeLimitTokens, moderateRiskMaxTokens] = useMemo(() => {
    // Return 0 values while asset is loading or if borrow limit has been
    // reached
    if (
      !pool.userBorrowBalanceCents ||
      !pool.userBorrowLimitCents ||
      !pool.userLiquidationThresholdCents ||
      pool.userBorrowBalanceProtectedCents?.isGreaterThanOrEqualTo(
        pool.userBorrowLimitProtectedCents ?? 0,
      ) ||
      asset.borrowBalanceTokens.isGreaterThanOrEqualTo(asset.borrowCapTokens)
    ) {
      return [new BigNumber(0), new BigNumber(0), new BigNumber(0)];
    }

    // Liquidities limit
    const assetLiquidityTokens = asset.liquidityCents
      // Convert to tokens
      .dividedBy(asset.tokenPriceCents);

    // Borrow limit (uses protected prices to match contract behavior)
    const marginWithUserBorrowLimitTokens = (pool.userBorrowLimitProtectedCents ?? new BigNumber(0))
      .minus(pool.userBorrowBalanceProtectedCents ?? 0)
      // Convert to tokens
      .dividedBy(asset.tokenBorrowPriceCents);

    let marginWithUserSafeBorrowLimitTokens =
      // We base the safe borrow limit on the liquidation threshold because that's the base used to
      // calculate the health factor (spot-based, since liquidation uses spot)
      pool.userLiquidationThresholdCents
        .div(HEALTH_FACTOR_SAFE_MAX_THRESHOLD)
        .minus(pool.userBorrowBalanceCents)
        // Convert to tokens (spot, to match health factor pricing)
        .dividedBy(asset.tokenPriceCents);

    if (marginWithUserSafeBorrowLimitTokens.isLessThan(0)) {
      marginWithUserSafeBorrowLimitTokens = new BigNumber(0);
    }

    let marginWithUserModerateRiskBorrowLimitTokens = pool.userLiquidationThresholdCents
      .div(HEALTH_FACTOR_MODERATE_THRESHOLD)
      .minus(pool.userBorrowBalanceCents)
      // Convert to tokens (spot, to match health factor pricing)
      .dividedBy(asset.tokenPriceCents);

    if (marginWithUserModerateRiskBorrowLimitTokens.isLessThan(0)) {
      marginWithUserModerateRiskBorrowLimitTokens = new BigNumber(0);
    }

    // TODO: remove debug logs
    {
      const borrowLimitProtected = pool.userBorrowLimitProtectedCents ?? new BigNumber(0);
      const borrowBalanceProtected = pool.userBorrowBalanceProtectedCents ?? new BigNumber(0);
      const borrowLimitSpot = pool.userBorrowLimitCents ?? new BigNumber(0);
      const borrowBalanceSpot = pool.userBorrowBalanceCents ?? new BigNumber(0);
      const isProtected = asset.isProtectionModeEnabled;
      console.log(
        `[BORROW_DEBUG] ${asset.vToken.underlyingToken.symbol} protectionMode=${isProtected}`,
      );
      console.log(
        `[BORROW_DEBUG]   prices: spot=$${asset.tokenPriceCents.dividedBy(100).toFixed(2)}, supplyPrice=$${asset.tokenSupplyPriceCents.dividedBy(100).toFixed(2)}, borrowPrice=$${asset.tokenBorrowPriceCents.dividedBy(100).toFixed(2)}`,
      );
      console.log(
        `[BORROW_DEBUG]   borrowLimit: spot=$${borrowLimitSpot.dividedBy(100).toFixed(2)}, protected=$${borrowLimitProtected.dividedBy(100).toFixed(2)}`,
      );
      console.log(
        `[BORROW_DEBUG]   borrowBalance: spot=$${borrowBalanceSpot.dividedBy(100).toFixed(2)}, protected=$${borrowBalanceProtected.dividedBy(100).toFixed(2)}`,
      );
      console.log(
        `[BORROW_DEBUG]   hardLimitTokens=${marginWithUserBorrowLimitTokens.toFixed(4)} (protected limit - protected balance) / borrowPrice`,
      );
      console.log(
        `[BORROW_DEBUG]   safeLimitTokens=${marginWithUserSafeBorrowLimitTokens.toFixed(4)} (spot-based, for HF)`,
      );
      console.log(
        `[BORROW_DEBUG]   moderateLimitTokens=${marginWithUserModerateRiskBorrowLimitTokens.toFixed(4)} (spot-based, for HF)`,
      );
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

  const balanceMutations: AssetBalanceMutation[] = [
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
    limitTokens,
    balanceMutations,
    simulatedPool,
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

  const approval: Approval | undefined =
    formValues.receiveNativeToken && isWrapUnwrapNativeTokenEnabled
      ? {
          type: 'delegate',
          delegateeAddress: nativeTokenGatewayContractAddress || NULL_ADDRESS,
          poolComptrollerContractAddress: pool.comptrollerAddress,
        }
      : undefined;

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

        {isUserConnected && (
          <>
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
          </>
        )}

        <Footer
          analyticVariant="borrow_form"
          balanceMutations={balanceMutations}
          pool={pool}
          simulatedPool={simulatedPool}
          submitButtonLabel={t('operationForm.submitButtonLabel.borrow')}
          isFormValid={isFormValid}
          approval={approval}
          isLoading={isSubmitting}
          isUserAcknowledgingRisk={formValues.acknowledgeRisk}
          setAcknowledgeRisk={handleToggleAcknowledgeRisk}
        />
      </div>
    </form>
  );
};

export default BorrowForm;
