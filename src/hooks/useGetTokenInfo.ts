import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Asset } from 'types';
import { formatToReadablePercentage } from 'utilities';

import { TOKENS } from 'constants/tokens';

const useAssetInfo = (asset?: Asset) => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      asset
        ? [
            {
              label: t('assetInfo.supplyApy'),
              iconSrc: asset.vToken.underlyingToken,
              children: formatToReadablePercentage(asset.supplyApyPercentage),
            },
            {
              label: t('assetInfo.distributionApy'),
              iconSrc: TOKENS.xvs,
              children: formatToReadablePercentage(asset.xvsSupplyApy),
            },
          ]
        : [],
    [asset, t],
  );
};

export default useAssetInfo;
