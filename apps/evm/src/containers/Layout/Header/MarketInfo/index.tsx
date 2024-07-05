import { useGetAsset, useGetPool } from 'clients/api';
import {
  AddTokenToWalletButton,
  type Cell,
  CellGroup,
  Icon,
  Pill,
  Spinner,
  TokenIcon,
} from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { routes } from 'constants/routing';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useMemo } from 'react';
import { matchPath, useLocation, useParams } from 'react-router';
import { formatCentsToReadableValue } from 'utilities';
import { UtilizationRate } from './UtilizationRate';

export const MarketInfo = () => {
  const { poolComptrollerAddress: poolComptrollerAddressParam = '', vTokenAddress = '' } =
    useParams();
  const { pathname } = useLocation();

  const { corePoolComptrollerContractAddress, stakedEthPoolComptrollerContractAddress } =
    useGetChainMetadata();

  const poolComptrollerAddress = useMemo(() => {
    if (matchPath(routes.corePoolMarket.path, pathname)) {
      return corePoolComptrollerContractAddress;
    }

    if (
      stakedEthPoolComptrollerContractAddress &&
      matchPath(routes.stakedEthPoolMarket.path, pathname)
    ) {
      return stakedEthPoolComptrollerContractAddress;
    }

    return poolComptrollerAddressParam;
  }, [
    corePoolComptrollerContractAddress,
    stakedEthPoolComptrollerContractAddress,
    poolComptrollerAddressParam,
    pathname,
  ]);

  const { t } = useTranslation();

  const { data: getAssetData } = useGetAsset({
    vTokenAddress,
  });
  const asset = getAssetData?.asset;

  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress,
  });
  const pool = getPoolData?.pool;

  const handleGoBack = () => window.history.back();

  const cells: Cell[] = useMemo(() => {
    return [
      {
        label: t('layout.header.reserves'),
        value: formatCentsToReadableValue({
          value: asset?.reserveTokens.multipliedBy(asset.tokenPriceCents),
        }),
      },
      {
        label: t('layout.header.price'),
        value: formatCentsToReadableValue({
          value: asset?.tokenPriceCents,
        }),
      },
      {
        label: t('layout.header.liquidity'),
        value: formatCentsToReadableValue({
          value: asset?.liquidityCents,
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
    ];
  }, [asset, t, asset, pool]);

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

              {pool.isIsolated &&
                pool.comptrollerAddress !== corePoolComptrollerContractAddress && (
                  <Pill>{t('layout.header.isolated')}</Pill>
                )}
            </div>

            {isUserConnected && (
              <AddTokenToWalletButton
                className="shrink-0 bg-background/40 hover:bg-background/40 active:bg-background/40"
                token={asset.vToken.underlyingToken}
              />
            )}
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
