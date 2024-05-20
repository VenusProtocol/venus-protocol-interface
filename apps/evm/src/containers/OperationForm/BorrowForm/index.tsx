import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';

import { useBorrow } from 'clients/api';
import { Delimiter, LabeledInlineContent, Toggle, TokenTextField } from 'components';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { AccountData } from 'containers/AccountData';
import useDelegateApproval from 'hooks/useDelegateApproval';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetNativeTokenGatewayContractAddress } from 'libs/contracts';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool } from 'types';
import { convertTokensToMantissa } from 'utilities';

import Notice from './Notice';
import SubmitSection from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

export interface BorrowFormUiProps {
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

  // Calculate maximum and safe maximum amount of tokens user can borrow
  const [limitTokens, safeLimitTokens] = useMemo(() => {
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
  }, [asset, pool]);

  const readableLimit = useFormatTokensToReadableValue({
    value: new BigNumber(limitTokens),
    token: asset.vToken.underlyingToken,
  });

  const { handleSubmit, isFormValid, formError } = useForm({
    asset,
    userBorrowLimitCents: pool.userBorrowLimitCents?.toNumber(),
    limitTokens,
    onSubmitSuccess,
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
  }, [safeLimitTokens, setFormValues]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          formError?.code === 'BORROW_CAP_ALREADY_REACHED' ||
          formError?.code === 'NO_COLLATERALS'
        }
        rightMaxButton={{
          label: t('operationModal.borrow.rightMaxButtonLabel', {
            limitPercentage: SAFE_BORROW_LIMIT_PERCENTAGE,
          }),
          onClick: handleRightMaxButtonClick,
        }}
        hasError={!!formError && Number(formValues.amountTokens) > 0}
        description={
          !isSubmitting && !!formError?.message ? (
            <p className="text-red">{formError.message}</p>
          ) : undefined
        }
      />

      {!isSubmitting && !formError && (
        <Notice
          amount={formValues.amountTokens}
          safeLimitTokens={safeLimitTokens}
          limitTokens={limitTokens}
        />
      )}

      <LabeledInlineContent label={t('operationModal.borrow.borrowableAmount')}>
        {readableLimit}
      </LabeledInlineContent>

      <Delimiter />

      {canUnwrapToNativeToken && (
        <>
          <LabeledInlineContent
            data-testid={TEST_IDS.receiveNativeToken}
            label={t('operationModal.borrow.receiveNativeToken.label', {
              tokenSymbol: nativeToken.symbol,
            })}
            tooltip={t('operationModal.borrow.receiveNativeToken.tooltip', {
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

      <div className="space-y-6">
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
          fromTokenAmountTokens={formValues.amountTokens}
          isDelegateApproved={isDelegateApproved}
          isDelegateApprovedLoading={isDelegateApprovedLoading}
          approveDelegateAction={approveDelegateAction}
          isApproveDelegateLoading={isApproveDelegateLoading}
        />
      </div>
    </form>
  );
};

export interface BorrowFormProps {
  asset: Asset;
  pool: Pool;
  onSubmitSuccess?: () => void;
}

const BorrowForm: React.FC<BorrowFormProps> = ({ asset, pool, onSubmitSuccess }) => {
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const [formValues, setFormValues] = useState<FormValues>({
    amountTokens: '',
    fromToken: asset.vToken.underlyingToken,
    receiveNativeToken: !!asset.vToken.underlyingToken.tokenWrapped,
  });

  const { mutateAsync: borrow, isLoading: isBorrowLoading } = useBorrow({
    poolName: pool.name,
    poolComptrollerAddress: pool.comptrollerAddress,
    vToken: asset.vToken,
  });

  const nativeTokenGatewayContractAddress = useGetNativeTokenGatewayContractAddress({
    comptrollerContractAddress: pool.comptrollerAddress,
  });

  const {
    isDelegateApproved,
    isDelegateApprovedLoading,
    isUseUpdatePoolDelegateStatusLoading,
    updatePoolDelegateStatus,
  } = useDelegateApproval({
    delegateeAddress: nativeTokenGatewayContractAddress || '',
    poolComptrollerAddress: pool.comptrollerAddress,
    enabled: formValues.receiveNativeToken && isWrapUnwrapNativeTokenEnabled,
  });

  const isSubmitting = isBorrowLoading;

  const onSubmit: BorrowFormUiProps['onSubmit'] = async ({ fromToken, fromTokenAmountTokens }) => {
    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(fromTokenAmountTokens.trim()),
      token: fromToken,
    });

    return borrow({ amountMantissa, unwrap: formValues.receiveNativeToken });
  };

  return (
    <BorrowFormUi
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
