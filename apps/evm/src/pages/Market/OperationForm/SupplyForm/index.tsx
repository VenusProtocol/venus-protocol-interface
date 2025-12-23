import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import type { Address, Hex } from 'viem';

import { useSupply, useSwapTokensAndSupply } from 'clients/api';
import {
  Delimiter,
  LabeledInlineContent,
  SelectTokenTextField,
  SpendingLimit,
  Toggle,
  TokenTextField,
} from 'components';
import { useCollateral } from 'hooks/useCollateral';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useTokenApproval from 'hooks/useTokenApproval';
import { VError, handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAccountChainId, useChainId } from 'libs/wallet';
import type { Asset, AssetBalanceMutation, Pool, SwapQuote, TokenBalance } from 'types';
import {
  areTokensEqual,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatTokensToReadableValue,
  getSwapToTokenAmountReceivedTokens,
  getUniqueTokenBalances,
  isCollateralActionDisabled,
} from 'utilities';

import { SwitchChainNotice } from 'containers/SwitchChainNotice';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { useAnalytics } from 'libs/analytics';
import { Footer } from '../Footer';
import type { Approval } from '../Footer/types';
import { calculateAmountDollars } from '../calculateAmountDollars';
import TEST_IDS from './testIds';
import useForm, { type FormValues } from './useForm';

export interface SupplyFormProps {
  asset: Asset;
  pool: Pool;
  userTokenWrappedBalanceMantissa?: BigNumber;
}

