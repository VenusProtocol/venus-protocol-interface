import BigNumber from 'bignumber.js';
import { useGetAsset, useGetPool } from 'clients/api';
import { type Cell, CellGroup, Icon, Spinner, TokenIcon } from 'components';
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

  const cells: Cell[] = useMemo(() => {
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
          collateralFactor: asset?.collateralFactor,
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
    <div className="pt-4 pb-12 md:pb-10 border-b-lightGrey border-b space-y-8">
      <div className="flex items-center h-8 px-4 md:px-6 xl:px-10 max-w-[1360px] mx-auto">
        <button type="button" onClick={handleGoBack} className="h-full pr-3 flex items-center">
          <Icon name="chevronLeft" className="w-6 h-6 text-offWhite" />
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

      <CellGroup
        variant="secondary"
        className="px-4 md:px-6 xl:px-10 max-w-[1360px] mx-auto"
        cells={cells}
      />
    </div>
  );
};
