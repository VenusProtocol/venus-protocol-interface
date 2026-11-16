import { useGetLiquidityHubs } from 'clients/api';
import type { CollateralOption } from 'containers/CollateralSelect';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';
import type { Asset } from 'types';
import { areTokensEqual } from 'utilities';

export const useCollateralOptions = ({ collaterals }: { collaterals: Asset[] }) => {
  const { accountAddress } = useAccountAddress();
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const { address: collateralGatewayContractAddress } = useGetContractAddress({
    name: 'CollateralGateway',
  });
  const isLiquidityHubAutoResupplyEnabled =
    useIsFeatureEnabled({ name: 'liquidityHubAutoResupply' }) && !!collateralGatewayContractAddress;

  const { data: getLiquidityHubsData } = useGetLiquidityHubs(
    { accountAddress },
    { enabled: isLiquidityHubAutoResupplyEnabled },
  );

  const liquidityHubs = isLiquidityHubAutoResupplyEnabled
    ? getLiquidityHubsData?.liquidityHubs ?? []
    : [];

  const userWalletNativeTokenBalanceTokens = collaterals.find(
    collateral => collateral.vToken.underlyingToken.isNative,
  )?.userWalletBalanceTokens;

  const options: CollateralOption[] = collaterals.flatMap(asset => {
    const { underlyingToken } = asset.vToken;
    const wrappedToken = isWrapUnwrapNativeTokenEnabled ? underlyingToken.tokenWrapped : undefined;
    const liquidityHub = liquidityHubs.find(hub => areTokensEqual(hub.vhToken, underlyingToken));

    return [
      { asset, token: underlyingToken },
      ...(wrappedToken ? [{ asset, token: wrappedToken }] : []),
      ...(liquidityHub ? [{ asset, token: liquidityHub.vhToken.underlyingToken }] : []),
    ];
  });

  const getDefaultOption = (asset: Asset): CollateralOption => {
    const wrappedToken = isWrapUnwrapNativeTokenEnabled
      ? asset.vToken.underlyingToken.tokenWrapped
      : undefined;

    if (wrappedToken && userWalletNativeTokenBalanceTokens?.gt(asset.userWalletBalanceTokens)) {
      return { asset, token: wrappedToken };
    }

    return { asset, token: asset.vToken.underlyingToken };
  };

  return { options, getDefaultOption };
};
