import BigNumber from 'bignumber.js';
import { useGetAsset, useGetPool } from 'clients/api';
import { type Cell, CellGroup } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useMemo } from 'react';
import { useParams } from 'react-router';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
import type { Address } from 'viem';
import { SmMarketInfoHeader, XsMarketInfoHeader } from './Header';
import { UtilizationRate } from './UtilizationRate';

export const MarketInfo = () => {
  const { poolComptrollerAddress = NULL_ADDRESS, vTokenAddress = NULL_ADDRESS } = useParams<{
    poolComptrollerAddress: Address;
    vTokenAddress: Address;
  }>();

  const isSmOrUp = useBreakpointUp('sm');

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
    <div className="pt-4 pb-6 sm:pb-12 md:pb-10 border-b-lightGrey border-b space-y-6 sm:space-y-8">
      {isSmOrUp ? (
        <SmMarketInfoHeader
          asset={asset}
          pool={pool}
          isUserConnected={isUserConnected}
          handleGoBack={handleGoBack}
        />
      ) : (
        <XsMarketInfoHeader
          asset={asset}
          pool={pool}
          isUserConnected={isUserConnected}
          handleGoBack={handleGoBack}
        />
      )}

      <CellGroup
        variant="secondary"
        className="px-4 md:px-6 xl:px-10 max-w-[1360px] mx-auto"
        cells={cells}
      />
    </div>
  );
};
