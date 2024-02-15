/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';

import { useGetVTokenBalanceOf, useRedeem, useRedeemUnderlying } from 'clients/api';
import { Delimiter, LabeledInlineContent, Toggle, TokenTextField } from 'components';
import { AccountData } from 'containers/AccountData';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { Asset, Pool } from 'types';
import { convertTokensToMantissa } from 'utilities';

import { useStyles as useSharedStyles } from '../styles';
import Notice from './Notice';
import SubmitSection from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { FormValues, UseFormInput } from './useForm';

export interface WithdrawFormUiProps {
  asset: Asset;
  pool: Pool;
  onSubmit: UseFormInput['onSubmit'];
  isSubmitting: boolean;
  onCloseModal: () => void;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  formValues: FormValues;
}

export const WithdrawFormUi: React.FC<WithdrawFormUiProps> = ({
  onCloseModal,
  asset,
  pool,
  setFormValues,
  formValues,
  onSubmit,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  const { nativeToken } = useGetChainMetadata();
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });

  const canUnwrapToNativeToken = useMemo(
    () => isWrapUnwrapNativeTokenEnabled && !!asset.vToken.underlyingToken.wrapsNative,
    [isWrapUnwrapNativeTokenEnabled, asset.vToken.underlyingToken.wrapsNative],
  );

  const handleToggleReceiveNativeToken = async () => {
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      receiveNativeToken: !currentFormValues.receiveNativeToken,
    }));
  };

  const limitTokens = useMemo(() => {
    const assetLiquidityTokens = new BigNumber(asset.liquidityCents).dividedBy(
      asset.tokenPriceCents,
    );
    // If asset isn't used as collateral user can withdraw the entire supply balance without
    // affecting their borrow limit, if there's enough liquidity
    let maxTokensBeforeLiquidation = BigNumber.minimum(
      asset.userSupplyBalanceTokens,
      assetLiquidityTokens,
    );

    if (
      !asset ||
      !asset.isCollateralOfUser ||
      pool?.userBorrowLimitCents === undefined ||
      pool?.userBorrowBalanceCents === undefined ||
      pool.userBorrowBalanceCents.isEqualTo(0)
    ) {
      return maxTokensBeforeLiquidation;
    }

    // Calculate how much token user can withdraw before they risk getting
    // liquidated (if their borrow balance goes above their borrow limit)

    // Return 0 if borrow limit has already been reached
    if (pool.userBorrowBalanceCents.isGreaterThanOrEqualTo(pool.userBorrowLimitCents)) {
      return new BigNumber(0);
    }

    const marginWithBorrowLimitCents = pool.userBorrowLimitCents.minus(pool.userBorrowBalanceCents);

    const collateralAmountPerTokenCents = asset.tokenPriceCents.multipliedBy(
      asset.collateralFactor,
    );

    maxTokensBeforeLiquidation = new BigNumber(marginWithBorrowLimitCents)
      .dividedBy(collateralAmountPerTokenCents)
      .dp(asset.vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN);

    maxTokensBeforeLiquidation = BigNumber.minimum(
      maxTokensBeforeLiquidation,
      asset.userSupplyBalanceTokens,
      assetLiquidityTokens,
    );

    maxTokensBeforeLiquidation = maxTokensBeforeLiquidation.isLessThanOrEqualTo(0)
      ? new BigNumber(0)
      : maxTokensBeforeLiquidation;

    return maxTokensBeforeLiquidation;
  }, [asset, pool]);

  const { handleSubmit, isFormValid, formError } = useForm({
    asset,
    limitTokens,
    onCloseModal,
    onSubmit,
    formValues,
    setFormValues,
  });

  const handleRightMaxButtonClick = useCallback(() => {
    // Update field value to correspond to user's wallet balance
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens: limitTokens.toString(),
    }));
  }, [limitTokens, setFormValues]);

  const readableWithdrawableAmountTokens = useFormatTokensToReadableValue({
    value: limitTokens,
    token: formValues.fromToken,
  });

  if (!asset) {
    return <></>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div css={[sharedStyles.getRow({ isLast: true })]}>
        <TokenTextField
          data-testid={TEST_IDS.valueInput}
          name="amountTokens"
          token={asset.vToken.underlyingToken}
          value={formValues.amountTokens}
          onChange={amountTokens =>
            setFormValues(currentFormValues => ({
              ...currentFormValues,
              amountTokens,
            }))
          }
          disabled={isSubmitting}
          rightMaxButton={{
            label: t('operationModal.withdraw.rightMaxButtonLabel'),
            onClick: handleRightMaxButtonClick,
          }}
          hasError={!!formError && Number(formValues.amountTokens) > 0}
        />

        {canUnwrapToNativeToken && (
          <div data-testid={TEST_IDS.receiveNativeToken}>
            <Delimiter className="my-6 md:my-8" />

            <LabeledInlineContent
              label={t('operationModal.withdraw.receiveNativeToken.label', {
                tokenSymbol: nativeToken.symbol,
              })}
              tooltip={t('operationModal.withdraw.receiveNativeToken.tooltip', {
                wrappedNativeTokenSymbol: asset.vToken.underlyingToken.symbol,
                nativeTokenSymbol: nativeToken.symbol,
              })}
              css={sharedStyles.getRow({ isLast: true })}
            >
              <Toggle
                onChange={handleToggleReceiveNativeToken}
                value={formValues.receiveNativeToken}
              />
            </LabeledInlineContent>

            <Delimiter className="my-6 md:my-8" />
          </div>
        )}

        {!isSubmitting && (
          <Notice amount={formValues.amountTokens} formError={formError} asset={asset} />
        )}
      </div>

      <LabeledInlineContent
        label={t('operationModal.withdraw.withdrawableAmount')}
        css={sharedStyles.getRow({ isLast: true })}
      >
        {readableWithdrawableAmountTokens}
      </LabeledInlineContent>

      <Delimiter css={sharedStyles.getRow({ isLast: true })} />

      <AccountData
        amountTokens={new BigNumber(formValues.amountTokens || 0)}
        asset={asset}
        pool={pool}
        action="withdraw"
        className="mb-6"
      />

      <SubmitSection
        isFormSubmitting={isSubmitting}
        isFormValid={isFormValid}
        formError={formError}
      />
    </form>
  );
};

