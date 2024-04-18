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
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useTranslation } from 'libs/translations';
import { canAddTokenToWallet, useAccountAddress } from 'libs/wallet';
import { useMemo } from 'react';
import { matchPath, useLocation, useParams } from 'react-router';
import {
  areAddressesEqual,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';

export const MarketInfo = () => {
  const { poolComptrollerAddress: poolComptrollerAddressParam = '', vTokenAddress = '' } =
    useParams();
  const { pathname } = useLocation();

  const { corePoolComptrollerContractAddress, lidoPoolComptrollerContractAddress } =
    useGetChainMetadata();

  const poolComptrollerAddress = useMemo(() => {
    if (matchPath(routes.corePoolMarket.path, pathname)) {
      return corePoolComptrollerContractAddress;
    }

    if (lidoPoolComptrollerContractAddress && matchPath(routes.lidoPoolMarket.path, pathname)) {
      return lidoPoolComptrollerContractAddress;
    }

    return poolComptrollerAddressParam;
  }, [
    corePoolComptrollerContractAddress,
    lidoPoolComptrollerContractAddress,
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

  const goBackTo = useMemo(() => {
    if (areAddressesEqual(poolComptrollerAddress, corePoolComptrollerContractAddress)) {
      return routes.corePool.path;
    }

    if (
      lidoPoolComptrollerContractAddress &&
      areAddressesEqual(poolComptrollerAddress, lidoPoolComptrollerContractAddress)
    ) {
      return routes.lidoPool.path;
    }

    return routes.isolatedPool.path.replace(':poolComptrollerAddress', poolComptrollerAddress);
  }, [
    corePoolComptrollerContractAddress,
    lidoPoolComptrollerContractAddress,
    poolComptrollerAddress,
  ]);

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
        value: formatPercentageToReadableValue(10), // TODO: fetch (see VEN-2545)
      },
    ];
  }, [asset, t]);

  return (
    <div className="pt-4 pb-12 md:pb-10 border-b-lightGrey border-b space-y-8">
      <div className="flex items-center gap-3 flex-wrap px-4 md:px-6 xl:px-10 max-w-[1360px] mx-auto">
        <div className="flex items-center h-8">
          <Link to={goBackTo} className="h-full pr-3 flex items-center">
            <Icon name="chevronLeft" className="w-6 h-6 text-offWhite" />
          </Link>

          {asset && pool ? (
            <>
              <TokenIcon token={asset.vToken.underlyingToken} className="h-full w-8 mr-3" />

              <span className="font-bold">
                {asset.vToken.underlyingToken.symbol} ({pool?.name})
              </span>
            </>
          ) : (
            <Spinner className="h-full" />
          )}
        </div>

        {pool?.isIsolated && <Pill>{t('layout.header.isolated')}</Pill>}

        {asset && isUserConnected && canAddTokenToWallet() && (
          <AddTokenToWalletButton token={asset.vToken.underlyingToken} />
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
