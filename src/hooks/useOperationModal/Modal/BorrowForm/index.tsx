/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { AccountData, IsolatedAssetWarning, TokenTextField } from 'components';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool } from 'types';
import { convertTokensToWei } from 'utilities';

import { useBorrow } from 'clients/api';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';

import { useStyles as useSharedStyles } from '../styles';
import Notice from './Notice';
import SubmitSection from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { FormValues, UseFormInput } from './useForm';

export interface BorrowFormUiProps {
  asset: Asset;
  pool: Pool;
  onSubmit: UseFormInput['onSubmit'];
  isSubmitting: boolean;
  onCloseModal: () => void;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  formValues: FormValues;
}

export const BorrowFormUi: React.FC<BorrowFormUiProps> = ({
  asset,
  pool,
  onCloseModal,
  onSubmit,
  isSubmitting,
  setFormValues,
  formValues,
}) => {
  const { t, Trans } = useTranslation();
  const sharedStyles = useSharedStyles();

  // Calculate maximum and safe maximum amount of tokens user can borrow
  const [limitTokens, safeLimitTokens] = React.useMemo(() => {
    // Return 0 values while asset is loading or if borrow limit has been
    // reached
    if (
      !asset ||
      !pool ||
      pool.userBorrowBalanceCents === undefined ||
      !pool.userBorrowLimitCents ||
      pool.userBorrowBalanceCents.isGreaterThanOrEqualTo(pool.userBorrowLimitCents)
    ) {
      return ['0', '0'];
    }

    const marginWithBorrowLimitCents = pool.userBorrowLimitCents.minus(pool.userBorrowBalanceCents);
    const { liquidityCents } = asset;

    let maxTokens = BigNumber.minimum(liquidityCents, marginWithBorrowLimitCents)
      // Convert dollars to tokens
      .dividedBy(asset.tokenPriceCents);

    // Take borrow cap in consideration if asset has one
    if (asset.borrowCapTokens) {
      const marginWithBorrowCapTokens = asset.borrowCapTokens.minus(asset.borrowBalanceTokens);
      maxTokens = marginWithBorrowCapTokens.isLessThanOrEqualTo(0)
        ? new BigNumber(0)
        : BigNumber.minimum(maxTokens, marginWithBorrowCapTokens);
    }

    const safeBorrowLimitCents = pool.userBorrowLimitCents
      .multipliedBy(SAFE_BORROW_LIMIT_PERCENTAGE)
      .dividedBy(100);
    const marginWithSafeBorrowLimitCents = safeBorrowLimitCents.minus(pool.userBorrowBalanceCents);

    const safeMaxTokens = pool.userBorrowBalanceCents.isLessThan(safeBorrowLimitCents)
      ? // Convert dollars to tokens
        new BigNumber(marginWithSafeBorrowLimitCents).dividedBy(asset.tokenPriceCents)
      : new BigNumber(0);

    const formatValue = (value: BigNumber) =>
      value.dp(asset.vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN).toFixed();

    return [formatValue(maxTokens), formatValue(safeMaxTokens)];
  }, [asset.vToken.underlyingToken.decimals, asset, pool]);

  const readableLimit = useFormatTokensToReadableValue({
    value: new BigNumber(limitTokens),
    token: asset.vToken.underlyingToken,
  });

  const { handleSubmit, isFormValid, formError } = useForm({
    asset,
    userBorrowLimitCents: pool.userBorrowLimitCents && pool.userBorrowLimitCents.toNumber(),
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
      amountTokens: safeLimitTokens,
    }));
  }, [safeLimitTokens]);

  return (
    <form onSubmit={handleSubmit}>
      {pool.isIsolated && (
        <IsolatedAssetWarning
          pool={pool}
          token={asset.vToken.underlyingToken}
          type="borrow"
          css={sharedStyles.isolatedAssetWarning}
        />
      )}

      <div css={[sharedStyles.getRow({ isLast: true })]}>
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
            isSubmitting ||
            formError === 'BORROW_CAP_ALREADY_REACHED' ||
            formError === 'NO_COLLATERALS'
          }
          rightMaxButton={{
            label: t('operationModal.borrow.rightMaxButtonLabel', {
              limitPercentage: SAFE_BORROW_LIMIT_PERCENTAGE,
            }),
            onClick: handleRightMaxButtonClick,
          }}
          hasError={!!formError && Number(formValues.amountTokens) > 0}
          description={
            <Trans
              i18nKey="operationModal.borrow.borrowableAmount"
              components={{
                White: <span css={sharedStyles.whiteLabel} />,
              }}
              values={{ amount: readableLimit }}
            />
          }
        />

        {!isSubmitting && (
          <Notice
            hasUserCollateralizedSuppliedAssets={formError !== 'NO_COLLATERALS'}
            amount={formValues.amountTokens}
            safeLimitTokens={safeLimitTokens}
            limitTokens={limitTokens}
            formError={formError}
            asset={asset}
          />
        )}
      </div>

      <AccountData
        asset={asset}
        pool={pool}
        amountTokens={new BigNumber(formValues.amountTokens || 0)}
        action="borrow"
      />

      <SubmitSection
        isFormSubmitting={isSubmitting}
        safeLimitTokens={safeLimitTokens}
        isFormValid={isFormValid}
        formError={formError}
        fromTokenAmountTokens={formValues.amountTokens}
      />
    </form>
  );
};

export interface BorrowFormProps {
  asset: Asset;
  pool: Pool;
  onCloseModal: () => void;
}

const BorrowForm: React.FC<BorrowFormProps> = ({ asset, pool, onCloseModal }) => {
  const [formValues, setFormValues] = useState<FormValues>({
    amountTokens: '',
    fromToken: asset.vToken.underlyingToken,
  });

  const { mutateAsync: borrow, isLoading: isBorrowLoading } = useBorrow({
    vToken: asset.vToken,
  });

  const isSubmitting = isBorrowLoading;

  const onSubmit: BorrowFormUiProps['onSubmit'] = async ({ fromToken, fromTokenAmountTokens }) => {
    const amountWei = convertTokensToWei({
      value: new BigNumber(fromTokenAmountTokens.trim()),
      token: fromToken,
    });

    return borrow({ amountWei });
  };

  return (
    <BorrowFormUi
      asset={asset}
      pool={pool}
      formValues={formValues}
      setFormValues={setFormValues}
      onCloseModal={onCloseModal}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default BorrowForm;
