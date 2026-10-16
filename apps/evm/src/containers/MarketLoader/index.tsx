import { useGetAsset, useGetPool } from 'clients/api';
import { ErrorState, Spinner } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { Redirect } from 'containers/Redirect';
import { useGetMarketsPagePath } from 'hooks/useGetMarketsPagePath';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, Pool } from 'types';
import type { Address } from 'viem';

export interface MarketLoaderProps {
  children: (props: {
    asset: Asset;
    pool: Pool;
  }) => React.ReactNode;
  poolComptrollerAddress?: Address;
  vTokenAddress?: Address;
}

export const MarketLoader: React.FC<MarketLoaderProps> = ({
  poolComptrollerAddress,
  vTokenAddress,
  children,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const { marketsPagePath } = useGetMarketsPagePath();

  const {
    data: getAssetData,
    isLoading: isGetAssetLoading,
    isError: hasAssetError,
    refetch: refetchAsset,
  } = useGetAsset({
    vTokenAddress,
    accountAddress,
  });
  const asset = getAssetData?.asset;
  const isVTokenAddressInvalid = !isGetAssetLoading && !hasAssetError && !asset;

  const { data: getPools } = useGetPool({
    poolComptrollerAddress: poolComptrollerAddress || NULL_ADDRESS,
    accountAddress,
  });
  const pool = getPools?.pool;

  // Redirect to home page if params are invalid
  if (!poolComptrollerAddress || isVTokenAddressInvalid) {
    return <Redirect to={marketsPagePath} />;
  }

  // A failed request is not an unknown market
  if (hasAssetError) {
    return (
      <ErrorState
        className="my-20"
        message={t('market.errorState.failedToFetchMessage')}
        button={{
          label: t('market.errorState.refetchButtonLabel'),
          onClick: refetchAsset,
        }}
      />
    );
  }

  if (!asset || !pool) {
    return <Spinner />;
  }

  return <>{children({ asset, pool })}</>;
};

export default MarketLoader;
