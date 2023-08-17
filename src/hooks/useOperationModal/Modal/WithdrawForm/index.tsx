/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { AccountData, Delimiter, LabeledInlineContent, TokenTextField } from 'components';
import { VError } from 'errors';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool } from 'types';
import { convertTokensToWei } from 'utilities';

import { useGetVTokenBalanceOf, useRedeem, useRedeemUnderlying } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';

import { useStyles as useSharedStyles } from '../styles';
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

  const limitTokens = React.useMemo(() => {
    // If asset isn't used as collateral user can withdraw the entire supply
    // balance without affecting their borrow limit
    let maxTokensBeforeLiquidation = new BigNumber(asset.userSupplyBalanceTokens);

    if (
      !asset ||
      !asset.isCollateralOfUser ||
      pool?.userBorrowBalanceCents === undefined ||
      pool?.userBorrowLimitCents === undefined
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
    );

    maxTokensBeforeLiquidation = maxTokensBeforeLiquidation.isLessThanOrEqualTo(0)
      ? new BigNumber(0)
      : maxTokensBeforeLiquidation;

    return maxTokensBeforeLiquidation;
  }, [asset, pool]);

  if (!asset) {
    return <></>;
  }

  const { handleSubmit, isFormValid, formError } = useForm({
    asset,
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
  }, [limitTokens]);

  const readableWithdrawableAmountTokens = useFormatTokensToReadableValue({
    value: limitTokens,
    token: formValues.fromToken,
  });

  return (
    <form onSubmit={handleSubmit}>
      <TokenTextField
        data-testid={TEST_IDS.valueInput}
        name="amountTokens"
        css={sharedStyles.getRow({ isLast: true })}
        token={asset.vToken.underlyingToken}
        value={formValues.amountTokens}
        onChange={amountTokens =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            amountTokens,
          }))
        }
        disabled={isSubmitting || formError === 'HIGHER_THAN_WITHDRAWABLE_AMOUNT'}
        rightMaxButton={{
          label: t('operationModal.withdraw.rightMaxButtonLabel'),
          onClick: handleRightMaxButtonClick,
        }}
        hasError={!!formError && Number(formValues.amountTokens) > 0}
      />

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
      />

      <SubmitSection
        isFormSubmitting={isSubmitting}
        isFormValid={isFormValid}
        formError={formError}
        fromTokenAmountTokens={formValues.amountTokens}
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
  const { accountAddress } = useAuth();

  const [formValues, setFormValues] = useState<FormValues>({
    amountTokens: '',
    fromToken: asset.vToken.underlyingToken,
  });

  const { data: getVTokenBalanceData } = useGetVTokenBalanceOf(
    {
      accountAddress,
      vToken: asset.vToken,
    },
    {
      enabled: !!accountAddress,
    },
  );
  const vTokenBalanceWei = getVTokenBalanceData?.balanceWei;

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
      const withdrawAmountWei = convertTokensToWei({
        value: new BigNumber(fromTokenAmountTokens),
        token: fromToken,
      });

      return redeemUnderlying({
        amountWei: withdrawAmountWei,
      });
    }

    // Withdraw entire supply
    if (vTokenBalanceWei) {
      return redeem({ amountWei: vTokenBalanceWei });
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
