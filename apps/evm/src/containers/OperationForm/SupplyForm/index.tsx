import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSupply, useSwapTokensAndSupply } from 'clients/api';
import {
  Delimiter,
  LabeledInlineContent,
  NoticeInfo,
  SelectTokenTextField,
  SpendingLimit,
  Toggle,
  TokenTextField,
} from 'components';
import { AccountData } from 'containers/AccountData';
import { Link } from 'containers/Link';
import useCollateral from 'hooks/useCollateral';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useTokenApproval from 'hooks/useTokenApproval';
import {
  useGetNativeTokenGatewayContractAddress,
  useGetSwapRouterContractAddress,
} from 'libs/contracts';
import { VError, displayMutationError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, Pool, Swap, SwapError, TokenBalance } from 'types';
import {
  areTokensEqual,
  convertMantissaToTokens,
  convertTokensToMantissa,
  getUniqueTokenBalances,
} from 'utilities';
import { SwapDetails } from '../SwapDetails';

import { ConnectWallet } from 'containers/ConnectWallet';
import { AssetInfo } from '../AssetInfo';
import Notice from './Notice';
import SubmitSection, { type SubmitSectionProps } from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

export const PRESET_PERCENTAGES = [25, 50, 75, 100];
// TODO: rework or remove this URL, as this is likely to be a temporary solution
const UNISWAP_URL =
  'https://app.uniswap.org/swap?chain=mainnet&inputCurrency=ETH&outputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

export interface SupplyFormUiProps
  extends Pick<
    SubmitSectionProps,
    | 'approveFromToken'
    | 'isApproveFromTokenLoading'
    | 'isFromTokenApproved'
    | 'isFromTokenWalletSpendingLimitLoading'
  > {
  isUserConnected: boolean;
  asset: Asset;
  pool: Pool;
  onSubmit: UseFormInput['onSubmit'];
  isSubmitting: boolean;
  nativeWrappedTokenBalances: TokenBalance[];
  integratedSwapTokenBalances: TokenBalance[];
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  formValues: FormValues;
  isSwapLoading: boolean;
  revokeFromTokenWalletSpendingLimit: () => Promise<unknown>;
  isRevokeFromTokenWalletSpendingLimitLoading: boolean;
  isWrapUnwrapNativeTokenEnabled: boolean;
  isIntegratedSwapFeatureEnabled: boolean;
  canWrapNativeToken: boolean;
  isWrappingNativeToken: boolean;
  isUsingSwap: boolean;
  onSubmitSuccess?: () => void;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  swap?: Swap;
  swapError?: SwapError;
}

