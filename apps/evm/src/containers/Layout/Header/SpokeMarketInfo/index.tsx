import { useParams } from 'react-router';
import type { Address } from 'viem';

import { type CellProps, SpokeCollateralGroup } from 'components';
import { useGetSpokeMarket } from 'hooks/useGetSpokeMarket';
import { useSelectedSpokeCollateral } from 'hooks/useSelectedSpokeCollateral';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';
import { TokenInfo } from '../TokenInfo';

export const SpokeMarketInfo: React.FC = () => {
  const { t } = useTranslation();
  const { spokePoolComptrollerAddress, spokeVTokenAddress } = useParams<{
    spokePoolComptrollerAddress: Address;
    spokeVTokenAddress: Address;
  }>();

  const { spokePool, asset } = useGetSpokeMarket({
    spokePoolComptrollerAddress,
    spokeVTokenAddress,
  });
  const collaterals = spokePool?.assets.filter(({ isBorrowable }) => !isBorrowable) ?? [];

  const { selectCollateral } = useSelectedSpokeCollateral({ collaterals });

  const cells: CellProps[] = [
    {
      label: t('spokeMarket.header.supply'),
      value: formatCentsToReadableValue({ value: asset?.hubSupplyBalanceCents }),
    },
    {
      label: t('spokeMarket.header.liquidity'),
      value: formatCentsToReadableValue({ value: asset?.liquidityCents }),
    },
    {
      label: t('spokeMarket.header.price'),
      value: formatCentsToReadableValue({
        value: asset?.tokenPriceCents,
        shorten: false,
        maxDecimalPlaces: 6,
      }),
    },
    {
      label: t('spokeMarket.header.collateral'),
      value: <SpokeCollateralGroup collaterals={collaterals} onRowClick={selectCollateral} />,
    },
  ];

  return (
    <TokenInfo
      token={asset?.vToken.underlyingToken}
      tokenPriceOracleAddress={asset?.tokenPriceOracleAddress}
      relatedTokens={asset && [asset.vToken.underlyingToken, asset.vToken]}
      cells={cells}
    />
  );
};
