import BigNumber from 'bignumber.js';
import { useGetAsset, useGetPool } from 'clients/api';
import { CellGroup, type CellProps, Icon, Spinner, TokenIcon, Wrapper } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useMemo } from 'react';
import { useParams } from 'react-router';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
import type { Address } from 'viem';
import { AddTokenToWalletDropdown } from './AddTokenToWalletDropdown';
import { GoToTokenContractDropdown } from './GoToTokenContractDropdown';
import { UtilizationRate } from './UtilizationRate';

export const MarketInfo = () => {
  const { poolComptrollerAddress = NULL_ADDRESS, vTokenAddress = NULL_ADDRESS } = useParams<{
    poolComptrollerAddress: Address;
    vTokenAddress: Address;
  }>();

  const { t } = useTranslation();

  const { data: getAssetData } = useGetAsset({
    vTokenAddress,
  });
  const asset = getAssetData?.asset;

  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const { data: getPools } = useGetPool({
    poolComptrollerAddress,
  });
  const pool = getPools?.pool;

  const handleGoBack = () => window.history.back();

  const cells: CellProps[] = useMemo(() => {
    const readableMaxLtvPercentage = asset
      ? formatPercentageToReadableValue(
          asset
            ? // We use BigNumber to prevent issues with floating-point numbers
              new BigNumber(asset.collateralFactor)
                .multipliedBy(100)
                .toNumber()
            : undefined,
        )
      : undefined;

    return [
      {
        label: t('layout.header.supply'),
        value: formatCentsToReadableValue({
          value: asset?.supplyBalanceCents,
        }),
      },
      {
        label: t('layout.header.liquidity'),
        value: formatCentsToReadableValue({
          value: asset?.liquidityCents,
        }),
      },
      {
        label: t('layout.header.maxLtv.label'),
        value: readableMaxLtvPercentage,
        tooltip: t('layout.header.maxLtv.tooltip', {
          maxLtv: readableMaxLtvPercentage,
          userCollateralFactor: asset?.collateralFactor,
          tokenSymbol: asset?.vToken.underlyingToken.symbol,
        }),
      },
      {
        label: t('layout.header.utilizationRate'),
        value:
          asset && pool ? (
            <UtilizationRate asset={asset} isIsolatedPoolMarket={pool.isIsolated} />
          ) : (
            PLACEHOLDER_KEY
          ),
      },
      {
        label: t('layout.header.price'),
        value: formatCentsToReadableValue({
          value: asset?.tokenPriceCents,
          isTokenPrice: true,
        }),
      },
    ];
  }, [asset, t, pool]);

  return (
    <div className="pb-6 sm:pb-12 md:pb-10 border-b-lightGrey border-b">
      <Wrapper className="space-y-6 sm:space-y-8">
        <div className="hidden sm:flex items-center h-8 mt-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="h-full pr-3 flex items-center cursor-pointer"
          >
            <Icon name="chevronLeft" className="w-6 h-6 text-white" />
          </button>

          {asset && pool ? (
            <div className="flex items-center gap-3">
              <TokenIcon token={asset.vToken.underlyingToken} className="h-full w-8 shrink-0" />

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-bold text-lg">
                  {asset.vToken.underlyingToken.symbol} ({pool?.name})
                </span>
              </div>

              <AddTokenToWalletDropdown isUserConnected={isUserConnected} vToken={asset.vToken} />

              <GoToTokenContractDropdown vToken={asset.vToken} />
            </div>
          ) : (
            <Spinner className="h-full w-auto" />
          )}
        </div>

        <div>
          <div className="block sm:hidden">
            <div className="flex items-center pb-3">
              {asset && pool && (
                <div className="flex w-full justify-between">
                  <TokenIcon token={asset.vToken.underlyingToken} className="h-full w-8 shrink-0" />
                  <div className="flex gap-[12px]">
                    <AddTokenToWalletDropdown
                      isUserConnected={isUserConnected}
                      vToken={asset.vToken}
                    />
                    <GoToTokenContractDropdown vToken={asset.vToken} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-x-2 gap-y-1 items-center">
              <button
                type="button"
                onClick={handleGoBack}
                className="h-full flex items-center cursor-pointer"
              >
                <Icon name="chevronLeft" className="w-6 h-6 text-white" />
                {(!asset || !pool) && <Spinner className="h-full w-auto" />}
              </button>
              {asset && pool && (
                <span className="text-nowrap font-semibold text-lg">
                  {asset.vToken.underlyingToken.symbol} ({pool?.name})
                </span>
              )}
            </div>
          </div>
        </div>

        <CellGroup variant="secondary" cells={cells} />
      </Wrapper>
    </div>
  );
};