export const SupplyFormUi: React.FC<SupplyFormUiProps> = ({
  isUserConnected,
  asset,
  pool,
  onSubmitSuccess,
  onSubmit,
  isSubmitting,
  nativeWrappedTokenBalances,
  integratedSwapTokenBalances,
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
  isWrapUnwrapNativeTokenEnabled,
  isIntegratedSwapFeatureEnabled,
  canWrapNativeToken,
  isWrappingNativeToken,
  isUsingSwap,
  swap,
  swapError,
}) => {
  const { t, Trans } = useTranslation();
  const { toggleCollateral } = useCollateral();

  const tokenBalances = useMemo(
    () => getUniqueTokenBalances(...integratedSwapTokenBalances, ...nativeWrappedTokenBalances),
    [integratedSwapTokenBalances, nativeWrappedTokenBalances],
  );

  const fromTokenUserWalletBalanceTokens = useMemo(() => {
    // Get wallet balance from the list of fetched token balances if integrated
    // swap feature is enabled and the selected token is different from the
    // asset object
    if (isUsingSwap || isWrappingNativeToken) {
      const tokenBalance = tokenBalances.find(item =>
        areTokensEqual(item.token, formValues.fromToken),
      );

      return (
        tokenBalance &&
        convertMantissaToTokens({
          value: tokenBalance.balanceMantissa,
          token: tokenBalance.token,
        })
      );
    }

    // Otherwise get the wallet balance from the asset object
    return asset.userWalletBalanceTokens;
  }, [
    isUsingSwap,
    isWrappingNativeToken,
    asset.userWalletBalanceTokens,
    formValues.fromToken,
    tokenBalances,
  ]);

  // Determine the amount of tokens the user can supply, taking the supply cap and their wallet
  // balance in consideration
  const suppliableFromTokenAmountTokens = useMemo(() => {
    if (isUsingSwap || !fromTokenUserWalletBalanceTokens) {
      return undefined;
    }

    const marginWithSupplyCapTokens = asset.supplyCapTokens
      ? asset.supplyCapTokens.minus(asset.supplyBalanceTokens)
      : new BigNumber(Number.POSITIVE_INFINITY);

    return BigNumber.min(marginWithSupplyCapTokens, fromTokenUserWalletBalanceTokens);
  }, [
    isUsingSwap,
    asset.supplyBalanceTokens,
    fromTokenUserWalletBalanceTokens,
    asset.supplyCapTokens,
  ]);

  const { handleSubmit, isFormValid, formError } = useForm({
    asset,
    fromTokenUserWalletBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    isFromTokenApproved,
    isUsingSwap,
    swap,
    swapError,
    onSubmitSuccess,
    onSubmit,
    formValues,
    setFormValues,
  });

  const readableFromTokenUserWalletBalanceTokens = useFormatTokensToReadableValue({
    value: fromTokenUserWalletBalanceTokens,
    token: formValues.fromToken,
  });

  const readableSuppliableFromTokenAmountTokens = useFormatTokensToReadableValue({
    value: suppliableFromTokenAmountTokens,
    token: formValues.fromToken,
  });

  const handleToggleCollateral = async () => {
    try {
      await toggleCollateral({
        asset,
        poolName: pool.name,
        comptrollerAddress: pool.comptrollerAddress,
      });
    } catch (error) {
      displayMutationError({ error });
    }
  };

  const handleRightMaxButtonClick = useCallback(() => {
    // If user is using swap, we fill the input with the user's wallet balance as we don't have a
    // way to know in advance exactly how much of the fromToken they can supply to
    let amountTokens = new BigNumber(fromTokenUserWalletBalanceTokens || 0);

    // If a user is not swapping, we fill the input with the maximum suppliable amount of fromTokens
    if (!isUsingSwap && suppliableFromTokenAmountTokens) {
      amountTokens = suppliableFromTokenAmountTokens;
    }

    // If user has set a spending limit for fromToken, then we take it in consideration
    if (fromTokenWalletSpendingLimitTokens?.isGreaterThan(0)) {
      amountTokens = BigNumber.min(amountTokens, fromTokenWalletSpendingLimitTokens);
    }

    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens: amountTokens.toFixed(),
    }));
  }, [
    fromTokenUserWalletBalanceTokens,
    setFormValues,
    isUsingSwap,
    fromTokenWalletSpendingLimitTokens,
    suppliableFromTokenAmountTokens,
  ]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isWrapUnwrapNativeTokenEnabled && !!asset.vToken.underlyingToken.tokenWrapped && (
        <NoticeInfo
          description={
            <Trans
              i18nKey="operationForm.supply.youCanWrapNative"
              components={{
                Link: <Link href={UNISWAP_URL} />,
              }}
              values={{
                nativeTokenSymbol: asset.vToken.underlyingToken.tokenWrapped.symbol,
                wrappedNativeTokenSymbol: asset.vToken.underlyingToken.symbol,
              }}
            />
          }
        />
      )}

      {(asset.collateralFactor || asset.isCollateralOfUser) && (
        <LabeledInlineContent label={t('operationForm.supply.collateral')}>
          <Toggle
            onChange={handleToggleCollateral}
            value={asset.isCollateralOfUser}
            disabled={!isUserConnected}
          />
        </LabeledInlineContent>
      )}

      {isIntegratedSwapFeatureEnabled || canWrapNativeToken ? (
        <SelectTokenTextField
          data-testid={TEST_IDS.selectTokenTextField}
          selectedToken={formValues.fromToken}
          value={formValues.amountTokens}
          hasError={!isSubmitting && !!formError && Number(formValues.amountTokens) > 0}
          disabled={
            !isUserConnected ||
            isSubmitting ||
            isApproveFromTokenLoading ||
            formError?.code === 'SUPPLY_CAP_ALREADY_REACHED'
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
            label: t('operationForm.rightMaxButtonLabel'),
            onClick: handleRightMaxButtonClick,
          }}
          tokenBalances={tokenBalances}
          description={
            !isSubmitting && !!formError?.message ? (
              <p className="text-red">{formError.message}</p>
            ) : undefined
          }
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
            }))
          }
          disabled={
            !isUserConnected ||
            isSubmitting ||
            isApproveFromTokenLoading ||
            formError?.code === 'SUPPLY_CAP_ALREADY_REACHED'
          }
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
      )}

      {isUserConnected ? (
        <>
          {!isSubmitting && !isSwapLoading && !formError && <Notice swap={swap} />}

          <div className="space-y-2">
            <LabeledInlineContent
              label={
                isUsingSwap ? t('operationForm.walletBalance') : t('operationForm.suppliableAmount')
              }
            >
              {isUsingSwap
                ? readableFromTokenUserWalletBalanceTokens
                : readableSuppliableFromTokenAmountTokens}
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

          <Delimiter />

          {isUsingSwap && swap && (
            <>
              <SwapDetails action="supply" swap={swap} data-testid={TEST_IDS.swapDetails} />

              <Delimiter />
            </>
          )}

          <div className="space-y-6">
            <div className="space-y-4">
              <AssetInfo
                asset={asset}
                action="supply"
                swap={swap}
                isUsingSwap={isUsingSwap}
                amountTokens={new BigNumber(formValues.amountTokens || 0)}
                renderType="accordion"
              />

              <Delimiter />

              <AccountData
                asset={asset}
                pool={pool}
                swap={swap}
                amountTokens={new BigNumber(formValues.amountTokens || 0)}
                action="supply"
                isUsingSwap={isUsingSwap}
              />
            </div>

            <SubmitSection
              isFormSubmitting={isSubmitting}
              isFormValid={isFormValid}
              isSwapLoading={isSwapLoading}
              isUsingSwap={isUsingSwap}
              swap={swap}
              formError={formError}
              fromToken={formValues.fromToken}
              fromTokenAmountTokens={formValues.amountTokens}
              approveFromToken={approveFromToken}
              isApproveFromTokenLoading={isApproveFromTokenLoading}
              isFromTokenApproved={isFromTokenApproved}
              isFromTokenWalletSpendingLimitLoading={isFromTokenWalletSpendingLimitLoading}
              isRevokeFromTokenWalletSpendingLimitLoading={
                isRevokeFromTokenWalletSpendingLimitLoading
              }
            />
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <AssetInfo asset={asset} action="supply" />

          <ConnectWallet buttonVariant="primary">
            {t('operationForm.connectWalletButtonLabel')}
          </ConnectWallet>
        </div>
      )}
    </form>
  );
};

