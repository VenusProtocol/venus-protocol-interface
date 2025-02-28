import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useGetVTokenBalanceOf, useWithdraw } from 'clients/api';
import { Delimiter, LabeledInlineContent, Toggle, TokenTextField } from 'components';
import { AccountData } from 'containers/AccountData';
import useDelegateApproval from 'hooks/useDelegateApproval';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetNativeTokenGatewayContractAddress } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, Pool } from 'types';
import { cn, convertTokensToMantissa } from 'utilities';

import { NULL_ADDRESS } from 'constants/address';
import { ConnectWallet } from 'containers/ConnectWallet';
import { AssetInfo } from '../AssetInfo';
import SubmitSection from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

export interface WithdrawFormUiProps {
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

export const WithdrawFormUi: React.FC<WithdrawFormUiProps> = ({
  isUserConnected,
  onSubmitSuccess,
  asset,
  pool,
  setFormValues,
  formValues,
  onSubmit,
  isSubmitting,
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
    onSubmitSuccess,
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
      <div className="space-y-4">
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
          disabled={!isUserConnected || isSubmitting}
          rightMaxButton={{
            label: t('operationForm.rightMaxButtonLabel'),
            onClick: handleRightMaxButtonClick,
          }}
          hasError={
            isUserConnected && !isSubmitting && !!formError && Number(formValues.amountTokens) > 0
          }
          description={
            isUserConnected && !isSubmitting && !!formError?.message ? (
              <p className="text-red">{formError.message}</p>
            ) : undefined
          }
        />

        {!isUserConnected && <AssetInfo asset={asset} action="withdraw" />}
      </div>

      <ConnectWallet className={cn('space-y-6', isUserConnected ? 'mt-4' : 'mt-6')}>
        <div className="space-y-4">
          <LabeledInlineContent label={t('operationForm.withdrawableAmount')}>
            {readableWithdrawableAmountTokens}
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

          <AssetInfo
            asset={asset}
            action="withdraw"
            amountTokens={new BigNumber(formValues.amountTokens || 0)}
            renderType="accordion"
          />

          <Delimiter />

          <AccountData
            asset={asset}
            pool={pool}
            amountTokens={new BigNumber(formValues.amountTokens || 0)}
            action="withdraw"
          />
        </div>

        <SubmitSection
          isFormSubmitting={isSubmitting}
          isFormValid={isFormValid}
          isDelegateApproved={isDelegateApproved}
          isDelegateApprovedLoading={isDelegateApprovedLoading}
          approveDelegateAction={approveDelegateAction}
          isApproveDelegateLoading={isApproveDelegateLoading}
        />
      </ConnectWallet>
    </form>
  );
};

export interface WithdrawFormProps {
  asset: Asset;
  pool: Pool;
  onSubmitSuccess?: () => void;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ asset, pool, onSubmitSuccess }) => {
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const { accountAddress } = useAccountAddress();

  const initialFormValues: FormValues = useMemo(
    () => ({
      amountTokens: '',
      fromToken: asset.vToken.underlyingToken,
      receiveNativeToken: !!asset.vToken.underlyingToken.tokenWrapped,
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

  const { mutateAsync: withdraw, isPending: isWithdrawLoading } = useWithdraw({
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
    delegateeAddress: nativeTokenGatewayContractAddress || NULL_ADDRESS,
    poolComptrollerAddress: pool.comptrollerAddress,
    enabled: formValues.receiveNativeToken && isWrapUnwrapNativeTokenEnabled,
  });

  const onSubmit: UseFormInput['onSubmit'] = async ({ fromToken, fromTokenAmountTokens }) => {
    const withdrawFullSupply = asset.userSupplyBalanceTokens.isEqualTo(fromTokenAmountTokens);

    // This case should never be reached, but just in case we throw a generic
    // internal error
    if (!asset || (withdrawFullSupply && !vTokenBalanceMantissa)) {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    return withdraw({
      withdrawFullSupply,
      unwrap: formValues.receiveNativeToken,
      amountMantissa: withdrawFullSupply
        ? vTokenBalanceMantissa!
        : convertTokensToMantissa({
            value: new BigNumber(fromTokenAmountTokens),
            token: fromToken,
          }),
    });
  };

  return (
    <WithdrawFormUi
      isUserConnected={!!accountAddress}
      isWrapUnwrapNativeTokenEnabled={isWrapUnwrapNativeTokenEnabled}
      onSubmitSuccess={onSubmitSuccess}
      asset={asset}
      pool={pool}
      formValues={formValues}
      setFormValues={setFormValues}
      onSubmit={onSubmit}
      isSubmitting={isWithdrawLoading}
      isDelegateApproved={isDelegateApproved}
      isDelegateApprovedLoading={isDelegateApprovedLoading}
      isApproveDelegateLoading={isUseUpdatePoolDelegateStatusLoading}
      approveDelegateAction={() => updatePoolDelegateStatus({ approvedStatus: true })}
    />
  );
};

export default WithdrawForm;
