import { useParams } from 'react-router';
import type { Address } from 'viem';

import { useGetLiquidityHub } from 'clients/api';
import { type CellProps, TokenGroup } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { formatCentsToReadableValue } from 'utilities';
import { TokenInfo } from '../TokenInfo';

export const LiquidityHubInfo = () => {
  const { t } = useTranslation();

  const { vhTokenAddress = NULL_ADDRESS } = useParams<{
    vhTokenAddress: Address;
  }>();

  const { data: getLiquidityHubData } = useGetLiquidityHub({
    vhTokenAddress,
  });
  const liquidityHub = getLiquidityHubData?.liquidityHub;

  const collateralTokens = (liquidityHub?.sources ?? []).reduce<Token[]>(
    (acc, source) => acc.concat(source.collateralTokens),
    [],
  );

  const cells: CellProps[] = [
    {
      label: t('layout.header.supply'),
      value: formatCentsToReadableValue({
        value: liquidityHub?.supplyBalanceCents,
      }),
    },
    {
      label: t('layout.header.liquidity'),
      value: formatCentsToReadableValue({
        value: liquidityHub?.liquidityCents,
      }),
    },
    {
      label: t('layout.header.suppliers'),
      value: liquidityHub?.supplierCount,
    },
    {
      label: t('layout.header.price'),
      value: formatCentsToReadableValue({
        value: liquidityHub?.tokenPriceCents,
        shorten: false,
        maxDecimalPlaces: 6,
      }),
    },
    {
      label: t('layout.header.exposures'),
      value: <TokenGroup tokens={collateralTokens} removeDuplicates limit={6} className="h-6.5" />,
    },
  ];

  const relatedTokens = liquidityHub && [
    liquidityHub.vhToken.underlyingToken,
    liquidityHub.vhToken,
  ];

  return (
    <TokenInfo
      token={liquidityHub?.vhToken.underlyingToken}
      tokenPriceOracleAddress={liquidityHub?.tokenPriceOracleAddress}
      relatedTokens={relatedTokens}
      cells={cells}
    />
  );
};