export interface WithdrawFormProps {
  asset: Asset;
  pool: Pool;
  onCloseModal: () => void;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ asset, pool, onCloseModal }) => {
  const { accountAddress } = useAccountAddress();

  const [formValues, setFormValues] = useState<FormValues>({
    amountTokens: '',
    fromToken: asset.vToken.underlyingToken,
    receiveNativeToken: false,
  });

  const { data: getVTokenBalanceData } = useGetVTokenBalanceOf(
    {
      accountAddress: accountAddress || '',
      vToken: asset.vToken,
    },
    {
      enabled: !!accountAddress,
    },
  );
  const vTokenBalanceMantissa = getVTokenBalanceData?.balanceMantissa;

  const { mutateAsync: redeem, isLoading: isRedeemLoading } = useRedeem({
    poolName: pool.name,
    vToken: asset.vToken,
  });

  const { mutateAsync: redeemUnderlying, isLoading: isRedeemUnderlyingLoading } =
    useRedeemUnderlying({
      poolName: pool.name,
      vToken: asset.vToken,
    });

  const isWithdrawLoading = isRedeemLoading || isRedeemUnderlyingLoading;

  const onSubmit: UseFormInput['onSubmit'] = async ({ fromToken, fromTokenAmountTokens }) => {
    // This cose should never be reached, but just in case we throw a generic
    // internal error
    if (!asset) {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    const amountEqualsSupplyBalance =
      asset.userSupplyBalanceTokens.isEqualTo(fromTokenAmountTokens);

    // Withdraw partial supply
    if (!amountEqualsSupplyBalance) {
      const withdrawAmountMantissa = convertTokensToMantissa({
        value: new BigNumber(fromTokenAmountTokens),
        token: fromToken,
      });

      return redeemUnderlying({
        amountMantissa: withdrawAmountMantissa,
      });
    }

    // Withdraw entire supply
    if (vTokenBalanceMantissa) {
      return redeem({ amountMantissa: vTokenBalanceMantissa });
    }

    // This cose should never be reached, but just in case we throw a generic
    // internal error
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  };

  return (
    <WithdrawFormUi
      onCloseModal={onCloseModal}
      asset={asset}
      pool={pool}
      formValues={formValues}
      setFormValues={setFormValues}
      onSubmit={onSubmit}
      isSubmitting={isWithdrawLoading}
    />
  );
};

export default WithdrawForm;
