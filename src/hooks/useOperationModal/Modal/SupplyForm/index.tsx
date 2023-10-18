/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  AccountData,
  Delimiter,
  IsolatedAssetWarning,
  LabeledInlineContent,
  SelectTokenTextField,
  SpendingLimit,
  SwapDetails,
  Toggle,
  TokenTextField,
  toast,
} from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import { useGetSwapRouterContractAddress } from 'packages/contracts';
import { isTokenActionEnabled } from 'packages/tokens';
import { useCallback, useMemo, useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'translation';
import { Asset, ChainId, Pool, Swap, SwapError, TokenBalance } from 'types';
import {
  areTokensEqual,
  convertTokensToWei,
  convertWeiToTokens,
  isFeatureEnabled,
} from 'utilities';

import { useSupply, useSwapTokensAndSupply } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useCollateral from 'hooks/useCollateral';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import useTokenApproval from 'hooks/useTokenApproval';

import { useStyles as useSharedStyles } from '../styles';
import Notice from './Notice';
import SubmitSection, { SubmitSectionProps } from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { FormValues, UseFormInput } from './useForm';

export const PRESET_PERCENTAGES = [25, 50, 75, 100];

export interface SupplyFormUiProps
  extends Pick<
    SubmitSectionProps,
    | 'approveFromToken'
    | 'isApproveFromTokenLoading'
    | 'isFromTokenApproved'
    | 'isFromTokenWalletSpendingLimitLoading'
  > {
  asset: Asset;
  pool: Pool;
  onSubmit: UseFormInput['onSubmit'];
  isSubmitting: boolean;
  onCloseModal: () => void;
  tokenBalances?: TokenBalance[];
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  formValues: FormValues;
  isSwapLoading: boolean;
  revokeFromTokenWalletSpendingLimit: () => Promise<unknown>;
  isRevokeFromTokenWalletSpendingLimitLoading: boolean;
  chainId: ChainId;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  swap?: Swap;
  swapError?: SwapError;
}

export const SupplyFormUi: React.FC<SupplyFormUiProps> = ({
  asset,
  pool,
  onCloseModal,
  onSubmit,
  isSubmitting,
  tokenBalances = [],
  setFormValues,
  formValues,
  isSwapLoading,
  approveFromToken,
  isApproveFromTokenLoading,
  isFromTokenApproved,
  isFromTokenWalletSpendingLimitLoading,
  fromTokenWalletSpendingLimitTokens,
  revokeFromTokenWalletSpendingLimit,
  isRevokeFromTokenWalletSpendingLimitLoading,
  chainId,
  swap,
  swapError,
}) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  const { CollateralModal, toggleCollateral } = useCollateral();

  const isIntegratedSwapEnabled = useMemo(
    () =>
      isFeatureEnabled('integratedSwap') &&
      // Check swap and supply action is enabled for underlying token
      isTokenActionEnabled({
        tokenAddress: asset.vToken.underlyingToken.address,
        action: 'swapAndSupply',
        chainId,
      }) &&
      // Check swap and supply action is enabled for vToken
      isTokenActionEnabled({
        tokenAddress: asset.vToken.address,
        action: 'swapAndSupply',
        chainId,
      }),
    [asset.vToken.underlyingToken],
  );

  const isUsingSwap = useMemo(
    () =>
      isIntegratedSwapEnabled &&
      !areTokensEqual(asset.vToken.underlyingToken, formValues.fromToken),
    [isIntegratedSwapEnabled, formValues.fromToken, asset.vToken.underlyingToken],
  );

  const fromTokenUserWalletBalanceTokens = useMemo(() => {
    // Get wallet balance from the list of fetched token balances if integrated
    // swap feature is enabled and the selected token is different from the
    // asset object
    if (isUsingSwap) {
      const tokenBalance = tokenBalances.find(item =>
        areTokensEqual(item.token, formValues.fromToken),
      );

      return (
        tokenBalance &&
        convertWeiToTokens({
          valueWei: tokenBalance.balanceWei,
          token: tokenBalance.token,
        })
      );
    }

    // Otherwise get the wallet balance from the asset object
    return asset.userWalletBalanceTokens;
  }, [isUsingSwap, asset.userWalletBalanceTokens, formValues.fromToken, tokenBalances]);

  const { handleSubmit, isFormValid, formError } = useForm({
    asset,
    fromTokenUserWalletBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    isFromTokenApproved,
    swap,
    swapError,
    onCloseModal,
    onSubmit,
    formValues,
    setFormValues,
  });

  const readableFromTokenUserWalletBalanceTokens = useFormatTokensToReadableValue({
    value: fromTokenUserWalletBalanceTokens,
    token: formValues.fromToken,
  });

  const handleToggleCollateral = async () => {
    try {
      await toggleCollateral({
        asset,
        poolName: pool.name,
        comptrollerAddress: pool.comptrollerAddress,
      });
    } catch (e) {
      if (e instanceof VError) {
        toast.error({
          message: formatVErrorToReadableString(e),
        });
      }
    }
  };

  const handleRightMaxButtonClick = useCallback(() => {
    // Update field value to correspond to user's wallet balance
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens: new BigNumber(fromTokenUserWalletBalanceTokens || 0).toFixed(),
    }));
  }, [fromTokenUserWalletBalanceTokens]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        {pool.isIsolated && (
          <IsolatedAssetWarning
            token={asset.vToken.underlyingToken}
            pool={pool}
            type="supply"
            css={sharedStyles.isolatedAssetWarning}
            data-testid={TEST_IDS.noticeIsolatedAsset}
          />
        )}

        {(asset.collateralFactor || asset.isCollateralOfUser) && (
          <LabeledInlineContent
            label={t('operationModal.supply.collateral')}
            css={sharedStyles.getRow({ isLast: true })}
          >
            <Toggle onChange={handleToggleCollateral} value={asset.isCollateralOfUser} />
          </LabeledInlineContent>
        )}

        <div css={sharedStyles.getRow({ isLast: true })}>
          {isIntegratedSwapEnabled ? (
            <SelectTokenTextField
              data-testid={TEST_IDS.selectTokenTextField}
              selectedToken={formValues.fromToken}
              value={formValues.amountTokens}
              hasError={!isSubmitting && !!formError && Number(formValues.amountTokens) > 0}
              disabled={
                isSubmitting ||
                isApproveFromTokenLoading ||
                formError === 'SUPPLY_CAP_ALREADY_REACHED'
              }
              onChange={amountTokens =>
                setFormValues(currentFormValues => ({
                  ...currentFormValues,
                  amountTokens,
                }))
              }
              onChangeSelectedToken={fromToken =>
                setFormValues(currentFormValues => ({
                  ...currentFormValues,
                  fromToken,
                }))
              }
              rightMaxButton={{
                label: t('operationModal.supply.rightMaxButtonLabel'),
                onClick: handleRightMaxButtonClick,
              }}
              tokenBalances={tokenBalances}
            />
          ) : (
            <TokenTextField
              data-testid={TEST_IDS.tokenTextField}
              name="amountTokens"
              token={asset.vToken.underlyingToken}
              value={formValues.amountTokens}
              onChange={amountTokens =>
                setFormValues(currentFormValues => ({
                  ...currentFormValues,
                  amountTokens,
                  // Reset selected fixed percentage
                  fixedRepayPercentage: undefined,
                }))
              }
              disabled={
                isSubmitting ||
                isApproveFromTokenLoading ||
                formError === 'SUPPLY_CAP_ALREADY_REACHED'
              }
              rightMaxButton={{
                label: t('operationModal.supply.rightMaxButtonLabel'),
                onClick: handleRightMaxButtonClick,
              }}
              hasError={!isSubmitting && !!formError && Number(formValues.amountTokens) > 0}
            />
          )}

          {!isSubmitting && !isSwapLoading && (
            <Notice asset={asset} swap={swap} formError={formError} />
          )}
        </div>

        <div css={sharedStyles.getRow({ isLast: true })}>
          <LabeledInlineContent
            label={t('operationModal.supply.walletBalance')}
            css={sharedStyles.getRow({ isLast: false })}
          >
            {readableFromTokenUserWalletBalanceTokens}
          </LabeledInlineContent>

          <SpendingLimit
            token={formValues.fromToken}
            walletBalanceTokens={fromTokenUserWalletBalanceTokens}
            walletSpendingLimitTokens={fromTokenWalletSpendingLimitTokens}
            onRevoke={revokeFromTokenWalletSpendingLimit}
            isRevokeLoading={isRevokeFromTokenWalletSpendingLimitLoading}
            data-testid={TEST_IDS.spendingLimit}
          />
        </div>

        {isUsingSwap && (
          <SwapDetails
            action="supply"
            swap={swap}
            data-testid={TEST_IDS.swapDetails}
            css={sharedStyles.getRow({ isLast: true })}
          />
        )}

        <Delimiter css={sharedStyles.getRow({ isLast: true })} />

        <AccountData
          asset={asset}
          pool={pool}
          swap={swap}
          amountTokens={new BigNumber(formValues.amountTokens || 0)}
          action="supply"
          isUsingSwap={isUsingSwap}
        />

        <SubmitSection
          isFormSubmitting={isSubmitting}
          isFormValid={isFormValid}
          isSwapLoading={isSwapLoading}
          swap={swap}
          formError={formError}
          toToken={asset.vToken.underlyingToken}
          fromToken={formValues.fromToken}
          fromTokenAmountTokens={formValues.amountTokens}
          approveFromToken={approveFromToken}
          isApproveFromTokenLoading={isApproveFromTokenLoading}
          isFromTokenApproved={isFromTokenApproved}
          isFromTokenWalletSpendingLimitLoading={isFromTokenWalletSpendingLimitLoading}
          isRevokeFromTokenWalletSpendingLimitLoading={isRevokeFromTokenWalletSpendingLimitLoading}
        />
      </form>

      <CollateralModal />
    </>
  );
};