export interface SupplyFormProps {
  asset: Asset;
  pool: Pool;
  onSubmitSuccess?: () => void;
  userTokenWrappedBalanceMantissa?: BigNumber;
}

const SupplyForm: React.FC<SupplyFormProps> = ({
  asset,
  pool,
  onSubmitSuccess,
  userTokenWrappedBalanceMantissa,
}) => {
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const isIntegratedSwapEnabled = useIsFeatureEnabled({ name: 'integratedSwap' });
  const { accountAddress } = useAccountAddress();

  const nativeTokenGatewayContractAddress = useGetNativeTokenGatewayContractAddress({
    comptrollerContractAddress: pool.comptrollerAddress,
  });

  const isIntegratedSwapFeatureEnabled = useMemo(
    () =>
      isIntegratedSwapEnabled &&
      // Check swap and supply action is enabled for underlying token
      !asset.disabledTokenActions.includes('swapAndSupply'),
    [asset.disabledTokenActions, isIntegratedSwapEnabled],
  );

  const canWrapNativeToken = useMemo(
    () => isWrapUnwrapNativeTokenEnabled && !!asset.vToken.underlyingToken.tokenWrapped,
    [isWrapUnwrapNativeTokenEnabled, asset.vToken.underlyingToken.tokenWrapped],
  );

  const userWalletNativeTokenBalanceTokens = useMemo(() => {
    return userTokenWrappedBalanceMantissa
      ? convertMantissaToTokens({
          token: asset.vToken.underlyingToken.tokenWrapped,
          value: userTokenWrappedBalanceMantissa,
        })
      : undefined;
  }, [asset.vToken.underlyingToken.tokenWrapped, userTokenWrappedBalanceMantissa]);

  const shouldSelectNativeToken =
    canWrapNativeToken && userWalletNativeTokenBalanceTokens?.gt(asset.userWalletBalanceTokens);

  const initialFormValues: FormValues = useMemo(
    () => ({
      amountTokens: '',
      fromToken:
        shouldSelectNativeToken && asset.vToken.underlyingToken.tokenWrapped
          ? asset.vToken.underlyingToken.tokenWrapped
          : asset.vToken.underlyingToken,
    }),
    [asset, shouldSelectNativeToken],
  );

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  // Reset form when user disconnects their wallet
  useEffect(() => {
    if (!accountAddress) {
      setFormValues(initialFormValues);
    }
  }, [accountAddress, initialFormValues]);

  // a user is trying to wrap the chain's native token if
  // 1) the wrap/unwrap feature is enabled
  // 2) the selected form token is the native token
  // 3) the market's underlying token wraps the native token
  const isWrappingNativeToken = useMemo(
    () => canWrapNativeToken && !!formValues.fromToken.isNative,
    [canWrapNativeToken, formValues.fromToken],
  );

  const isUsingSwap = useMemo(
    () =>
      isIntegratedSwapFeatureEnabled &&
      !isWrappingNativeToken &&
      !areTokensEqual(asset.vToken.underlyingToken, formValues.fromToken),
    [
      isIntegratedSwapFeatureEnabled,
      formValues.fromToken,
      asset.vToken.underlyingToken,
      isWrappingNativeToken,
    ],
  );

  const swapRouterContractAddress = useGetSwapRouterContractAddress({
    comptrollerContractAddress: pool.comptrollerAddress,
  });

  const spenderAddress = useMemo(() => {
    if (isWrappingNativeToken) {
      return nativeTokenGatewayContractAddress;
    }
    if (isUsingSwap) {
      return swapRouterContractAddress;
    }

    return asset.vToken.address;
  }, [
    isWrappingNativeToken,
    isUsingSwap,
    asset.vToken.address,
    nativeTokenGatewayContractAddress,
    swapRouterContractAddress,
  ]);

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

  const nativeWrappedTokenBalances: TokenBalance[] = useMemo(() => {
    if (asset.vToken.underlyingToken.tokenWrapped && userTokenWrappedBalanceMantissa) {
      const marketTokenBalance: TokenBalance = {
        token: asset.vToken.underlyingToken,
        balanceMantissa: convertTokensToMantissa({
          token: asset.vToken.underlyingToken,
          value: asset.userWalletBalanceTokens,
        }),
      };
      const nativeTokenBalance: TokenBalance = {
        token: asset.vToken.underlyingToken.tokenWrapped,
        balanceMantissa: userTokenWrappedBalanceMantissa,
      };
      return [marketTokenBalance, nativeTokenBalance];
    }
    return [];
  }, [
    asset.vToken.underlyingToken,
    asset.userWalletBalanceTokens,
    userTokenWrappedBalanceMantissa,
  ]);

  const { data: integratedSwapTokenBalancesData } = useGetSwapTokenUserBalances({
    accountAddress,
  });

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

  const onSubmit: SupplyFormUiProps['onSubmit'] = useCallback(
    async ({ fromToken, fromTokenAmountTokens, swap }) => {
      const amountMantissa = convertTokensToMantissa({
        value: new BigNumber(fromTokenAmountTokens.trim()),
        token: fromToken,
      });

      // Handle supply flow
      if (!isUsingSwap && !isWrappingNativeToken) {
        return supply({ amountMantissa });
      }

      if (isWrappingNativeToken) {
        return supply({
          accountAddress: accountAddress || '',
          amountMantissa,
          wrap: true,
          poolComptrollerContractAddress: pool.comptrollerAddress,
        });
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
    },
    [
      accountAddress,
      isUsingSwap,
      isWrappingNativeToken,
      supply,
      swapExactTokensForTokensAndSupply,
      pool.comptrollerAddress,
    ],
  );

  const swapInfo = useGetSwapInfo({
    fromToken: formValues.fromToken,
    fromTokenAmountTokens: formValues.amountTokens,
    toToken: asset.vToken.underlyingToken,
    direction: 'exactAmountIn',
  });

  return (
    <SupplyFormUi
      isUserConnected={!!accountAddress}
      asset={asset}
      pool={pool}
      isWrapUnwrapNativeTokenEnabled={isWrapUnwrapNativeTokenEnabled}
      isIntegratedSwapFeatureEnabled={isIntegratedSwapFeatureEnabled}
      canWrapNativeToken={canWrapNativeToken}
      isWrappingNativeToken={isWrappingNativeToken}
      isUsingSwap={isUsingSwap}
      formValues={formValues}
      setFormValues={setFormValues}
      onSubmitSuccess={onSubmitSuccess}
      nativeWrappedTokenBalances={nativeWrappedTokenBalances}
      integratedSwapTokenBalances={integratedSwapTokenBalancesData}
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