const SupplyForm: React.FC<SupplyFormProps> = ({
  asset,
  pool,
  userTokenWrappedBalanceMantissa,
}) => {
  const { t } = useTranslation();
  const { captureAnalyticEvent } = useAnalytics();

  const { chainId: accountChainId } = useAccountChainId();
  const { chainId } = useChainId();

  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const isIntegratedSwapEnabled = useIsFeatureEnabled({ name: 'integratedSwap' });
  const isIntegratedSwapFeatureEnabled = useMemo(
    () =>
      isIntegratedSwapEnabled &&
      // Check swap and supply action is enabled for underlying token
      !asset.disabledTokenActions.includes('swapAndSupply'),
    [asset.disabledTokenActions, isIntegratedSwapEnabled],
  );

  const { address: nativeTokenGatewayContractAddress } = useGetContractAddress({
    name: 'NativeTokenGateway',
    poolComptrollerContractAddress: pool.comptrollerAddress,
  });

  const { address: swapRouterContractAddress } = useGetContractAddress({
    name: 'SwapRouter',
    poolComptrollerContractAddress: pool.comptrollerAddress,
  });

  const { toggleCollateral } = useCollateral();

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

  let spenderAddress: undefined | Address = asset.vToken.address;

  if (isWrappingNativeToken) {
    spenderAddress = nativeTokenGatewayContractAddress;
  } else if (isUsingSwap) {
    spenderAddress = swapRouterContractAddress;
  }

  const {
    isTokenApproved: isFromTokenApproved,
    isApproveTokenLoading: isApproveFromTokenLoading,
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

  const { data: integratedSwapTokenBalances } = useGetSwapTokenUserBalances({
    accountAddress,
  });

  const { mutateAsync: supply, isPending: isSupplyLoading } = useSupply();

  const { mutateAsync: swapExactTokensForTokensAndSupply, isPending: isSwapAndSupplyLoading } =
    useSwapTokensAndSupply({
      poolName: pool.name,
      poolComptrollerAddress: pool.comptrollerAddress,
      vToken: asset.vToken,
    });

  const isSubmitting = isSupplyLoading || isSwapAndSupplyLoading;

  const onSubmit = async () => {
    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(formValues.amountTokens.trim()),
      token: formValues.fromToken,
    });

    // Handle supply flow
    if (!isUsingSwap && !isWrappingNativeToken) {
      return supply({ amountMantissa, poolName: pool.name, vToken: asset.vToken });
    }

    if (isWrappingNativeToken) {
      return supply({
        poolName: pool.name,
        vToken: asset.vToken,
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
  };

  const debouncedFormAmountTokens = useDebounceValue(formValues.amountTokens);

  const {
    swap,
    error: swapError,
    isLoading: isSwapLoading,
  } = useGetSwapInfo(
    {
      fromToken: formValues.fromToken,
      fromTokenAmountTokens: debouncedFormAmountTokens,
      toToken: asset.vToken.underlyingToken,
      direction: 'exactAmountIn',
    },
    {
      enabled: isUsingSwap,
    },
  );

  // Format swap into swap quote. This is a temporary code until we update the "swap and supply"
  // feature to use the new API
  let swapQuote: SwapQuote | undefined = undefined;

  if (swap) {
    const shareSwapQuoteProps = {
      fromToken: swap.fromToken,
      toToken: swap.toToken,
      priceImpactPercentage: swap.priceImpactPercentage,
      callData: '0x' as Hex, // Currently unused
    };

    swapQuote =
      swap.direction === 'exactAmountIn'
        ? {
            ...shareSwapQuoteProps,
            direction: 'exact-in',
            fromTokenAmountSoldMantissa: BigInt(swap.fromTokenAmountSoldMantissa.toFixed()),
            expectedToTokenAmountReceivedMantissa: BigInt(
              swap.expectedToTokenAmountReceivedMantissa.toFixed(),
            ),
            minimumToTokenAmountReceivedMantissa: BigInt(
              swap.expectedToTokenAmountReceivedMantissa.toFixed(),
            ),
          }
        : {
            ...shareSwapQuoteProps,
            direction: 'exact-out',
            toTokenAmountReceivedMantissa: BigInt(swap.toTokenAmountReceivedMantissa.toFixed()),
            expectedFromTokenAmountSoldMantissa: BigInt(
              swap.expectedFromTokenAmountSoldMantissa.toFixed(),
            ),
            maximumFromTokenAmountSoldMantissa: BigInt(
              swap.maximumFromTokenAmountSoldMantissa.toFixed(),
            ),
          };
  }

  const approval: Approval | undefined = spenderAddress
    ? {
        type: 'token',
        token: formValues.fromToken,
        spenderAddress,
      }
    : undefined;

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

  // Determine the amount of tokens the user can supply, taking the supply cap, their wallet
  // balance and spending limit in consideration
  const limitTokens = useMemo(() => {
    // If user is using swap, we fill the input with the user's wallet balance as we don't have a
    // way to know in advance exactly how much of the fromToken they can supply to
    let amountTokens = new BigNumber(fromTokenUserWalletBalanceTokens || 0);

    // If user has set a spending limit for fromToken, then we take it in consideration
    if (fromTokenWalletSpendingLimitTokens?.isGreaterThan(0)) {
      amountTokens = BigNumber.min(amountTokens, fromTokenWalletSpendingLimitTokens);
    }

    // Take supply cap in consideration, if user is not swapping
    if (!isUsingSwap) {
      const marginWithSupplyCapTokens = asset.supplyCapTokens.isEqualTo(0)
        ? new BigNumber(0)
        : asset.supplyCapTokens.minus(asset.supplyBalanceTokens);

      amountTokens = BigNumber.min(amountTokens, marginWithSupplyCapTokens);
    }

    return amountTokens;
  }, [
    isUsingSwap,
    asset.supplyBalanceTokens,
    fromTokenUserWalletBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    asset.supplyCapTokens,
  ]);

  let toTokenAmountTokens = isUsingSwap
    ? getSwapToTokenAmountReceivedTokens(swap)
    : debouncedFormAmountTokens;
  toTokenAmountTokens = new BigNumber(toTokenAmountTokens || 0);

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: asset.vToken.address,
      action: 'supply',
      amountTokens: toTokenAmountTokens,
    },
  ];

  const { data: getSimulatedPoolData } = useSimulateBalanceMutations({
    pool,
    balanceMutations,
  });
  const simulatedPool = getSimulatedPoolData?.pool;

  const { handleSubmit, isFormValid, formError } = useForm({
    asset,
    simulatedPool,
    balanceMutations,
    fromTokenUserWalletBalanceTokens,
    pool,
    fromTokenWalletSpendingLimitTokens,
    isFromTokenApproved,
    isUsingSwap,
    swap,
    swapError,
    swapQuote,
    swapQuoteErrorCode: undefined, // TODO: pass when implementing swap and supply flow
    onSubmit,
    formValues,
    setFormValues,
  });

  const readableFromTokenUserWalletBalanceTokens = formatTokensToReadableValue({
    value: fromTokenUserWalletBalanceTokens,
    token: formValues.fromToken,
  });

  const isAccountOnWrongChain = accountChainId !== chainId;
  const isCollateralToggleDisabled = isCollateralActionDisabled({
    disabledTokenActions: asset.disabledTokenActions,
    isCollateralOfUser: asset.isCollateralOfUser,
  });

  const captureAmountSetAnalyticEvent = ({
    amountTokens,
    maxSelected,
  }: { amountTokens: BigNumber | string; maxSelected: boolean }) => {
    if (Number(formValues.amountTokens) > 0) {
      captureAnalyticEvent(
        'supply_amount_set',
        {
          poolName: pool.name,
          assetSymbol: asset.vToken.underlyingToken.symbol,
          usdAmount: calculateAmountDollars({
            amountTokens,
            tokenPriceCents: asset.tokenPriceCents,
          }),
          maxSelected,
        },
        {
          debounced: true,
        },
      );
    }
  };

  const handleToggleCollateral = async () => {
    try {
      await toggleCollateral({
        asset,
        poolName: pool.name,
        comptrollerAddress: pool.comptrollerAddress,
      });
    } catch (error) {
      handleError({ error });
    }
  };

  const handleRightMaxButtonClick = () => {
    captureAmountSetAnalyticEvent({ amountTokens: limitTokens, maxSelected: true });

    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens: limitTokens.toFixed(),
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {(asset.userCollateralFactor || asset.isCollateralOfUser) && (
          <>
            <SwitchChainNotice />

            <LabeledInlineContent label={t('operationForm.collateral')}>
              <Toggle
                onChange={handleToggleCollateral}
                value={asset.isCollateralOfUser}
                disabled={!isUserConnected || isAccountOnWrongChain || isCollateralToggleDisabled}
              />
            </LabeledInlineContent>
          </>
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
            onChange={amountTokens => {
              captureAmountSetAnalyticEvent({ amountTokens, maxSelected: false });

              setFormValues(currentFormValues => ({
                ...currentFormValues,
                amountTokens,
              }));
            }}
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
            onChange={amountTokens => {
              captureAmountSetAnalyticEvent({ amountTokens, maxSelected: false });

              setFormValues(currentFormValues => ({
                ...currentFormValues,
                amountTokens,
              }));
            }}
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

        {isUserConnected && (
          <>
            <div className="space-y-2">
              <LabeledInlineContent label={t('operationForm.walletBalance')}>
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

            <Delimiter />
          </>
        )}

        <Footer
          analyticVariant="supply_form"
          balanceMutations={balanceMutations}
          pool={pool}
          submitButtonLabel={t('operationForm.submitButtonLabel.supply')}
          isFormValid={isFormValid}
          approval={approval}
          simulatedPool={simulatedPool}
          swapFromToken={isUsingSwap ? formValues.fromToken : undefined}
          swapToToken={isUsingSwap ? asset.vToken.underlyingToken : undefined}
          swapQuote={swapQuote}
          isLoading={isSubmitting || isSwapLoading}
        />
      </div>
    </form>
  );
};

export default SupplyForm;