export interface SupplyFormProps {
  asset: Asset;
  pool: Pool;
  onCloseModal: () => void;
}

const SupplyForm: React.FC<SupplyFormProps> = ({ asset, pool, onCloseModal }) => {
  const { accountAddress, chainId } = useAuth();

  const [formValues, setFormValues] = useState<FormValues>({
    amountTokens: '',
    fromToken: asset.vToken.underlyingToken,
  });

  const swapRouterContractAddress = useGetSwapRouterContractAddress({
    comptrollerContractAddress: pool.comptrollerAddress,
  });

  const spenderAddress = areTokensEqual(asset.vToken.underlyingToken, formValues.fromToken)
    ? asset.vToken.address
    : swapRouterContractAddress;

  const {
    isTokenApproved: isFromTokenApproved,
    approveToken: approveFromToken,
    isApproveTokenLoading: isApproveFromTokenLoading,
    isWalletSpendingLimitLoading: isFromTokenWalletSpendingLimitLoading,
    walletSpendingLimitTokens: fromTokenWalletSpendingLimitTokens,
    revokeWalletSpendingLimit: revokeFromTokenWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading: isRevokeFromTokenWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: formValues.fromToken,
    spenderAddress,
    accountAddress,
  });

  const { data: tokenBalances } = useGetSwapTokenUserBalances(
    {
      accountAddress,
    },
    {
      enabled: isFeatureEnabled('integratedSwap'),
    },
  );

  const { mutateAsync: supply, isLoading: isSupplyLoading } = useSupply({
    poolName: pool.name,
    vToken: asset.vToken,
  });

  const { mutateAsync: swapExactTokensForTokensAndSupply, isLoading: isSwapAndSupplyLoading } =
    useSwapTokensAndSupply({
      poolName: pool.name,
      poolComptrollerAddress: pool.comptrollerAddress,
      vToken: asset.vToken,
    });

  const isSubmitting = isSupplyLoading || isSwapAndSupplyLoading;

  const onSubmit: SupplyFormUiProps['onSubmit'] = async ({
    toVToken,
    fromToken,
    fromTokenAmountTokens,
    swap,
  }) => {
    const isSwapping = !areTokensEqual(fromToken, toVToken.underlyingToken);

    // Handle supply flow
    if (!isSwapping) {
      const amountWei = convertTokensToWei({
        value: new BigNumber(fromTokenAmountTokens.trim()),
        token: fromToken,
      });

      return supply({ amountWei });
    }

    // Throw an error if we're meant to execute a swap but no swap was
    // passed through props. This should never happen since the form is
    // disabled while swap infos are being fetched, but we add this logic
    // as a safeguard
    if (!swap) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    return swapExactTokensForTokensAndSupply({
      swap,
    });
  };

  const swapInfo = useGetSwapInfo({
    fromToken: formValues.fromToken,
    fromTokenAmountTokens: formValues.amountTokens,
    toToken: asset.vToken.underlyingToken,
    direction: 'exactAmountIn',
  });

  return (
    <SupplyFormUi
      asset={asset}
      pool={pool}
      chainId={chainId}
      formValues={formValues}
      setFormValues={setFormValues}
      onCloseModal={onCloseModal}
      tokenBalances={tokenBalances}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      swap={swapInfo.swap}
      swapError={swapInfo.error}
      isSwapLoading={swapInfo.isLoading}
      isFromTokenApproved={isFromTokenApproved}
      approveFromToken={approveFromToken}
      isApproveFromTokenLoading={isApproveFromTokenLoading}
      isFromTokenWalletSpendingLimitLoading={isFromTokenWalletSpendingLimitLoading}
      fromTokenWalletSpendingLimitTokens={fromTokenWalletSpendingLimitTokens}
      revokeFromTokenWalletSpendingLimit={revokeFromTokenWalletSpendingLimit}
      isRevokeFromTokenWalletSpendingLimitLoading={isRevokeFromTokenWalletSpendingLimitLoading}
    />
  );
};

export default SupplyForm;
