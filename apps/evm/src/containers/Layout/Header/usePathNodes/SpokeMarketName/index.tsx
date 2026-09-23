import { useGetSpokeMarket } from 'hooks/useGetSpokeMarket';
import { useTranslation } from 'libs/translations';
import type { Address } from 'viem';

export interface SpokeMarketNameProps {
  spokePoolComptrollerAddress?: Address;
  spokeVTokenAddress?: Address;
}

export const SpokeMarketName: React.FC<SpokeMarketNameProps> = ({
  spokePoolComptrollerAddress,
  spokeVTokenAddress,
}) => {
  const { t } = useTranslation();

  const { spokePool, asset } = useGetSpokeMarket({
    spokePoolComptrollerAddress,
    spokeVTokenAddress,
  });

  if (!spokePool || !asset) {
    return undefined;
  }

  return (
    <>
      {t('breadcrumbs.spokeMarket', {
        tokenSymbol: asset.vToken.underlyingToken.symbol,
        poolName: spokePool.name,
      })}
    </>
  );
};
