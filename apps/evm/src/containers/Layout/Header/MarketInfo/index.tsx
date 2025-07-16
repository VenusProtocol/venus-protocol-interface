import BigNumber from 'bignumber.js';
import { useGetAsset, useGetPool } from 'clients/api';
import { type Cell, CellGroup } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { routes } from 'constants/routing';
import { useBreakpointUp } from 'hooks/responsive';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useMemo } from 'react';
import { matchPath, useLocation, useParams } from 'react-router';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
import type { Address } from 'viem';
import { useIsOnLidoMarketPage } from '../useIsOnLidoMarketPage';
import { SmMarketInfoHeader, XsMarketInfoHeader } from './Header';
import { UtilizationRate } from './UtilizationRate';

export const MarketInfo = () => {
  const {
    poolComptrollerAddress: poolComptrollerAddressParam = NULL_ADDRESS,
    vTokenAddress = NULL_ADDRESS,
  } = useParams<{
    poolComptrollerAddress: Address;
    vTokenAddress: Address;
  }>();

  const { pathname } = useLocation();
  const isOnLidoMarketPage = useIsOnLidoMarketPage();

  const isSmOrUp = useBreakpointUp('sm');

  const {
    corePoolComptrollerContractAddress,
    lstPoolComptrollerContractAddress,
    lstPoolVWstEthContractAddress,
  } = useGetChainMetadata();

  const poolComptrollerAddress = useMemo(() => {
    if (matchPath(routes.corePoolMarket.path, pathname)) {
      return corePoolComptrollerContractAddress;
    }

    if (lstPoolComptrollerContractAddress && matchPath(routes.lidoMarket.path, pathname)) {
      return lstPoolComptrollerContractAddress;
    }

    return poolComptrollerAddressParam;
  }, [
    corePoolComptrollerContractAddress,
    lstPoolComptrollerContractAddress,
    poolComptrollerAddressParam,
    pathname,
  ]);

  const { t } = useTranslation();

  const { data: getAssetData } = useGetAsset({
    vTokenAddress: isOnLidoMarketPage ? lstPoolVWstEthContractAddress : vTokenAddress,
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
